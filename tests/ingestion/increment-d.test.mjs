import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import { loadData } from '../../scripts/data/load-data.mjs';
import {
  assertPromotionEligibility, buildCanonicalIndex, createPromotionManifest, createSemanticDiff, createTaxonomyView,
  hashValue, planPartialSimulation, runFinalDedupGate, simulatePromotionSandbox, transformReviewedArtifact,
  validateCanonicalProposal
} from '../../src/ingestion/index.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const loadJson = async url => JSON.parse(await readFile(url, 'utf8'));
const template = await loadJson(new URL('../../ingestion/fixtures/simulated-promotion/eligible.reviewed.json', import.meta.url));
const taxonomy = YAML.parse(await readFile(new URL('../../data/taxonomy/taxonomy.yaml', import.meta.url), 'utf8'));
const aliases = YAML.parse(await readFile(new URL('../../data/taxonomy/aliases.yaml', import.meta.url), 'utf8'));
const canonicalData = await loadData(root); const canonicalIndex = buildCanonicalIndex(canonicalData.decisions);
const decisionSchema = await loadJson(new URL('../../schemas/decision.schema.json', import.meta.url));
const proposalSchema = await loadJson(new URL('../../ingestion/schemas/canonical-proposal.schema.json', import.meta.url));
const schemaVersion = hashValue(decisionSchema); const taxonomyVersion = createTaxonomyView(taxonomy, aliases).version;
const policy = { version: 1, promotion_authorized: false, proposal_extension: '.proposal.json' };
function artifact() { const value = structuredClone(template); value.taxonomy_version = taxonomyVersion; value.schema_version = schemaVersion; value.canonical_index_version = canonicalIndex.version; value.input_hash = hashValue(value.field_decisions); return value; }
const expected = value => ({ inputPath: 'ingestion/intermediate/eligible.reviewed.json', reviewVersion: value.review_version, taxonomy_version: taxonomyVersion, schema_version: schemaVersion, canonical_index_version: canonicalIndex.version, classificationPolicyVersion: 1, promotionPolicyVersion: 1, configuredPromotionPolicyVersion: 1 });
function proposalFrom(value = artifact(), versions = {}) { assertPromotionEligibility(value, { ...expected(value), ...versions }); return transformReviewedArtifact(value, { taxonomyVersion, schemaVersion, canonicalIndexVersion: canonicalIndex.version, ...versions }, policy, { outputPath: 'ingestion/proposals/item.proposal.json', now: () => '2026-08-08T00:00:00Z' }).proposal; }
const digestDirectory = async directory => { const names = (await readdir(directory)).sort(); const hash = createHash('sha256'); for (const name of names) hash.update(name).update(await readFile(new URL(`${name}`, directory))); return hash.digest('hex'); };
const sandboxEntries = async () => (await readdir(new URL('../../ingestion/sandboxes/', import.meta.url))).filter(name => name !== '.gitkeep').sort();

