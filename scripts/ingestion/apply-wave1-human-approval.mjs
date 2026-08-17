import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '../..');
const formRoot = resolve(root, 'ingestion/review-queue/wave1/forms');
const declarationPath = resolve(root, 'ingestion/config/wave1-human-review-declaration.json');
const auditPath = resolve(root, 'ingestion/audit/wave1-human-review-approval.json');
const indexPath = resolve(root, 'ingestion/review-queue/wave1/index.json');
const declaration = JSON.parse(await readFile(declarationPath, 'utf8'));
const forms = [];

for (const tribunal of ['TJMG', 'TJRJ', 'TJGO', 'TJPE', 'TJSP']) {
  for (const name of (await readdir(resolve(formRoot, tribunal))).filter(name => name.endsWith('.review.yaml'))) {
    const path = resolve(formRoot, tribunal, name);
    forms.push({ path, form: YAML.parse(await readFile(path, 'utf8')) });
  }
}
const digestInput = forms.map(({ form }) => `${form.candidate_id}|${form.input_hash}`).sort().join('\n');
const scopeDigest = `sha256:${createHash('sha256').update(digestInput).digest('hex')}`;
if (forms.length !== declaration.candidate_count || forms.length !== 77) throw new Error('declaration count does not match the review batch');
if (scopeDigest !== declaration.scope_digest) throw new Error('declaration scope digest does not match the submitted candidates');
if (!declaration.reviewer_identity || Number.isNaN(Date.parse(declaration.recorded_at))) throw new Error('real reviewer identity and recorded timestamp are required');
if (declaration.decision !== 'APPROVE_ALL_AS_SUBMITTED' || !Object.values(declaration.attestations).every(value => typeof value === 'number' ? value === 0 : value === true)) throw new Error('the declaration does not approve the full submitted scope');

for (const entry of forms) {
  const review = entry.form.human_review;
  entry.form.review_state = 'HUMAN_APPROVED';
  review.decision = 'APPROVE';
  review.result_fidelity = 'YES';
  review.legal_question_fidelity = 'YES';
  review.evidence_sufficient = 'YES';
  review.theses = review.theses.map(item => ({ ...item, decision: 'ACCEPT', corrected_orientation: null }));
  review.foundations = review.foundations.map(item => ({ ...item, decision: 'ACCEPT' }));
  review.reviewer_notes = null;
  review.reviewer_identity = declaration.reviewer_identity;
  review.reviewed_at = declaration.recorded_at;
  await writeFile(entry.path, YAML.stringify(entry.form, { lineWidth: 0 }));
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
index.state = 'HUMAN_REVIEW_COMPLETE';
for (const tribunal of Object.keys(index.counts)) index.counts[tribunal] = { pending: 0, approved: index.expected[tribunal], rejected: 0, needs_correction: 0 };
index.forms = index.forms.map(item => ({ ...item, review_state: 'HUMAN_APPROVED' }));
index.human_review = { declaration: 'ingestion/config/wave1-human-review-declaration.json', reviewer_identity: declaration.reviewer_identity, recorded_at: declaration.recorded_at, scope_digest: scopeDigest };
await writeFile(indexPath, JSON.stringify(index, null, 2) + '\n');

await mkdir(resolve(root, 'ingestion/audit'), { recursive: true });
await writeFile(auditPath, JSON.stringify({ artifact_kind: 'predator_human_review_bulk_materialization_audit', schema_version: '1.0.0', batch_id: declaration.batch_id, selection_commit: declaration.selection_commit, declaration_path: 'ingestion/config/wave1-human-review-declaration.json', scope_digest: scopeDigest, reviewer_identity: declaration.reviewer_identity, recorded_at: declaration.recorded_at, mechanical_operation: true, approved: 77, rejected: 0, needs_correction: 0, previous_invalid_attempt_preserved_in_declaration: true, next_gate: 'READY_FOR_MATERIALIZATION_PROPOSAL', final_authorization: false }, null, 2) + '\n');
console.log(JSON.stringify({ approved: 77, rejected: 0, needs_correction: 0, reviewer: declaration.reviewer_identity, scope_digest: scopeDigest, state: 'HUMAN_REVIEW_COMPLETE', next_gate: 'READY_FOR_MATERIALIZATION_PROPOSAL' }, null, 2));
