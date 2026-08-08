import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { loadData } from '../../scripts/data/load-data.mjs';
import {
  authorizeOperation, buildCanonicalIndex, collectPages, createSimulatedRecoveryAdapter,
  executeAuthorized, finalDeduplicate, lookupCache, normalizeCnj, normalizeRecord,
  preDeduplicate, readCheckpoint, readSyntheticSnapshot, runSimulatedBatch
} from '../../src/ingestion/index.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const fixture = JSON.parse(await readFile(new URL('../../ingestion/fixtures/simulated-provider/two-pages.json', import.meta.url), 'utf8'));
const canonicalIndex = buildCanonicalIndex((await loadData(root)).decisions);
const budget = { monthly_limit: 1000, hard_stop: 900, operation_costs: { search: 1, detail: 1 }, reserve: { manual_research: 10, retries: 10, publisher_future: 10 } };
const authorize = operation => authorizeOperation(operation, budget, {});
const fingerprint = `sha256:${'a'.repeat(64)}`;
const temp = prefix => mkdtemp(join(tmpdir(), prefix));

test('contrato bloqueia operação onerosa sem autorização emitida pelo guard', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture);
  await assert.rejects(adapter.list({ cursor: null, authorization: { operation: 'search' } }), { code: 'invalid_authorization' });
  await assert.rejects(adapter.detail({ record_id: 'sim-new-a', authorization: authorize('search') }), { code: 'invalid_authorization' });
});

test('fake é local, determinístico e nunca usa rede', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); let networkCalls = 0; const originalFetch = globalThis.fetch; globalThis.fetch = async () => { networkCalls++; throw new Error('network forbidden'); };
  try {
    const first = await adapter.list({ cursor: null, authorization: authorize('search') });
    const second = await createSimulatedRecoveryAdapter(fixture).list({ cursor: null, authorization: authorize('search') });
    assert.deepEqual(first, second); assert.equal(networkCalls, 0); assert.equal(adapter.capabilities.network, false);
  } finally { globalThis.fetch = originalFetch; }
});

test('duas páginas preservam ordem, cursor e contadores', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); const dir = await temp('predator-pages-');
  const result = await collectPages({ adapter, fingerprint, checkpointPath: join(dir, 'checkpoint.json'), authorize });
  assert.deepEqual(result.pages.map(p => p.cursor), [null, 'cursor-page-2']); assert.equal(adapter.counters.list, 2); assert.equal(result.completed, true);
});

test('interrupção retoma na página seguinte sem repetir a primeira', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); const dir = await temp('predator-resume-'); const path = join(dir, 'checkpoint.json');
  const first = await collectPages({ adapter, fingerprint, checkpointPath: path, authorize, stopAfterPages: 1 }); assert.equal(first.completed, false);
  const second = await collectPages({ adapter, fingerprint, checkpointPath: path, authorize }); assert.equal(second.resumed, true);
  assert.deepEqual(adapter.counters.byCursor, { start: 1, 'cursor-page-2': 1 });
});

test('checkpoint corrompido e de outro fingerprint falham fechado', async () => {
  const dir = await temp('predator-checkpoint-'); const path = join(dir, 'checkpoint.json'); await writeFile(path, '{broken');
  await assert.rejects(readCheckpoint(path, fingerprint), /checkpoint rejected/);
  await writeFile(path, JSON.stringify({ version: 1, query_fingerprint: `sha256:${'b'.repeat(64)}`, next_cursor: 'x', completed_pages: 1, status: 'running' }));
  await assert.rejects(readCheckpoint(path, fingerprint), /fingerprint mismatch/);
});

test('retry transitório é limitado e auditável; erro definitivo não é repetido', async () => {
  const transient = createSimulatedRecoveryAdapter({ pages: [{ cursor: null, next_cursor: null, items: [], error: 'transient' }], details: {} }); const audit = []; const dir = await temp('predator-retry-');
  await collectPages({ adapter: transient, fingerprint, checkpointPath: join(dir, 'c.json'), authorize, maxRetries: 1, audit: async e => audit.push(e) });
  assert.equal(transient.counters.list, 2); assert.equal(audit.filter(e => e.event === 'retry').length, 1);
  const permanent = createSimulatedRecoveryAdapter({ pages: [{ cursor: null, error: 'permanent' }], details: {} });
  await assert.rejects(collectPages({ adapter: permanent, fingerprint, checkpointPath: join(dir, 'p.json'), authorize, maxRetries: 3 }), { code: 'permanent' }); assert.equal(permanent.counters.list, 1);
});

