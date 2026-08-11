import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDatajudDiscoveryQuery, buildDatajudEndpoint, normalizeDatajudHit, searchDatajud } from '../../src/ingestion/adapters/datajud-public-api.mjs';
import { buildTjdfDecisionUrl, normalizeTjdfRecord, searchTjdf } from '../../src/ingestion/adapters/tjdft-public-api.mjs';

test('TJDFT monta URL oficial de inteiro teor apenas para acórdãos completos', () => {
  const record = { base: 'acordaos', identificador: '2155686', uuid: 'e4dd1375-043b-4a25-b0d3-b88329ad9450', possuiInteiroTeor: true, inteiroTeor: 'texto' };
  assert.equal(buildTjdfDecisionUrl(record), 'https://jurisdf.tjdft.jus.br/acordaos/2155686/inteiro-teor/e4dd1375-043b-4a25-b0d3-b88329ad9450');
  assert.equal(buildTjdfDecisionUrl({ base: 'decisoes', identificador: '1', uuid: 'x' }), null);
});

test('TJDFT normaliza registro elegível sem publicar conteúdo bruto', () => {
  const candidate = normalizeTjdfRecord({ base: 'acordaos', identificador: '1', uuid: 'abc', processo: '0710000-00.2025.8.07.0001', possuiInteiroTeor: true, inteiroTeor: 'inteiro', nomeRelator: 'RELATOR', descricaoOrgaoJulgador: '1ª TURMA CÍVEL' });
  assert.equal(candidate.status, 'retrieved');
  assert.equal(candidate.publishability.eligible_source, true);
  assert.equal(candidate.identity.tribunal, 'TJDFT');
});

test('TJDFT pesquisa usa POST, paginação e filtros oficiais', async () => {
  let request;
  const result = await searchTjdf({ query: 'RMC', pagina: 2, tamanho: 20, termosAcessorios: [{ campo: 'descricaoClasseCnj', valor: 'APELAÇÃO CÍVEL' }], fetchImpl: async (url, init) => { request = { url, init }; return { ok: true, async json() { return { hits: 1, registros: [{ base: 'acordaos', identificador: '1', uuid: 'u', processo: '0710000-00.2025.8.07.0001', possuiInteiroTeor: true, inteiroTeor: 'x' }] }; } }; } });
  assert.equal(result.hits, 1); assert.equal(result.candidates[0].status, 'retrieved');
  assert.equal(request.init.method, 'POST'); assert.deepEqual(JSON.parse(request.init.body).pagina, 2); assert.equal(JSON.parse(request.init.body).tamanho, 20);
});

test('Datajud constrói endpoint, Query DSL e Authorization sem fixar chave no código', () => {
  assert.equal(buildDatajudEndpoint('tjdft'), 'https://api-publica.datajud.cnj.jus.br/api_publica_tjdft/_search');
  const body = buildDatajudDiscoveryQuery({ text: 'seguro prestamista', size: 100 });
  assert.equal(body.size, 100); assert.ok(body.sort); assert.ok(body.query.bool.must[0].multi_match);
});

test('Datajud normaliza metadados como enriquecimento, não como fonte canônica', () => {
  const value = normalizeDatajudHit({ _id: 'x', _source: { tribunal: 'TJDFT', numeroProcesso: '07100000020258070001', assuntos: [{ codigo: 1, nome: 'Cartão consignado' }], movimentos: [] } });
  assert.equal(value.tribunal, 'TJDFT'); assert.equal(value.canonical_source_required, true);
});

test('Datajud exige API key e envia o cabeçalho correto', async () => {
  let auth;
  await searchDatajud({ tribunalAlias: 'tjdft', apiKey: 'test-key', body: { size: 10, query: { match_all: {} } }, fetchImpl: async (_url, init) => { auth = init.headers.Authorization; return { ok: true, async json() { return { hits: { total: { value: 0 }, hits: [] } }; } }; } });
  assert.equal(auth, 'APIKey test-key');
  await assert.rejects(searchDatajud({ tribunalAlias: 'tjdft', body: {} , fetchImpl: async () => ({}) }), { code: 'api_key_missing' });
});
