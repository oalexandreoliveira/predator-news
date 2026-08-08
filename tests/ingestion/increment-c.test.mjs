import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import YAML from 'yaml';
import {
  applyReviewCommand, classifySyntheticCandidate, createIntermediateArtifact, createTaxonomyView,
  evaluateClassifications, executeReviewCommand, projectReview, readReviewAudit,
  validateClassification, validateConfidence, verifyEvidence
} from '../../src/ingestion/index.mjs';

const taxonomy = YAML.parse(await readFile(new URL('../../data/taxonomy/taxonomy.yaml', import.meta.url), 'utf8'));
const aliases = YAML.parse(await readFile(new URL('../../data/taxonomy/aliases.yaml', import.meta.url), 'utf8'));
const candidates = JSON.parse(await readFile(new URL('../../ingestion/fixtures/simulated-classification/candidates.json', import.meta.url), 'utf8'));
const taxonomyView = createTaxonomyView(taxonomy, aliases);
const classPolicy = { version: 1, classifiable_families: ['produto','tema','prova','perfil_consumidor','meio_contratacao'] };
const reviewPolicy = { authorized_roles: ['legal_reviewer'], reason_codes: ['evidence_requires_correction','insufficient_evidence','unsupported_value','taxonomy_changed','return_for_reclassification'], required_checklist: ['source_checked','evidence_checked','taxonomy_checked','result_fields_checked'] };
const reviewer = { id: 'reviewer-opaque-001', role: 'legal_reviewer' };
const occurred_at = '2026-08-08T00:00:00Z';
const checklist = { source_checked: true, evidence_checked: true, taxonomy_checked: true, result_fields_checked: true };
const clean = classifySyntheticCandidate(candidates[0], taxonomyView, classPolicy);
const command = (type, version, key, extra = {}) => ({ type, candidate_id: clean.candidate_id, classification_id: clean.classification_id, taxonomy_version: clean.taxonomy_version, expected_version: version, idempotency_key: key, occurred_at, reviewer, ...extra });
function inReview() {
  let events = applyReviewCommand([], command('enqueue', 0, 'enqueue', { reviewer: undefined })).events;
  events = applyReviewCommand(events, command('claim', 1, 'claim'), reviewPolicy).events;
  events = applyReviewCommand(events, command('start', 2, 'start'), reviewPolicy).events; return events;
}
const acceptedFields = clean.fields.map(field => ({ field: field.field, action: 'accept', suggested_value: field.suggested_value, human_value: field.suggested_value }));

