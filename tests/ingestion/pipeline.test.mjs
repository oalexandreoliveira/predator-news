import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  appendLedgerEvent, authorizeOperation, canonicalizeQuery, createManifest,
  executeAuthorized, fingerprintQuery, lookupCache, parseLedger, summarizeLedger
} from '../../src/ingestion/index.mjs';

const plan = { version: 1, unordered_filters: ['tribunais', 'temas'], default_parameters: {} };
const aliases = { aliases: { consentimento: ['vício de vontade'], rmc: ['reserva de margem consignável'] } };
const fp = query => fingerprintQuery(canonicalizeQuery(query, plan, aliases));
const config = { monthly_limit: 100, hard_stop: 90, operation_costs: { search: 10 }, reserve: { manual_research: 10, retries: 5, publisher_future: 5 } };

test('ordem de filtros não muda fingerprint', () => assert.equal(fp({ tribunais: ['TJPI','TJCE'], temas: ['rmc','consentimento'] }), fp({ temas: ['consentimento','rmc'], tribunais: ['tjce','tjpi'] })));
test('tribunal, data e versão são materiais', () => {
  const base = fp({ tribunais: ['TJCE'], inicio: '2026-01-01' });
  assert.notEqual(base, fp({ tribunais: ['TJPI'], inicio: '2026-01-01' }));
  assert.notEqual(base, fp({ tribunais: ['TJCE'], inicio: '2026-02-01' }));
  assert.notEqual(base, fingerprintQuery(canonicalizeQuery({ tribunais: ['TJCE'], inicio: '2026-01-01' }, { ...plan, version: 2 }, aliases)));
});
test('somente alias declarado é normalizado', () => {
  assert.equal(fp({ temas: ['vício de vontade'] }), fp({ temas: ['consentimento'] }));
  assert.notEqual(fp({ temas: ['erro substancial'] }), fp({ temas: ['consentimento'] }));
});
test('cache válido evita adaptador e cache expirado exige autorização', async () => {
  let calls = 0; const events = [];
  const entry = { query_fingerprint: 'x', expires_at: '2030-01-01T00:00:00Z', payload: [1] };
  await executeAuthorized({ operation: 'search', config, state: {}, cacheResult: lookupCache(entry, 'x', new Date('2029-01-01')), append: async e => events.push(e), adapter: async () => { calls++; } });
  assert.equal(calls, 0); assert.equal(events[0].event, 'cache_hit');
  assert.equal(lookupCache(entry, 'x', new Date('2031-01-01')).status, 'expired');
  await executeAuthorized({ operation: 'search', config, state: {}, cacheResult: { status: 'expired' }, append: async e => events.push(e), adapter: async () => { calls++; return { consumed_units: 8 }; } });
  assert.equal(calls, 1);
});
test('budget guard falha fechado para limite, custo e saldo', () => {
  assert.throws(() => authorizeOperation('search', { ...config, monthly_limit: null }, {}), { code: 'missing_monthly_limit' });
  assert.throws(() => authorizeOperation('unknown', config, {}), { code: 'unknown_cost' });
  assert.throws(() => authorizeOperation('search', config, { confirmed: 61 }), { code: 'insufficient_budget' });
});
test('reservas ficam protegidas e hard stop bloqueia', () => {
  assert.doesNotThrow(() => authorizeOperation('search', config, { confirmed: 59 }));
  assert.throws(() => authorizeOperation('search', config, { confirmed: 61 }), { code: 'insufficient_budget' });
  assert.throws(() => authorizeOperation('search', { ...config, hard_stop: 101 }, {}), { code: 'invalid_hard_stop' });
});
test('reconciliação acrescenta evento e preserva reserva', async () => {
  const events = [];
  await executeAuthorized({ operation: 'search', config, state: {}, append: async e => events.push(e), adapter: async () => ({ consumed_units: 7 }) });
  assert.deepEqual(events.map(e => e.event), ['reservation','confirmation']);
  assert.equal(events[0].estimated_units, 10); assert.equal(events[1].consumed_units, 7);
});
test('retry autorizado referencia tentativa anterior', async () => {
  const events = [];
  await executeAuthorized({ operation: 'search', config, state: {}, retryOf: 'le-old', append: async e => events.push(e), adapter: async () => ({ consumed_units: 10 }) });
  assert.ok(events.every(e => e.retry_of === 'le-old'));
});
test('ledger é append-only, resumível e corrupção falha segura', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'predator-ledger-')); const path = join(dir, 'ledger.jsonl');
  await appendLedgerEvent(path, { entry_id: 'le-1', period: '2026-08', event: 'reservation', estimated_units: 10, consumed_units: 0 });
  await appendLedgerEvent(path, { entry_id: 'le-2', period: '2026-08', event: 'confirmation', estimated_units: 10, consumed_units: 7 });
  const text = await readFile(path, 'utf8'); const events = parseLedger(text);
  assert.equal(events.length, 2); assert.deepEqual(summarizeLedger(events, '2026-08'), { confirmed: 7, reserved: 0 });
  assert.throws(() => parseLedger(`${text}{broken}\n`), /corrupt ledger/);
});
test('manifesto repetido é idempotente e divergência é bloqueada', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'predator-manifest-')); const path = join(dir, 'manifest.json'); const manifest = { batch_id: 'fixture-1' };
  assert.equal((await createManifest(path, manifest)).created, true);
  assert.equal((await createManifest(path, manifest)).created, false);
  await assert.rejects(createManifest(path, { batch_id: 'fixture-2' }), /different content/);
});