test('fake trata vazio, interrupção, cursor ausente e snapshot incompatível', async () => {
  const empty = createSimulatedRecoveryAdapter({ pages: [{ cursor: null, next_cursor: null, items: [] }], details: {} });
  assert.deepEqual((await empty.list({ cursor: null, authorization: authorize('search') })).items, []);
  const interrupted = createSimulatedRecoveryAdapter({ pages: [{ cursor: null, interrupt: true }], details: {} });
  await assert.rejects(interrupted.list({ cursor: null, authorization: authorize('search') }), { code: 'interrupted' });
  await assert.rejects(empty.list({ cursor: 'expired', authorization: authorize('search') }), { code: 'cursor_invalid' });
  const dir = await temp('predator-snapshot-mismatch-'); await runSimulatedBatch({ adapter: createSimulatedRecoveryAdapter(fixture), fingerprint, canonicalIndex, workdir: dir, budgetConfig: budget, stopAfterPages: 1 });
  await assert.rejects(readSyntheticSnapshot(join(dir, 'snapshots', 'sim-new-a.json'), `sha256:${'b'.repeat(64)}`), /incompatible/);
});

test('pipeline separa raw, normalizado e candidato e bloqueia detalhes de exatos', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); const dir = await temp('predator-pipeline-');
  const result = await runSimulatedBatch({ adapter, fingerprint, canonicalIndex, workdir: dir, budgetConfig: budget });
  const exact = result.candidates.find(c => c.candidate_id === 'cand-sim-exact'); assert.equal(exact.pre_deduplication.result, 'exact_duplicate'); assert.equal(exact.detail, null); assert.equal(adapter.counters.byRecord['sim-exact'], undefined);
  const snapshot = JSON.parse(await readFile(join(dir, 'snapshots', 'sim-new-a.json'), 'utf8')); assert.ok(snapshot.raw); assert.equal(snapshot.normalized, undefined); assert.equal(snapshot.candidate, undefined);
});

test('duplicidade do lote precede detalhe e provável é preservado', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); const result = await runSimulatedBatch({ adapter, fingerprint, canonicalIndex, workdir: await temp('predator-dedup-'), budgetConfig: budget });
  const repeated = result.candidates.find(c => c.candidate_id === 'cand-sim-new-a-repeat'); assert.equal(repeated.pre_deduplication.result, 'exact_duplicate'); assert.equal(repeated.detail, null);
  const probable = result.candidates.filter(c => c.pre_deduplication.result === 'probable_duplicate'); assert.equal(probable.length, 2); assert.ok(probable.every(c => c.detail));
});

test('decisões distintas do mesmo processo não são colapsadas', async () => {
  const result = await runSimulatedBatch({ adapter: createSimulatedRecoveryAdapter(fixture), fingerprint, canonicalIndex, workdir: await temp('predator-units-'), budgetConfig: budget });
  const ids = result.candidates.filter(c => c.normalized.process.normalized === '0800033-51.2018.8.18.0065').map(c => c.normalized.decision_unit_id);
  assert.deepEqual(ids, ['sim-unit-p1','sim-unit-p2']);
});

test('CNJ inválido não é inferido e original permanece rastreável', () => {
  assert.deepEqual(normalizeCnj('1234567-00.2025.8.99.0001'), { original: '1234567-00.2025.8.99.0001', normalized: null, valid: false });
  assert.deepEqual(normalizeCnj('1234567-03.2025.8.90.0001'), { original: '1234567-03.2025.8.90.0001', normalized: '1234567-03.2025.8.90.0001', valid: true });
});

test('gate final detecta mudança concorrente no índice', () => {
  const record = normalizeRecord(fixture.pages[0].items[1]); assert.throws(() => finalDeduplicate(record, { ...canonicalIndex, version: 'changed' }, canonicalIndex.version), /index changed/);
});

test('reexecução completa em estado limpo é idempotente', async () => {
  const one = await runSimulatedBatch({ adapter: createSimulatedRecoveryAdapter(fixture), fingerprint, canonicalIndex, workdir: await temp('predator-idem-a-'), budgetConfig: budget });
  const two = await runSimulatedBatch({ adapter: createSimulatedRecoveryAdapter(fixture), fingerprint, canonicalIndex, workdir: await temp('predator-idem-b-'), budgetConfig: budget }); assert.deepEqual(one, two);
});

test('cache elegível evita fake e registra consumo zero', async () => {
  const adapter = createSimulatedRecoveryAdapter(fixture); const events = []; const cache = lookupCache({ query_fingerprint: fingerprint, expires_at: '2030-01-01T00:00:00Z', payload: [] }, fingerprint, new Date('2029-01-01'));
  await executeAuthorized({ operation: 'search', config: budget, state: {}, cacheResult: cache, append: async e => events.push(e), adapter: auth => adapter.list({ cursor: null, authorization: auth }) });
  assert.equal(adapter.counters.list, 0); assert.deepEqual(events.map(e => [e.event, e.consumed_units]), [['cache_hit', 0]]);
});

test('artefatos efêmeros não aparecem em dist', async () => {
  const files = await readdir(new URL('../../dist/', import.meta.url), { recursive: true }); assert.equal(files.some(file => /(snapshots|checkpoint|ingestion[\\/](?:state|reports|batches))/i.test(file)), false);
});
