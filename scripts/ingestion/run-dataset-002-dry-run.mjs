import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';
import { loadData } from '../data/load-data.mjs';
import {
  assertPromotionEligibility, buildCanonicalIndex, createAuthorizationRequest,
  createDatasetManifest, createExactPromotionPlan, createImpactReport,
  createRollbackPlan, createTaxonomyView, evaluateReadiness, hashValue,
  resolveProbable, runDatasetDryRun, runFinalDedupGate, simulateGitFlow,
  simulatePromotionSandbox, transformReviewedArtifact, validateCanonicalProposal,
  validatePlannedDiff, validateReadinessPolicy, verifyManifest
} from '../../src/ingestion/index.mjs';

const root=resolve(new URL('../..',import.meta.url).pathname.replace(/^\/(.:)/,'$1'));
const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const fixturePath='ingestion/fixtures/simulated-promotion/eligible.reviewed.json';
const [fixtureText,policyText,decisionSchemaText,proposalSchemaText,taxonomyText,aliasesText]=await Promise.all([
  read('../../'+fixturePath),read('../../ingestion/config/readiness-policy.example.yaml'),
  read('../../schemas/decision.schema.json'),read('../../ingestion/schemas/canonical-proposal.schema.json'),
  read('../../data/taxonomy/taxonomy.yaml'),read('../../data/taxonomy/aliases.yaml')
]);
const parameters=YAML.parse(policyText); const policy=validateReadinessPolicy(parameters);
const manifest=createDatasetManifest({dataset:'DATASET-002',batch_id:'dataset-002-synthetic-dry-run',purpose:'prova local parametrizada IN09 + IN10',dry_run:true,promotion_authorized:false,allowed_fixtures:[{path:fixturePath,sha256:hashValue(fixtureText)}],included_items:['cand-synthetic-promotion-001','cand-probable-synthetic-001'],excluded_items:[],versions:{pipeline:'A-D',readiness:'1'},policy_version:policy.version},parameters);
verifyManifest(manifest,{[fixturePath]:hashValue(fixtureText)});
const data=await loadData(root); const canonicalIndex=buildCanonicalIndex(data.decisions);
const taxonomyVersion=createTaxonomyView(YAML.parse(taxonomyText),YAML.parse(aliasesText)).version;
const schemaVersion=hashValue(JSON.parse(decisionSchemaText)); const artifact=JSON.parse(fixtureText);
artifact.taxonomy_version=taxonomyVersion; artifact.schema_version=schemaVersion; artifact.canonical_index_version=canonicalIndex.version; artifact.input_hash=hashValue(artifact.field_decisions);
const expected={inputPath:fixturePath,reviewVersion:artifact.review_version,taxonomy_version:taxonomyVersion,schema_version:schemaVersion,canonical_index_version:canonicalIndex.version,classificationPolicyVersion:1,promotionPolicyVersion:1,configuredPromotionPolicyVersion:1};
let proposal; let sandbox;
const stages={
  foundation:async()=>({manifest_id:manifest.manifest_id,policy_id:policy.identity,fixture_hash:hashValue(fixtureText)}),
  recovery:async()=>({snapshot:'synthetic-local-declared',checkpoint:'reconciled',fingerprint:hashValue({manifest:manifest.manifest_id,fixture:fixturePath})}),
  classification:async()=>({classification_id:artifact.classification_id,taxonomy_version:taxonomyVersion}),
  review:async()=>{assertPromotionEligibility(artifact,expected);return{review_version:artifact.review_version,decision:artifact.review.decision};},
  proposal:async()=>{proposal=transformReviewedArtifact(artifact,{taxonomyVersion,schemaVersion,canonicalIndexVersion:canonicalIndex.version},{version:1,promotion_authorized:false,proposal_extension:'.proposal.json'},{outputPath:'ingestion/proposals/cand-synthetic-promotion-001.proposal.json',now:()=> '2026-08-08T00:00:00Z'}).proposal;await validateCanonicalProposal({proposal,proposalSchema:JSON.parse(proposalSchemaText),decisionSchema:JSON.parse(decisionSchemaText),canonicalData:data,root});return{proposal_id:proposal.proposal_id,output_hash:hashValue(proposal)};},
  deduplication:async()=>({result:runFinalDedupGate(proposal,canonicalIndex,canonicalIndex.version).result}),
  sandbox:async()=>{sandbox=await simulatePromotionSandbox({repoRoot:root,proposals:[proposal]});return sandbox;}
};
const run=await runDatasetDryRun({manifest,policy,stages});
const probable=resolveProbable([],{candidate_id:'cand-probable-synthetic-001',decision:'distinct_decision',resolver:{id:'resolver-synthetic-opaque',role:'duplicate_resolver'},justification:'data e órgão julgador sintéticos distinguem a decisão',evidence:['fixture:dataset-002#probable-001'],expected_version:0,idempotency_key:'dataset-002-resolution-001'}).event;
const canonicalPath=`data/jurisprudencia/${proposal.payload.id}.yaml`; const yaml=YAML.stringify(proposal.payload); const newHash=hashValue(yaml);
const promotionPlan=createExactPromotionPlan([{path:canonicalPath,operation:'add',previous_hash:null,new_hash:newHash,origin:'canonical-proposal',proposal_id:proposal.proposal_id,reason:'adição futura condicionada à autorização real'}]);
validatePlannedDiff(promotionPlan,[{path:canonicalPath}]); const rollbackPlan=createRollbackPlan(promotionPlan);
const impact=createImpactReport({before:data.decisions.length,plan:promotionPlan,diff:[{path:canonicalPath}]});
const git=await simulateGitFlow({repoRoot:root,plan:promotionPlan,contents:{[canonicalPath]:yaml}});
const readiness=evaluateReadiness([
  {code:'dry_run',status:'passed'},{code:'technical',status:'passed'},{code:'legal_synthetic_only',status:'passed'},
  {code:'security_isolation',status:'passed'},{code:'governance_segregation',status:'passed'},
  {code:'operational_rollback',status:'passed'}
],['real_authorizers_missing','production_window_missing']);
const authorization=createAuthorizationRequest({packageHash:hashValue({manifest:manifest.manifest_id,plan:promotionPlan.plan_id,rollback:rollbackPlan.rollback_plan_id}),scope:[canonicalPath],requiredRoles:['final_authorizer:oalexandreoliveira-real-pr-required'],risks:['synthetic_only','protected_authorization_pr_missing','technical_review_missing'],rollbackPlanId:rollbackPlan.rollback_plan_id,validUntil:'2026-08-09T00:00:00Z'});
const remaining=(await readdir(new URL('../../ingestion/dry-runs/',import.meta.url))).filter(name=>name!=='.gitkeep');
console.log(JSON.stringify({manifest,parameters:policy,run,probable_resolution:probable,funnel:{manifest_items:2,reviewed:2,probable_duplicates:1,probable_resolved:1,proposed:1,planned:1,git_simulated:1,canonically_written:0},promotion_plan:promotionPlan,rollback_plan:rollbackPlan,impact,git_simulation:{...git,residue_count:remaining.length},sandbox,readiness,authorization_request:authorization,dry_run_completed:true,ready_for_authorization:readiness.ready_for_authorization,authorization_requested:true,promotion_authorized:false},null,2));
