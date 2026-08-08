import { hashValue, PromotionBlockedError } from './proposal-contract.mjs';
export function assertPromotionEligibility(artifact, expected, { extension = '.reviewed.json' } = {}) {
  if (!expected.inputPath?.endsWith(extension) || artifact.artifact_kind !== 'predator_intermediate_reviewed_candidate' || artifact.publishable !== false) throw new PromotionBlockedError('review_not_eligible', '/', 'eligible .reviewed.json required');
  if (!['approve','correct'].includes(artifact.review?.decision)) throw new PromotionBlockedError('review_not_eligible', '/review/decision', 'final approve or correct required');
  if (artifact.review.final !== true || artifact.review.checklist_complete !== true) throw new PromotionBlockedError('review_not_eligible', '/review/checklist_complete', 'final review and complete checklist required');
  if (!Number.isInteger(artifact.review_version) || artifact.review_version !== expected.reviewVersion) throw new PromotionBlockedError('review_version_stale', '/review_version', 'review version changed');
  for (const [field, code] of [['taxonomy_version','taxonomy_version_stale'],['schema_version','schema_version_stale'],['canonical_index_version','canonical_index_stale']]) if (artifact[field] !== expected[field]) throw new PromotionBlockedError(code, `/${field}`, 'recorded version differs from current');
  if (artifact.classification_policy_version !== expected.classificationPolicyVersion || expected.promotionPolicyVersion !== expected.configuredPromotionPolicyVersion) throw new PromotionBlockedError('policy_version_stale', '/policy_version', 'policy changed');
  if (artifact.input_hash !== hashValue(artifact.field_decisions)) throw new PromotionBlockedError('input_integrity_failed', '/input_hash', 'reviewed fields hash mismatch');
  return artifact;
}
