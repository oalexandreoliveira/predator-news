const STATES = new Set(['suggested','abstained','unsupported','contradictory','invalid']);
export function validateClassification(result, taxonomyView) {
  if (result.kind !== 'classification_suggestion' || 'decision' in result || 'approved' in result) throw new Error('classification output must be suggestion only');
  for (const field of result.fields) {
    if (!STATES.has(field.status)) throw new Error(`invalid classification state: ${field.status}`);
    if (field.status === 'suggested' && !taxonomyView.has(field.field, field.suggested_value)) throw new Error(`unknown taxonomy value: ${field.field}/${field.suggested_value}`);
    if (field.confidence != null && (!Number.isFinite(field.confidence) || field.confidence < 0 || field.confidence > 1)) throw new Error('confidence outside scale');
  }
  return result;
}
