import { createHash } from 'node:crypto';
import { normalizeRecord } from './normalization.mjs';
export const canonicalUnitKey = record => [record.tribunal, record.process.normalized, record.decision_date ?? '', record.chamber ?? '', record.decision_unit_id ?? ''].join('|');
export function buildCanonicalIndex(decisions) {
  const records = decisions.map(item => { const value = item.value ?? item; const id = value.id; return { id, ...normalizeRecord({ record_id: id, tribunal: value.identificacao.tribunal, process: value.identificacao.processo, decision_date: value.identificacao.data_julgamento, publication_date: value.identificacao.data_publicacao, chamber: value.identificacao.orgao_julgador, reporter: value.identificacao.relator, decision_unit_id: id }) }; }).sort((a,b) => a.id.localeCompare(b.id));
  const version = `sha256:${createHash('sha256').update(JSON.stringify(records)).digest('hex')}`;
  return { version, records, byId: new Map(records.map(r => [r.id, r])), byProcess: new Map(records.map(r => [`${r.tribunal}|${r.process.normalized}`, r])), byUnit: new Map(records.map(r => [canonicalUnitKey(r), r])) };
}
