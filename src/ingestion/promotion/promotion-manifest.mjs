import { hashValue } from './proposal-contract.mjs';
export function createPromotionManifest(items, policy, generatedAt) {
  const normalized = items.map(item => ({ candidate_id: item.candidate_id, classification_id: item.classification_id ?? null, review_record: item.review_record ?? null, decision_id: item.decision_id ?? null, batch_id: item.batch_id ?? null, input_hash: item.input_hash ?? null, output_hash: item.output_hash ?? null, taxonomy_version: item.taxonomy_version ?? null, schema_version: item.schema_version ?? null, canonical_index_version: item.canonical_index_version ?? null, policy_version: policy.version, status: item.status, reason_codes: item.reason_codes ?? [] }));
  return { manifest_id: `manifest-${hashValue({ items: normalized, policy }).replace(':','-')}`, generated_at: generatedAt, policy_version: policy.version, items: normalized };
}
export function planPartialSimulation(items) {
  const accepted = []; const blocked = [];
  for (const item of items) {
    if (item.independent === true && item.valid === true && item.deduplication === 'distinct_decision' && item.proposal) accepted.push(item.proposal);
    else blocked.push({ candidate_id: item.candidate_id, status: 'blocked', reason_codes: item.reason_codes?.length ? item.reason_codes : ['item_not_independent_or_valid'] });
  }
  return { accepted, blocked };
}
