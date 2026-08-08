export function projectReview(events, candidateId) {
  const selected = events.filter(event => event.candidate_id === candidateId); let state = null;
  for (const event of selected) {
    if (event.expected_version !== (state?.version ?? 0)) throw new Error('review audit has a version gap');
    state = { candidate_id: event.candidate_id, classification_id: event.classification_id, status: event.resulting_status, version: event.resulting_version, taxonomy_version: event.taxonomy_version, reviewer: event.reviewer ?? state?.reviewer ?? null, decision: event.decision ?? state?.decision ?? null, checklist: event.checklist ?? state?.checklist ?? null, field_decisions: event.field_decisions ?? state?.field_decisions ?? null, occurred_at: event.occurred_at };
  }
  return state;
}
