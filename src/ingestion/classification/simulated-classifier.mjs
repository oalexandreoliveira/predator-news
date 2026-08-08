import { createHash } from 'node:crypto';
import { makeEvidence, validateConfidence } from './evidence.mjs';
import { validateClassification } from './classifier-contract.mjs';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function classifySyntheticCandidate(candidate, taxonomyView, policy) {
  if (candidate.synthetic !== true) throw new Error('only synthetic candidates are accepted');
  const fields = []; const taxonomyProposals = [];
  for (const family of policy.classifiable_families) {
    const signals = candidate.signals?.[family] ?? [];
    if (!signals.length) { fields.push({ field: family, status: 'abstained', suggested_value: null, confidence: null, evidence: [] }); continue; }
    const evidence = signals.map(signal => makeEvidence({ section: signal.section, excerpt: signal.excerpt }));
    const resolved = signals.map(signal => taxonomyView.resolve(family, signal.value));
    if (resolved.some(value => value == null)) {
      const unknown = signals.filter((_, index) => resolved[index] == null).map(signal => signal.value);
      fields.push({ field: family, status: 'unsupported', suggested_value: null, confidence: null, evidence });
      taxonomyProposals.push(...unknown.map(raw_value => ({ family, raw_value, status: 'pending_human_taxonomy_review', approvable_in_classification: false })));
      continue;
    }
    const values = [...new Set(resolved)];
    if (values.length > 1) { fields.push({ field: family, status: 'contradictory', suggested_value: null, confidence: null, evidence }); continue; }
    const confidence = validateConfidence(signals[0].confidence);
    fields.push({ field: family, status: 'suggested', suggested_value: values[0], confidence, evidence });
  }
  const inputHash = `sha256:${hash(candidate)}`;
  const identity = hash({ candidate_id: candidate.candidate_id, inputHash, taxonomy: taxonomyView.version, policy: policy.version, fields, taxonomyProposals });
  return validateClassification({ classification_id: `classification-sha256-${identity}`, kind: 'classification_suggestion', candidate_id: candidate.candidate_id, taxonomy_version: taxonomyView.version, policy_version: policy.version, input_hash: inputHash, fields, taxonomy_proposals: taxonomyProposals }, taxonomyView);
}
