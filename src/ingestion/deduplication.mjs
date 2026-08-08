import { canonicalUnitKey } from './canonical-index.mjs';
const ev = (kind, value) => ({ kind, value });
export function preDeduplicate(record, { canonicalIndex, batchRecords = [] }) {
  if (!record.process.valid) return { result: 'invalid', retrieve_detail: false, reasons: ['invalid_cnj'], evidence: [ev('process_original', record.process.original)] };
  if (record.decision_unit_id && canonicalIndex.byId.has(record.decision_unit_id)) return { result: 'exact_duplicate', retrieve_detail: false, reasons: ['canonical_id_match'], evidence: [ev('canonical_id', record.decision_unit_id)] };
  if (canonicalIndex.byUnit.has(canonicalUnitKey(record))) return { result: 'exact_duplicate', retrieve_detail: false, reasons: ['decision_unit_match'], evidence: [ev('unit_key', canonicalUnitKey(record))] };
  const batchExact = batchRecords.find(other => other.record_id !== record.record_id && ((other.decision_unit_id && other.decision_unit_id === record.decision_unit_id) || canonicalUnitKey(other) === canonicalUnitKey(record)));
  if (batchExact) return { result: 'exact_duplicate', retrieve_detail: false, reasons: ['batch_unit_match'], evidence: [ev('record_id', batchExact.record_id)] };
  if (canonicalIndex.byProcess.has(`${record.tribunal}|${record.process.normalized}`)) return { result: 'probable_duplicate', retrieve_detail: true, reasons: ['process_match_without_unit_match'], evidence: [ev('process', record.process.normalized)] };
  if (!record.decision_date || !record.chamber) return { result: 'insufficient_evidence', retrieve_detail: true, reasons: ['missing_decision_metadata'], evidence: [] };
  return { result: 'distinct_decision', retrieve_detail: true, reasons: ['no_match'], evidence: [] };
}
export function finalDeduplicate(record, canonicalIndex, expectedVersion) { if (canonicalIndex.version !== expectedVersion) throw new Error('canonical index changed during run'); return preDeduplicate(record, { canonicalIndex, batchRecords: [] }); }
