import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '../..');
const formRoot = resolve(root, 'ingestion/review-queue/wave1/forms');
const index = JSON.parse(await readFile(resolve(root, 'ingestion/review-queue/wave1/index.json'), 'utf8'));
const schema = JSON.parse(await readFile(resolve(root, 'ingestion/schemas/human-review-form.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv); const validateSchema = ajv.compile(schema);
const sha = value => `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const expected = { TJMG: 13, TJRJ: 13, TJGO: 15, TJPE: 22, TJSP: 14 };
const forms = [], errors = [];

for (const tribunal of Object.keys(expected)) {
  const names = (await readdir(resolve(formRoot, tribunal))).filter(name => name.endsWith('.review.yaml'));
  if (names.length !== expected[tribunal]) errors.push(`${tribunal}: expected ${expected[tribunal]} forms, found ${names.length}`);
  for (const name of names) {
    const form = YAML.parse(await readFile(resolve(formRoot, tribunal, name), 'utf8'));
    if (!validateSchema(form)) errors.push(`${tribunal}/${name}: schema ${ajv.errorsText(validateSchema.errors)}`);
    if (form.tribunal !== tribunal) errors.push(`${tribunal}/${name}: tribunal mismatch`);
    if (form.input_hash !== sha(form.candidate_snapshot)) errors.push(`${tribunal}/${name}: candidate snapshot changed; new human review required`);
    if (!form.candidate_snapshot?.evidence?.identity_verified || !form.candidate_snapshot?.evidence?.full_text_available) errors.push(`${tribunal}/${name}: BLOCKED_REVIEW_EVIDENCE`);
    if (!['A', 'B'].includes(form.candidate_snapshot?.selection?.class) || form.candidate_snapshot?.selection?.preliminary_decision !== 'PROMOVER') errors.push(`${tribunal}/${name}: C/D or non-PROMOVER candidate entered review`);
    const review = form.human_review ?? {}, pending = form.review_state === 'PENDING_HUMAN_REVIEW';
    const scalarFields = ['decision', 'result_fidelity', 'legal_question_fidelity', 'evidence_sufficient', 'reviewer_notes', 'reviewer_identity', 'reviewed_at'];
    if (pending) {
      if (scalarFields.some(field => review[field] !== null) || review.theses?.some(item => item.decision !== null || item.corrected_orientation !== null) || review.foundations?.some(item => item.decision !== null)) errors.push(`${tribunal}/${name}: pending form contains implicit human decision`);
    } else {
      if (!['APPROVE', 'REJECT', 'NEEDS_CORRECTION'].includes(review.decision)) errors.push(`${tribunal}/${name}: invalid or missing decision`);
      if (!review.reviewer_identity || Number.isNaN(Date.parse(review.reviewed_at))) errors.push(`${tribunal}/${name}: real reviewer identity and timestamp are required`);
      if (![review.result_fidelity, review.legal_question_fidelity, review.evidence_sufficient].every(value => ['YES', 'NO'].includes(value))) errors.push(`${tribunal}/${name}: all fidelity/evidence questions are required`);
      if (review.theses.some(item => !['ACCEPT', 'REJECT', 'ADJUST_ORIENTATION'].includes(item.decision))) errors.push(`${tribunal}/${name}: every thesis requires a decision`);
      if (review.theses.some(item => item.decision === 'ADJUST_ORIENTATION' && !item.corrected_orientation)) errors.push(`${tribunal}/${name}: adjusted thesis orientation is missing`);
      if (review.foundations.some(item => !['ACCEPT', 'REJECT'].includes(item.decision))) errors.push(`${tribunal}/${name}: every foundation requires a decision`);
      const notesRequired = review.decision !== 'APPROVE' || review.result_fidelity === 'NO' || review.legal_question_fidelity === 'NO' || review.evidence_sufficient === 'NO' || review.theses.some(item => item.decision === 'ADJUST_ORIENTATION');
      if (notesRequired && !review.reviewer_notes?.trim()) errors.push(`${tribunal}/${name}: reviewer_notes is required for rejection, correction, disagreement or adjustment`);
      if (review.decision === 'APPROVE' && (review.result_fidelity !== 'YES' || review.legal_question_fidelity !== 'YES' || review.evidence_sufficient !== 'YES')) errors.push(`${tribunal}/${name}: positive conclusion is fail-closed by fidelity/evidence disagreement`);
      const expectedState = review.decision === 'APPROVE' ? 'HUMAN_APPROVED' : review.decision === 'REJECT' ? 'HUMAN_REJECTED' : 'HUMAN_REVIEW_NEEDS_CORRECTION';
      if (form.review_state !== expectedState) errors.push(`${tribunal}/${name}: review_state must be ${expectedState}`);
    }
    forms.push(form);
  }
}

const ids = forms.map(form => form.candidate_id), processes = forms.map(form => form.candidate_snapshot.identity.process);
if (forms.length !== 77 || index.total !== 77) errors.push(`global count must be 77, found forms=${forms.length}, index=${index.total}`);
if (new Set(ids).size !== ids.length || new Set(processes).size !== processes.length) errors.push('duplicate candidate or CNJ detected');
const indexIds = new Set(index.forms.map(item => item.candidate_id));
if (ids.some(id => !indexIds.has(id)) || indexIds.size !== ids.length) errors.push('index membership differs from forms');

const summary = { total: forms.length, pending: forms.filter(form => form.review_state === 'PENDING_HUMAN_REVIEW').length, approved: forms.filter(form => form.review_state === 'HUMAN_APPROVED').length, rejected: forms.filter(form => form.review_state === 'HUMAN_REJECTED').length, needs_correction: forms.filter(form => form.review_state === 'HUMAN_REVIEW_NEEDS_CORRECTION').length, integrity: errors.length ? 'FAIL' : 'PASS', errors };
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
