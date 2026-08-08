import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';
import { loadData } from '../data/load-data.mjs';
import {
  assertPromotionEligibility, buildCanonicalIndex, createPromotionManifest, createSemanticDiff,
  createTaxonomyView, hashValue, runFinalDedupGate, simulatePromotionSandbox,
  transformReviewedArtifact, validateCanonicalProposal
} from '../../src/ingestion/index.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname.replace(/^\/(.:)/, '$1')); const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const template = JSON.parse(await read('../../ingestion/fixtures/simulated-promotion/eligible.reviewed.json')); const decisionSchema = JSON.parse(await read('../../schemas/decision.schema.json')); const proposalSchema = JSON.parse(await read('../../ingestion/schemas/canonical-proposal.schema.json'));
const taxonomy = YAML.parse(await read('../../data/taxonomy/taxonomy.yaml')); const aliases = YAML.parse(await read('../../data/taxonomy/aliases.yaml')); const taxonomyVersion = createTaxonomyView(taxonomy, aliases).version; const schemaVersion = hashValue(decisionSchema);
const data = await loadData(root); const index = buildCanonicalIndex(data.decisions); const policy = { version: 1, promotion_authorized: false, proposal_extension: '.proposal.json' };
const hydrate = source => { const value = structuredClone(source); value.taxonomy_version = taxonomyVersion; value.schema_version = schemaVersion; value.canonical_index_version = index.version; value.input_hash = hashValue(value.field_decisions); return value; };
const expected = value => ({ inputPath:'ingestion/intermediate/item.reviewed.json',reviewVersion:value.review_version,taxonomy_version:taxonomyVersion,schema_version:schemaVersion,canonical_index_version:index.version,classificationPolicyVersion:1,promotionPolicyVersion:1,configuredPromotionPolicyVersion:1 });
const change = (value, replacements) => { value.field_decisions.forEach(field => { if (field.canonical_path in replacements) field.human_value = replacements[field.canonical_path]; }); value.input_hash = hashValue(value.field_decisions); return value; };
const reviewed = [hydrate(template), change(hydrate({ ...template, candidate_id:'cand-exact' }), { 'identificacao.processo':'0050625-78.2021.8.06.0157','identificacao.data_julgamento':'2023-03-29','identificacao.orgao_julgador':'1ª Câmara de Direito Privado' }), change(hydrate({ ...template, candidate_id:'cand-probable' }), { 'identificacao.processo':'0050625-78.2021.8.06.0157','identificacao.data_julgamento':'2026-01-01','identificacao.orgao_julgador':'Câmara Sintética Distinta' }), hydrate({ ...template,candidate_id:'cand-invalid',review:{ ...template.review,decision:'reject' } }), { ...hydrate({ ...template,candidate_id:'cand-stale' }),schema_version:'stale' }];
const records = []; const proposals = [];
for (const artifact of reviewed) {
  try {
    assertPromotionEligibility(artifact, expected(artifact)); const proposal = transformReviewedArtifact(artifact, { taxonomyVersion,schemaVersion,canonicalIndexVersion:index.version }, policy, { outputPath:`ingestion/proposals/${artifact.candidate_id}.proposal.json`,now:()=> '2026-08-08T00:00:00Z' }).proposal; proposals.push(proposal);
    try { runFinalDedupGate(proposal,index,index.version); await validateCanonicalProposal({ proposal,proposalSchema,decisionSchema,canonicalData:data,root }); records.push({ candidate_id:artifact.candidate_id,classification_id:artifact.classification_id,review_record:proposal.source_review_id,decision_id:proposal.payload.id,batch_id:artifact.batch_id,input_hash:artifact.input_hash,output_hash:hashValue(proposal),taxonomy_version:taxonomyVersion,schema_version:schemaVersion,canonical_index_version:index.version,status:'proposed',reason_codes:[],proposal }); }
    catch (error) { records.push({ candidate_id:artifact.candidate_id,status:'blocked',reason_codes:[error.code ?? 'validation_failed'] }); }
  } catch (error) { records.push({ candidate_id:artifact.candidate_id,status:'blocked',reason_codes:[error.code ?? 'review_not_eligible'] }); }
}
const valid = records.find(record => record.status === 'proposed'); const simulation = await simulatePromotionSandbox({ repoRoot:root,proposals:[valid.proposal] }); valid.status = 'simulated'; delete valid.proposal;
const manifest = createPromotionManifest(records,policy,'2026-08-08T00:00:00Z'); const diff = createSemanticDiff(reviewed[0],proposals[0],records.filter(r=>r.status==='blocked').map(r=>({ code:r.reason_codes[0],path:'/',detail:'blocked by gate' })));
const reason = code => records.filter(r=>r.reason_codes?.includes(code)).length; const sandboxRemaining = (await readdir(new URL('../../ingestion/sandboxes/',import.meta.url))).filter(name=>name!=='.gitkeep').length;
console.log(JSON.stringify({ funnel:{ reviewed:reviewed.length,eligible:proposals.length,proposed:proposals.length,exact_duplicates:reason('exact_duplicate'),probable_duplicates:reason('probable_duplicate'),invalid:reason('review_not_eligible'),blocked:records.filter(r=>r.status==='blocked').length,simulated:records.filter(r=>r.status==='simulated').length },manifest_id:manifest.manifest_id,diff:{ additions:diff.additions.length,mappings:diff.mappings.length,omissions:diff.intentional_omissions.length,blocks:diff.blocks.length },proof:{ ...simulation,sandbox_remaining:sandboxRemaining,promotion_authorized:false } },null,2));
