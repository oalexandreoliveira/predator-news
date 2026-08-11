import { normalizeCnj } from '../normalization.mjs';

const syntheticMarkers = new Set(['sintetico','sintetica','synthetic','fixture','mock','fake','ficticio','ficticia','dummy','teste','testing']);
const officialDomains = Object.freeze({ TJCE: 'tjce.jus.br', TJMA: 'tjma.jus.br', TJPI: 'tjpi.jus.br' });
const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const tokens = value => fold(value).split(/[^a-z0-9]+/).filter(Boolean);
const containsSyntheticMarker = value => tokens(value).some(token => syntheticMarkers.has(token));
const fieldMap = candidate => Object.fromEntries((candidate?.field_decisions ?? []).map(field => [field.canonical_path, field.human_value]));

function structuredCandidate(candidate) {
  if (candidate?.payload) return candidate.payload;
  if (!Array.isArray(candidate?.field_decisions)) return candidate;
  const fields = fieldMap(candidate);
  return {
    identificacao: { tribunal: fields['identificacao.tribunal'], processo: fields['identificacao.processo'], orgao_julgador: fields['identificacao.orgao_julgador'], relator: fields['identificacao.relator'] },
    titulo: fields.titulo,
    fonte: { natureza: fields['fonte.natureza'], recuperado_via: fields['fonte.recuperado_via'], url_original: fields['fonte.url_original'], url_inteiro_teor: fields['fonte.url_inteiro_teor'] }
  };
}

export function validateSourceIntegrity({ candidate, manifest = null } = {}) {
  const reasons = [];
  const decision = structuredCandidate(candidate) ?? {};
  const identification = decision.identificacao ?? {};
  const source = decision.fonte ?? {};
  const markerFields = [candidate?.candidate_id,candidate?.classification_id,candidate?.batch_id,candidate?.review?.reviewer_id,identification.orgao_julgador,identification.relator,decision.titulo,source.natureza,source.recuperado_via];
  if (markerFields.some(containsSyntheticMarker)) reasons.push('synthetic_candidate_forbidden');
  if (candidate?.dry_run === true || manifest?.dry_run === true) reasons.push('dry_run_candidate_forbidden');
  if (!normalizeCnj(identification.processo).valid) reasons.push('invalid_cnj');
  const urls = [source.url_original,source.url_inteiro_teor].filter(Boolean);
  if (!urls.length) reasons.push('source_url_missing');
  for (const raw of urls) {
    let url; try { url = new URL(raw); } catch { reasons.push('source_url_invalid'); continue; }
    if (url.protocol !== 'https:') reasons.push('source_https_required');
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'example.invalid' || hostname.endsWith('.invalid') || hostname.endsWith('.example')) reasons.push('reserved_source_domain');
    const expected = officialDomains[String(identification.tribunal ?? '').toUpperCase()];
    if (!expected || (hostname !== expected && !hostname.endsWith(`.${expected}`))) reasons.push('source_domain_mismatch');
  }
  const uniqueReasons = [...new Set(reasons)];
  return Object.freeze({ valid: uniqueReasons.length === 0, reasons: uniqueReasons });
}

export function assertSourceIntegrity(input) {
  const result = validateSourceIntegrity(input);
  if (!result.valid) { const error = new Error(`source_integrity_failed: ${result.reasons.join(',')}`); error.name='SourceIntegrityError'; error.code=result.reasons[0]; error.source_integrity=result; throw error; }
  return result;
}
