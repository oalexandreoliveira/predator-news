const CNJ = /^(\d{7})-?(\d{2})\.?([12]\d{3})\.?([1-9])\.?((?:0[1-9])|(?:[1-8]\d)|90)\.?([0-9]{4})$/;
const fold = value => String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
export function normalizeCnj(original) {
  if (typeof original !== 'string') return { original: original ?? null, normalized: null, valid: false };
  const match = original.trim().match(CNJ); if (!match) return { original, normalized: null, valid: false }; const digits = `${match[1]}${match[3]}${match[4]}${match[5]}${match[6]}${match[2]}`;
  if (BigInt(digits) % 97n !== 1n) return { original, normalized: null, valid: false };
  return { original, normalized: `${match[1]}-${match[2]}.${match[3]}.${match[4]}.${match[5]}.${match[6]}`, valid: true };
}
export function normalizeRecord(raw) {
  const process = normalizeCnj(raw.process);
  return { record_id: raw.record_id ?? null, tribunal: String(raw.tribunal ?? '').trim().toUpperCase() || null, process, decision_date: raw.decision_date ?? null, publication_date: raw.publication_date ?? null, chamber: fold(raw.chamber) || null, reporter: fold(raw.reporter) || null, decision_unit_id: raw.decision_unit_id ?? null };
}
