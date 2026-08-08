export function createIntermediateArtifact({ review, classification, currentTaxonomyVersion, outputPath }) {
  if (!outputPath?.endsWith('.reviewed.json') || outputPath.includes('data/jurisprudencia')) throw new Error('non-canonical .reviewed.json path is required');
  if (review.status !== 'decided' || !['approve','correct'].includes(review.decision) || !review.checklist || !review.field_decisions?.length) throw new Error('valid human review is required for export');
  if (review.candidate_id !== classification.candidate_id || review.classification_id !== classification.classification_id) throw new Error('classification traceability mismatch');
  if (classification.taxonomy_version !== currentTaxonomyVersion || review.taxonomy_version !== currentTaxonomyVersion) throw new Error('taxonomy changed; export blocked');
  if (classification.taxonomy_proposals.length || classification.fields.some(field => ['unsupported','contradictory','invalid'].includes(field.status))) throw new Error('unresolved classification cannot be exported');
  return { artifact_kind: 'predator_intermediate_reviewed_candidate', publishable: false, candidate_id: review.candidate_id, classification_id: classification.classification_id, taxonomy_version: currentTaxonomyVersion, review: { decision: review.decision, reviewer_id: review.reviewer.id, occurred_at: review.occurred_at, final: true, checklist_complete: true }, field_decisions: structuredClone(review.field_decisions) };
}
export function validateIntermediateArtifact(artifact, validateSchema) { if (!validateSchema(artifact)) throw new Error(`intermediate artifact schema rejected: ${JSON.stringify(validateSchema.errors)}`); return artifact; }
