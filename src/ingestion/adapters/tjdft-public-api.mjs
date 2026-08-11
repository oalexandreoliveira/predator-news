const ENDPOINT = 'https://jurisdf.tjdft.jus.br/api/v1/pesquisa';
const DETAIL_BASE = 'https://jurisdf.tjdft.jus.br/acordaos';

export class TjdfPublicApiError extends Error {
  constructor(code, message, details = {}) { super(message); this.name = 'TjdfPublicApiError'; this.code = code; this.details = details; }
}

const assertPage = (pagina, tamanho) => {
  if (!Number.isInteger(pagina) || pagina < 0) throw new TjdfPublicApiError('invalid_page', 'pagina must be a non-negative integer');
  if (!Number.isInteger(tamanho) || tamanho < 1 || tamanho > 1000) throw new TjdfPublicApiError('invalid_page_size', 'tamanho must be between 1 and 1000');
};

export function buildTjdfDecisionUrl(record) {
  if (String(record?.base ?? '').toLowerCase() !== 'acordaos') return null;
  if (!record?.identificador || !record?.uuid) return null;
  return `${DETAIL_BASE}/${encodeURIComponent(record.identificador)}/inteiro-teor/${encodeURIComponent(record.uuid)}`;
}

export function normalizeTjdfRecord(record, { batchId = 'tjdft-api' } = {}) {
  const process = record?.processo ?? null;
  const sourceUrl = buildTjdfDecisionUrl(record);
  const fullText = typeof record?.inteiroTeor === 'string' ? record.inteiroTeor.trim() : '';
  const hasFullText = record?.possuiInteiroTeor === true || fullText.length > 0;
  const stableKey = record?.uuid || record?.identificador || process || `seq-${record?.sequencial ?? 'unknown'}`;
  return {
    candidate_id: `cand-tjdft-${String(stableKey).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    batch_id: batchId,
    status: hasFullText && sourceUrl ? 'retrieved' : 'discovered',
    synthetic: false,
    discovery: { source: 'tjdft_public_api', endpoint: ENDPOINT, query_result: true },
    identity: {
      tribunal: 'TJDFT', processo: process, uuid: record?.uuid ?? null, identificador: record?.identificador ?? null,
      tipo_decisao: record?.base === 'acordaos' ? 'acordao' : record?.base ?? null,
      orgao_julgador: record?.descricaoOrgaoJulgador ?? record?.descricaoOrgao ?? null,
      relator: record?.nomeRelator ?? null,
      data_julgamento: record?.dataJulgamento ?? null,
      data_publicacao: record?.dataPublicacao ?? null,
    },
    source: {
      natureza: 'jurisprudencia_oficial', recuperado_via: 'portal_tribunal',
      url_original: sourceUrl, url_inteiro_teor: sourceUrl, api_endpoint: ENDPOINT,
      consultado_em: new Date().toISOString().slice(0, 10),
      possui_inteiro_teor: hasFullText,
    },
    text: { ementa: record?.ementa ?? null, inteiro_teor: fullText || null, inteiro_teor_html: record?.inteiroTeorHtml ?? null },
    deduplication: { status: 'pending', keys: [process, record?.uuid, record?.identificador].filter(Boolean) },
    classification: { status: 'pending', terms: record?.marcadores?.termosAuxiliares ?? [] },
    review: { decision: 'pending', final: false },
    publishability: { eligible_source: Boolean(sourceUrl && hasFullText), reason: sourceUrl && hasFullText ? null : 'official_full_text_or_detail_url_missing' },
  };
}

export async function searchTjdf({ query, termosAcessorios = [], pagina = 0, tamanho = 10, fetchImpl = globalThis.fetch, signal } = {}) {
  if (typeof query !== 'string' || !query.trim()) throw new TjdfPublicApiError('invalid_query', 'query is required');
  if (!Array.isArray(termosAcessorios)) throw new TjdfPublicApiError('invalid_filters', 'termosAcessorios must be an array');
  assertPage(pagina, tamanho);
  if (typeof fetchImpl !== 'function') throw new TjdfPublicApiError('fetch_unavailable', 'fetch implementation is required');
  const response = await fetchImpl(ENDPOINT, { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ query: query.trim(), termosAcessorios, pagina, tamanho }), signal });
  if (!response.ok) throw new TjdfPublicApiError('http_error', `TJDFT API returned ${response.status}`, { status: response.status });
  const payload = await response.json();
  const records = Array.isArray(payload.registros) ? payload.registros : [];
  return { endpoint: ENDPOINT, hits: payload.hits ?? 0, pagina, tamanho, agregacoes: payload.agregacoes ?? payload['agregações'] ?? {}, records, candidates: records.map(record => normalizeTjdfRecord(record, { batchId: `tjdft-${Date.now()}` })) };
}