test('contrato produz somente sugestão e confiança alta não decide', () => {
  assert.equal(clean.kind, 'classification_suggestion'); assert.equal('decision' in clean, false); assert.equal(clean.fields.at(-1).confidence, 1); assert.equal('approved' in clean, false);
});
test('classificador é local, determinístico e identidade inclui política e taxonomia', () => {
  let calls = 0; const original = globalThis.fetch; globalThis.fetch = async () => { calls++; };
  try { assert.deepEqual(classifySyntheticCandidate(candidates[0], taxonomyView, classPolicy), clean); assert.equal(calls, 0); } finally { globalThis.fetch = original; }
  assert.notEqual(classifySyntheticCandidate(candidates[0], taxonomyView, { ...classPolicy, version: 2 }).classification_id, clean.classification_id);
  const changed = createTaxonomyView({ ...taxonomy, version: 2 }, aliases); assert.notEqual(classifySyntheticCandidate(candidates[0], changed, classPolicy).classification_id, clean.classification_id);
});
test('sugestões pertencem à taxonomia e alias não declarado não é aproximado', () => {
  assert.ok(clean.fields.filter(f => f.status === 'suggested').every(f => taxonomyView.has(f.field, f.suggested_value)));
  const input = structuredClone(candidates[3]); input.signals.tema[0].value = 'consentiment'; const result = classifySyntheticCandidate(input, taxonomyView, classPolicy);
  assert.equal(result.fields.find(f => f.field === 'tema').status, 'unsupported'); assert.equal(taxonomy.families.tema.includes('consentiment'), false);
});
test('abstenção, contradição e proposta taxonômica ficam explícitas', () => {
  const abstain = classifySyntheticCandidate(candidates[1], taxonomyView, classPolicy); assert.ok(abstain.fields.every(f => f.status === 'abstained'));
  const contradictory = classifySyntheticCandidate(candidates[2], taxonomyView, classPolicy).fields.find(f => f.field === 'tema'); assert.equal(contradictory.status, 'contradictory'); assert.equal(contradictory.evidence.length, 2);
  const unsupported = classifySyntheticCandidate(candidates[3], taxonomyView, classPolicy); assert.equal(unsupported.taxonomy_proposals[0].approvable_in_classification, false);
});
test('evidência tem localizador verificável e confiança fora da escala falha', () => {
  assert.ok(clean.fields.flatMap(f => f.evidence).every(e => verifyEvidence(candidates[0], e))); assert.throws(() => validateConfidence(1.01), /confidence/);
  const invalid = structuredClone(clean); invalid.fields[0].confidence = -1; assert.throws(() => validateClassification(invalid, taxonomyView), /confidence/);
});
test('fila é idempotente e somente papel autorizado reivindica', () => {
  const first = applyReviewCommand([], command('enqueue', 0, 'queue', { reviewer: undefined })); const again = applyReviewCommand(first.events, command('enqueue', 0, 'queue', { reviewer: undefined })); assert.equal(again.idempotent, true); assert.equal(again.events.length, 1);
  assert.throws(() => applyReviewCommand(first.events, command('claim', 1, 'bad', { reviewer: { id: 'opaque', role: 'observer' } }), reviewPolicy), /not authorized/);
});
test('reivindicação e decisão concorrentes rejeitam versão obsoleta', () => {
  let events = applyReviewCommand([], command('enqueue', 0, 'q', { reviewer: undefined })).events; events = applyReviewCommand(events, command('claim', 1, 'c1'), reviewPolicy).events;
  assert.throws(() => applyReviewCommand(events, command('claim', 1, 'c2', { reviewer: { id: 'reviewer-opaque-002', role: 'legal_reviewer' } }), reviewPolicy), /stale/);
  events = applyReviewCommand(events, command('start', 2, 's'), reviewPolicy).events; events = applyReviewCommand(events, command('decide', 3, 'd1', { decision: 'approve', checklist, field_decisions: acceptedFields }), reviewPolicy).events;
  assert.throws(() => applyReviewCommand(events, command('decide', 3, 'd2', { decision: 'reject', reason_code: 'insufficient_evidence' }), reviewPolicy), /stale/);
});
test('approve exige metadados, checklist e decisões por campo', () => {
  const events = inReview(); assert.throws(() => applyReviewCommand(events, command('decide', 3, 'a1', { decision: 'approve', checklist: {}, field_decisions: acceptedFields }), reviewPolicy), /checklist/);
  assert.throws(() => applyReviewCommand(events, { ...command('decide', 3, 'a2', { decision: 'approve', checklist, field_decisions: acceptedFields }), occurred_at: null }, reviewPolicy), /complete versioned/);
});
test('correct preserva sugestão e valor humano; reject e return exigem motivo', () => {
  const events = inReview(); const correction = acceptedFields.map((f, i) => i ? f : { ...f, action: 'correct', human_value: 'rcc' });
  const corrected = applyReviewCommand(events, command('decide', 3, 'corr', { decision: 'correct', reason_code: 'evidence_requires_correction', checklist, field_decisions: correction }), reviewPolicy); assert.equal(corrected.event.field_decisions[0].suggested_value, 'rmc'); assert.equal(corrected.event.field_decisions[0].human_value, 'rcc');
  assert.throws(() => applyReviewCommand(events, command('decide', 3, 'reject', { decision: 'reject' }), reviewPolicy), /reason/);
  assert.throws(() => applyReviewCommand(events, command('decide', 3, 'return', { decision: 'return' }), reviewPolicy), /reason/);
  const returned = applyReviewCommand(events, command('decide', 3, 'returned', { decision: 'return', reason_code: 'return_for_reclassification' }), reviewPolicy); assert.equal(projectReview(returned.events, clean.candidate_id).status, 'returned');
});
test('auditoria append-only reconstrói estado e evita decisão duplicada', async () => {
  const path = join(await mkdtemp(join(tmpdir(), 'predator-review-')), 'audit.jsonl');
  await executeReviewCommand(path, command('enqueue', 0, 'persist-q', { reviewer: undefined }), reviewPolicy); await executeReviewCommand(path, command('claim', 1, 'persist-c'), reviewPolicy); const before = JSON.stringify((await readReviewAudit(path))[0]);
  await executeReviewCommand(path, command('claim', 1, 'persist-c'), reviewPolicy); const events = await readReviewAudit(path); assert.equal(events.length, 2); assert.equal(JSON.stringify(events[0]), before); assert.equal(projectReview(events, clean.candidate_id).status, 'claimed');
});
test('mudança de taxonomia impede decisão e exportação', () => {
  const events = inReview(); assert.throws(() => applyReviewCommand(events, { ...command('decide', 3, 'tax', { decision: 'approve', checklist, field_decisions: acceptedFields }), taxonomy_version: 'sha256:changed' }, reviewPolicy), /taxonomy changed/);
  const approved = applyReviewCommand(events, command('decide', 3, 'approved', { decision: 'approve', checklist, field_decisions: acceptedFields }), reviewPolicy); const review = projectReview(approved.events, clean.candidate_id);
  assert.throws(() => createIntermediateArtifact({ review, classification: clean, currentTaxonomyVersion: 'changed', outputPath: 'x.reviewed.json' }), /taxonomy changed/);
});
test('somente decisão humana válida exporta artefato não canônico e sem frase de peça', () => {
  assert.throws(() => createIntermediateArtifact({ review: { status: 'pending' }, classification: clean, currentTaxonomyVersion: clean.taxonomy_version, outputPath: 'x.reviewed.json' }), /valid human review/);
  for (const decision of ['reject','return']) { const events = inReview(); const result = applyReviewCommand(events, command('decide', 3, `no-${decision}`, { decision, reason_code: decision === 'reject' ? 'insufficient_evidence' : 'return_for_reclassification' }), reviewPolicy); assert.throws(() => createIntermediateArtifact({ review: projectReview(result.events, clean.candidate_id), classification: clean, currentTaxonomyVersion: clean.taxonomy_version, outputPath: 'x.reviewed.json' })); }
  const approved = applyReviewCommand(inReview(), command('decide', 3, 'yes', { decision: 'approve', checklist, field_decisions: acceptedFields }), reviewPolicy); const artifact = createIntermediateArtifact({ review: projectReview(approved.events, clean.candidate_id), classification: clean, currentTaxonomyVersion: clean.taxonomy_version, outputPath: 'ingestion/intermediate/x.reviewed.json' });
  assert.equal(artifact.publishable, false); assert.equal(artifact.artifact_kind, 'predator_intermediate_reviewed_candidate'); assert.equal('frase_peca' in artifact, false); assert.throws(() => createIntermediateArtifact({ review: projectReview(approved.events, clean.candidate_id), classification: clean, currentTaxonomyVersion: clean.taxonomy_version, outputPath: 'data/jurisprudencia/x.yaml' }), /non-canonical/);
});
test('classificação não resolvida e proposta taxonômica não são exportáveis', () => {
  const unsupported = classifySyntheticCandidate(candidates[3], taxonomyView, classPolicy); const review = { ...projectReview(applyReviewCommand(inReview(), command('decide', 3, 'unsupported-approve', { decision: 'approve', checklist, field_decisions: acceptedFields }), reviewPolicy).events, clean.candidate_id), candidate_id: unsupported.candidate_id, classification_id: unsupported.classification_id };
  assert.throws(() => createIntermediateArtifact({ review, classification: unsupported, currentTaxonomyVersion: unsupported.taxonomy_version, outputPath: 'x.reviewed.json' }), /unresolved/);
});
test('métricas separam sugestão, abstenção e decisões humanas', () => {
  const classifications = candidates.map(c => classifySyntheticCandidate(c, taxonomyView, classPolicy)); const metrics = evaluateClassifications(classifications, ['approve','correct','reject','return']); assert.ok(metrics.coverage > 0); assert.ok(metrics.abstention > 0); assert.deepEqual(metrics.human, { accepted: 1, edited: 1, rejected: 1, returned: 1 }); assert.match(metrics.note, /not statistical accuracy/);
});
test('fila, auditoria e intermediários não entram no build público', async () => {
  const files = await import('node:fs/promises').then(fs => fs.readdir(new URL('../../dist/', import.meta.url), { recursive: true })); assert.equal(files.some(file => /(review-queue|audit|intermediate|reviewed\.json)/i.test(file)), false);
});
