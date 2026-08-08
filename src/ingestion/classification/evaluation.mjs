export function evaluateClassifications(classifications, decisions = []) {
  const fields = classifications.flatMap(item => item.fields); const total = fields.length;
  const count = state => fields.filter(field => field.status === state).length;
  return { field_total: total, coverage: total ? count('suggested') / total : 0, abstention: total ? count('abstained') / total : 0, contradictory: count('contradictory'), unsupported: count('unsupported'), human: { accepted: decisions.filter(d => d === 'approve').length, edited: decisions.filter(d => d === 'correct').length, rejected: decisions.filter(d => d === 'reject').length, returned: decisions.filter(d => d === 'return').length }, note: 'deterministic fixture metrics; not statistical accuracy' };
}
