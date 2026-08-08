import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  applyReviewCommand, classifySyntheticCandidate, createIntermediateArtifact, createTaxonomyView,
  evaluateClassifications, projectReview, validateIntermediateArtifact
} from '../../src/ingestion/index.mjs';

const read = async path => readFile(new URL(path, import.meta.url), 'utf8');
const taxonomy = YAML.parse(await read('../../data/taxonomy/taxonomy.yaml'));
const aliases = YAML.parse(await read('../../data/taxonomy/aliases.yaml'));
const fixtures = JSON.parse(await read('../../ingestion/fixtures/simulated-classification/candidates.json'));
const view = createTaxonomyView(taxonomy, aliases); const classificationPolicy = { version: 1, classifiable_families: ['produto','tema','prova','perfil_consumidor','meio_contratacao'] };
const reviewPolicy = { authorized_roles: ['legal_reviewer'], reason_codes: ['evidence_requires_correction','insufficient_evidence','return_for_reclassification'], required_checklist: ['source_checked','evidence_checked','taxonomy_checked','result_fields_checked'] };
const reviewer = { id: 'reviewer-synthetic-opaque', role: 'legal_reviewer' }; const at = '2026-08-08T00:00:00Z'; const checklist = { source_checked: true, evidence_checked: true, taxonomy_checked: true, result_fields_checked: true };
const cleanCandidates = ['pending','approve','correct','reject','return'].map(label => ({ ...structuredClone(fixtures[0]), candidate_id: `cand-synthetic-${label}` }));
const classifications = [...cleanCandidates, ...fixtures.slice(1)].map(candidate => classifySyntheticCandidate(candidate, view, classificationPolicy)); const eventsByCandidate = new Map(); const artifacts = [];
for (const classification of classifications.slice(0, 5)) {
  const base = { candidate_id: classification.candidate_id, classification_id: classification.classification_id, taxonomy_version: view.version, occurred_at: at }; let events = [];
  const run = (type, expected_version, idempotency_key, extra = {}) => { events = applyReviewCommand(events, { ...base, type, expected_version, idempotency_key, ...extra }, reviewPolicy).events; };
  run('enqueue', 0, `${classification.candidate_id}-enqueue`); if (classification.candidate_id.endsWith('pending')) { eventsByCandidate.set(classification.candidate_id, events); continue; }
  run('claim', 1, `${classification.candidate_id}-claim`, { reviewer }); run('start', 2, `${classification.candidate_id}-start`, { reviewer }); const decision = classification.candidate_id.split('-').at(-1);
  const fields = classification.fields.map(field => ({ field: field.field, suggested_value: field.suggested_value, human_value: decision === 'correct' && field.field === 'produto' ? 'rcc' : field.suggested_value, action: decision === 'correct' && field.field === 'produto' ? 'correct' : 'accept' }));
  const reason_code = decision === 'correct' ? 'evidence_requires_correction' : decision === 'reject' ? 'insufficient_evidence' : decision === 'return' ? 'return_for_reclassification' : undefined;
  run('decide', 3, `${classification.candidate_id}-decision`, { reviewer, decision, reason_code, checklist: ['approve','correct'].includes(decision) ? checklist : undefined, field_decisions: ['approve','correct'].includes(decision) ? fields : undefined });
  const review = projectReview(events, classification.candidate_id); eventsByCandidate.set(classification.candidate_id, events);
  if (['approve','correct'].includes(decision)) artifacts.push(createIntermediateArtifact({ review, classification, currentTaxonomyVersion: view.version, outputPath: `ingestion/intermediate/${classification.candidate_id}.reviewed.json` }));
}
const schema = JSON.parse(await read('../../ingestion/schemas/reviewed-candidate.schema.json')); const validate = new Ajv2020().compile(schema); artifacts.forEach(artifact => validateIntermediateArtifact(artifact, validate));
const states = [...eventsByCandidate.values()].map(events => projectReview(events, events[0].candidate_id)); const metrics = evaluateClassifications(classifications, ['approve','correct','reject','return']);
console.log(JSON.stringify({ funnel: { eligible: classifications.length, classified: classifications.length, abstained: classifications.filter(c => c.fields.every(f => f.status === 'abstained')).length, contradictory: classifications.filter(c => c.fields.some(f => f.status === 'contradictory')).length, pending: states.filter(s => s.status === 'pending').length, approved: states.filter(s => s.decision === 'approve').length, corrected: states.filter(s => s.decision === 'correct').length, rejected: states.filter(s => s.decision === 'reject').length, returned: states.filter(s => s.decision === 'return').length, exportable: artifacts.length }, metrics }, null, 2));