test('somente reviewed elegível entra; revisão não autoriza promoção', () => {
  const value = artifact(); assert.doesNotThrow(() => assertPromotionEligibility(value, expected(value))); const proposal = proposalFrom(value); assert.equal(proposal.publishable, false); assert.equal(policy.promotion_authorized, false);
  assert.throws(() => assertPromotionEligibility(value, { ...expected(value), inputPath: 'item.json' }), { code: 'review_not_eligible' });
});
test('estados não finais e checklist incompleto são bloqueados', () => {
  for (const decision of ['pending','return','reject','superseded']) { const value = artifact(); value.review.decision = decision; assert.throws(() => assertPromotionEligibility(value, expected(value)), { code: 'review_not_eligible' }); }
  const value = artifact(); value.review.checklist_complete = false; assert.throws(() => assertPromotionEligibility(value, expected(value)), { code: 'review_not_eligible' });
});
test('gates de revisão, taxonomia, schema, política e acervo são fail-closed', () => {
  const cases = [['reviewVersion',99,'review_version_stale'],['taxonomy_version','changed','taxonomy_version_stale'],['schema_version','changed','schema_version_stale'],['configuredPromotionPolicyVersion',2,'policy_version_stale'],['canonical_index_version','changed','canonical_index_stale']];
  for (const [field,value,code] of cases) { const item = artifact(); const exp = expected(item); if (field in item) item[field] = value; else exp[field] = value; assert.throws(() => assertPromotionEligibility(item, exp), { code }); }
});
test('integridade de entrada inconsistente bloqueia', () => { const value = artifact(); value.input_hash = 'sha256:bad'; assert.throws(() => assertPromotionEligibility(value, expected(value)), { code: 'input_integrity_failed' }); });
test('transformação é determinística e versões legítimas mudam identidade', () => {
  const one = proposalFrom(); const two = proposalFrom(); assert.deepEqual(one, two);
  const changed = transformReviewedArtifact(artifact(), { taxonomyVersion, schemaVersion, canonicalIndexVersion: canonicalIndex.version, transformRevision: 2 }, policy, { outputPath: 'x.proposal.json' }).proposal; assert.notEqual(one.transform_identity, changed.transform_identity);
});
test('somente campos revisados são mapeados e ausências não são inferidas', () => {
  const value = artifact(); value.field_decisions = value.field_decisions.filter(field => field.canonical_path !== 'contexto.fatos_relevantes'); value.input_hash = hashValue(value.field_decisions); const proposal = proposalFrom(value);
  assert.equal('fatos_relevantes' in proposal.payload.contexto, false); for (const field of ['frase_peca']) assert.equal(field in proposal.payload, false);
});
test('conteúdo jurídico ausente bloqueia pelo schema, sem placeholder', async () => {
  for (const path of ['teses','fundamentos','resultado','fonte','resumo_predator']) { const value = artifact(); value.field_decisions = value.field_decisions.filter(field => !field.canonical_path.startsWith(path)); value.input_hash = hashValue(value.field_decisions); const proposal = proposalFrom(value); await assert.rejects(validateCanonicalProposal({ proposal, proposalSchema, decisionSchema, canonicalData, root }), /schema_invalid/); }
});
test('proposta não contém dados operacionais e é inequivocamente não oficial', () => {
  const proposal = proposalFrom(); const text = JSON.stringify(proposal.payload); assert.doesNotMatch(text, /confidence|evidence|reviewer|queue|frase_peca/); assert.deepEqual([proposal.canonical, proposal.publishable, proposal.promotion_status], [false,false,'proposed']);
  assert.throws(() => transformReviewedArtifact(artifact(), {}, policy, { outputPath: 'data/jurisprudencia/item.yaml' }), { code: 'canonical_write_attempt' });
});
test('ID é estável e colisão/duplicado exato bloqueia', () => {
  const proposal = proposalFrom(); assert.equal(proposal.payload.id, 'tjce-7654321-71-2025-8-06-9999'); assert.doesNotThrow(() => runFinalDedupGate(proposal, canonicalIndex, canonicalIndex.version));
  const value = artifact(); const replacements = { 'identificacao.processo':'0050625-78.2021.8.06.0157','identificacao.data_julgamento':'2023-03-29','identificacao.orgao_julgador':'1ª Câmara de Direito Privado' }; value.field_decisions.forEach(field => { if (field.canonical_path in replacements) field.human_value = replacements[field.canonical_path]; }); value.input_hash = hashValue(value.field_decisions); assert.throws(() => runFinalDedupGate(proposalFrom(value), canonicalIndex, canonicalIndex.version), { code: 'exact_duplicate' });
});
test('provável duplicado preserva decisão distinta sem promoção', () => {
  const value = artifact(); const replacements = { 'identificacao.processo':'0050625-78.2021.8.06.0157','identificacao.data_julgamento':'2026-01-01','identificacao.orgao_julgador':'Câmara Sintética Distinta' }; value.field_decisions.forEach(field => { if (field.canonical_path in replacements) field.human_value = replacements[field.canonical_path]; }); value.input_hash = hashValue(value.field_decisions); assert.throws(() => runFinalDedupGate(proposalFrom(value), canonicalIndex, canonicalIndex.version), { code: 'probable_duplicate' });
});
test('mudança concorrente do acervo bloqueia e sobrescrita é impossível', () => { assert.throws(() => runFinalDedupGate(proposalFrom(), { ...canonicalIndex, version: 'changed' }, canonicalIndex.version), { code: 'canonical_index_stale' }); });
test('enum, referência e schema inválidos falham sem mutar taxonomia', async () => {
  const original = JSON.stringify(taxonomy); const mutations = [['contexto.produtos',['unknown']],['teses',[{ slug:'missing',status:'rejeitada' }]],['titulo','curto']];
  for (const [path,value] of mutations) { const item = artifact(); item.field_decisions.find(field => field.canonical_path === path).human_value = value; item.input_hash = hashValue(item.field_decisions); await assert.rejects(validateCanonicalProposal({ proposal: proposalFrom(item), proposalSchema, decisionSchema, canonicalData, root })); }
  assert.equal(JSON.stringify(taxonomy), original);
});
test('manifesto reconstrói proveniência, bloqueios e é determinístico', () => {
  const value = artifact(); const proposal = proposalFrom(value); const items = [{ candidate_id:value.candidate_id,classification_id:value.classification_id,review_record:proposal.source_review_id,decision_id:proposal.payload.id,batch_id:value.batch_id,input_hash:value.input_hash,output_hash:hashValue(proposal),taxonomy_version:value.taxonomy_version,schema_version:value.schema_version,canonical_index_version:value.canonical_index_version,status:'proposed',reason_codes:[] },{ candidate_id:'blocked',status:'blocked',reason_codes:['exact_duplicate'] },{ candidate_id:'excluded',status:'excluded',reason_codes:['review_not_eligible'] }];
  const one = createPromotionManifest(items, policy, '2026-08-08T00:00:00Z'); const two = createPromotionManifest(items, policy, '2026-08-08T00:00:00Z'); assert.deepEqual(one,two); assert.equal(one.items[0].review_record, proposal.source_review_id); assert.deepEqual(one.items.slice(1).map(i => i.reason_codes[0]), ['exact_duplicate','review_not_eligible']);
});
test('diff separa adição, mapeamento, omissão e bloqueio', () => { const value = artifact(); value.field_decisions = value.field_decisions.filter(field => field.canonical_path !== 'contexto.perfis_consumidor'); value.input_hash = hashValue(value.field_decisions); const diff = createSemanticDiff(value, proposalFrom(value), [{ code:'probable_duplicate',path:'/processo',detail:'review' }]); assert.ok(diff.additions.length); assert.ok(diff.mappings.length); assert.ok(diff.intentional_omissions.some(x => x.path.includes('perfis_consumidor'))); assert.equal(diff.blocks[0].code,'probable_duplicate'); });
test('proposta válida passa schema e validação jurídica existente', async () => { const proposal = proposalFrom(); assert.deepEqual(await validateCanonicalProposal({ proposal, proposalSchema, decisionSchema, canonicalData, root }), { valid:true,counts:{ decisions:11,theses:1,foundations:6 } }); });
test('integração parcial aceita apenas itens independentes e não aplica item falho', () => { const proposal = proposalFrom(); const plan = planPartialSimulation([{ candidate_id:'valid',independent:true,valid:true,deduplication:'distinct_decision',proposal },{ candidate_id:'bad',independent:true,valid:false,deduplication:'distinct_decision',proposal,reason_codes:['legal_validation_failed'] }]); assert.deepEqual(plan.accepted,[proposal]); assert.equal(plan.blocked[0].candidate_id,'bad'); assert.equal(plan.blocked[0].reason_codes[0],'legal_validation_failed'); });
test('sandbox valida/builda cópia e rollback preserva acervo oficial', async () => {
  const before = await digestDirectory(new URL('../../data/jurisprudencia/', import.meta.url)); const entriesBefore = await sandboxEntries(); const result = await simulatePromotionSandbox({ repoRoot:root, proposals:[proposalFrom()] }); assert.deepEqual(result, { validated:true,built:true,applied:1,proof_build_was_isolated:true }); assert.equal(await digestDirectory(new URL('../../data/jurisprudencia/', import.meta.url)), before); assert.deepEqual(await sandboxEntries(), entriesBefore);
});
test('rollback também limpa falha induzida e item inválido não é aplicado', async () => { const entriesBefore = await sandboxEntries(); await assert.rejects(simulatePromotionSandbox({ repoRoot:root, proposals:[proposalFrom()], induceFailure:true }), /induced/); assert.deepEqual(await sandboxEntries(), entriesBefore); });
test('artefatos operacionais permanecem fora de dist', async () => { const files = await readdir(new URL('../../dist/', import.meta.url), { recursive:true }); assert.equal(files.some(file => /(proposal|manifest|diff|sandbox|reviewed\.json)/i.test(file)), false); });
