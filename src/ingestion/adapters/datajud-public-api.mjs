const API_BASE = 'https://api-publica.datajud.cnj.jus.br';

export class DatajudPublicApiError extends Error {
  constructor(code, message, details = {}) { super(message); this.name = 'DatajudPublicApiError'; this.code = code; this.details = details; }
}

const SUPPORTED_ALIASES = new Set(['tjac','tjal','tjam','tjap','tjba','tjce','tjdft','tjes','tjgo','tjma','tjmg','tjpi','tjpr','tjsp','tjst','trf1','trf2','trf3','trf4','trf5','trf6','stj']);
const assertAlias = alias => {
  if (typeof alias !== 'string' || !SUPPORTED_ALIASES.has(alias.toLowerCase())) throw new DatajudPublicApiError('invalid_tribunal_alias', 'unsupported Datajud tribunal alias');
};

export function buildDatajudEndpoint(tribunalAlias) {
  assertAlias(tribunalAlias);
  return `${API_BASE}/api_publica_${tribunalAlias}/_search`;
}

export function buildDatajudDiscoveryQuery({ text, size = 100, searchAfter = null } = {}) {
  if (typeof text !== 'string' || !text.trim()) throw new DatajudPublicApiError('invalid_query', 'text is required');
  if (!Number.isInteger(size) || size < 10 || size > 10000) throw new DatajudPublicApiError('invalid_page_size', 'size must be between 10 and 10000');
  const body = { size, query: { bool: { must: [{ multi_match: { query: text.trim(), fields: ['assuntos.nome', 'classe.nome', 'movimentos.nome'] } }] } }, sort: [{ '@timestamp': { order: 'asc' } }] };
  if (Array.isArray(searchAfter)) body.search_after = searchAfter;
  return body;
}

export function normalizeDatajudHit(hit) {
  const source = hit?._source ?? {};
  return { source: 'datajud_public_api', tribunal: source.tribunal ?? null, process: source.numeroProcesso ?? null, id: source.id ?? hit?._id ?? null, class: source.classe ?? null, subject: source.assuntos ?? [], court: source.orgaoJulgador ?? null, degree: source.grau ?? null, secrecy_level: source.nivelSigilo ?? null, filed_at: source.dataAjuizamento ?? null, updated_at: source.dataHoraUltimaAtualizacao ?? null, movements: source.movimentos ?? [], raw_hit_id: hit?._id ?? null, canonical_source_required: true };
}

export async function searchDatajud({ tribunalAlias, apiKey = process.env.DATAJUD_API_KEY, body, fetchImpl = globalThis.fetch, signal } = {}) {
  const endpoint = buildDatajudEndpoint(tribunalAlias);
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new DatajudPublicApiError('api_key_missing', 'DATAJUD_API_KEY is required');
  if (!body || typeof body !== 'object') throw new DatajudPublicApiError('invalid_body', 'a Query DSL body is required');
  if (typeof fetchImpl !== 'function') throw new DatajudPublicApiError('fetch_unavailable', 'fetch implementation is required');
  const response = await fetchImpl(endpoint, { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json', Authorization: `APIKey ${apiKey}` }, body: JSON.stringify(body), signal });
  if (!response.ok) throw new DatajudPublicApiError('http_error', `Datajud API returned ${response.status}`, { status: response.status });
  const payload = await response.json();
  const hits = Array.isArray(payload?.hits?.hits) ? payload.hits.hits : [];
  return { endpoint, total: payload?.hits?.total ?? 0, timed_out: payload?.timed_out === true, records: hits.map(normalizeDatajudHit), raw_hits: hits };
}
