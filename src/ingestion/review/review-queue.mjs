import { assertChecklist, assertReason, assertReviewer } from './review-policy.mjs';
import { projectReview } from './review-projection.mjs';

const eventId = key => `review-event-${key}`;
export function applyReviewCommand(events, command, policy) {
  if (!command.idempotency_key || !command.candidate_id || !command.taxonomy_version || Number.isNaN(Date.parse(command.occurred_at))) throw new Error('complete versioned review command is required');
  const duplicate = events.find(event => event.idempotency_key === command.idempotency_key); if (duplicate) return { events, event: duplicate, idempotent: true };
  const current = projectReview(events, command.candidate_id); const version = current?.version ?? 0;
  if (command.expected_version !== version) throw new Error('stale review version');
  let eventType; let resultingStatus; const extra = {};
  if (command.type === 'enqueue') { if (current) throw new Error('item already queued'); eventType = 'enqueued'; resultingStatus = 'pending'; }
  else {
    assertReviewer(command.reviewer, policy);
    if (command.taxonomy_version !== current.taxonomy_version) throw new Error('taxonomy changed; reclassification required');
    extra.reviewer = structuredClone(command.reviewer);
    if (command.type === 'claim') { if (current.status !== 'pending' && current.status !== 'returned') throw new Error('item cannot be claimed'); eventType = 'claimed'; resultingStatus = 'claimed'; }
    else if (command.type === 'start') { if (current.status !== 'claimed' || current.reviewer.id !== command.reviewer.id) throw new Error('item is not claimed by reviewer'); eventType = 'review_started'; resultingStatus = 'in_review'; }
    else if (command.type === 'supersede') { eventType = 'superseded'; resultingStatus = 'superseded'; }
    else if (command.type === 'decide') {
      if (current.status !== 'in_review' || current.reviewer.id !== command.reviewer.id) throw new Error('item is not in review by reviewer');
      if (!['approve','correct','reject','return'].includes(command.decision)) throw new Error('invalid human decision');
      if (command.decision === 'approve' || command.decision === 'correct') { assertChecklist(command.checklist, policy); if (!Array.isArray(command.field_decisions) || command.field_decisions.length === 0) throw new Error('explicit field decisions are required'); }
      if (command.decision === 'correct' && command.field_decisions.some(field => !('suggested_value' in field) || !('human_value' in field))) throw new Error('correction must preserve suggested and human values');
      if (command.decision !== 'approve') assertReason(command.reason_code, policy);
      eventType = command.decision === 'return' ? 'returned' : 'decision_recorded'; resultingStatus = command.decision === 'return' ? 'returned' : 'decided';
      Object.assign(extra, { decision: command.decision, reason_code: command.reason_code ?? null, notes: command.notes ?? null, checklist: structuredClone(command.checklist ?? null), field_decisions: structuredClone(command.field_decisions ?? null) });
    } else throw new Error('invalid review command');
  }
  const event = Object.freeze({ event_id: eventId(command.idempotency_key), candidate_id: command.candidate_id, classification_id: command.classification_id ?? current?.classification_id, taxonomy_version: command.taxonomy_version, event_type: eventType, expected_version: version, resulting_version: version + 1, resulting_status: resultingStatus, idempotency_key: command.idempotency_key, occurred_at: command.occurred_at, ...extra });
  return { events: [...events, event], event, idempotent: false };
}
