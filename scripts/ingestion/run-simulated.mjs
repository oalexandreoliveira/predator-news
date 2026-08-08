import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { loadData } from '../data/load-data.mjs';
import { buildCanonicalIndex, createSimulatedRecoveryAdapter, runSimulatedBatch } from '../../src/ingestion/index.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const fixture = JSON.parse(await readFile(new URL('../../ingestion/fixtures/simulated-provider/two-pages.json', import.meta.url), 'utf8'));
const canonicalIndex = buildCanonicalIndex((await loadData(root)).decisions);
const result = await runSimulatedBatch({
  adapter: createSimulatedRecoveryAdapter(fixture),
  fingerprint: `sha256:${'a'.repeat(64)}`,
  canonicalIndex,
  workdir: await mkdtemp(join(tmpdir(), 'predator-simulated-')),
  budgetConfig: { monthly_limit: 1000, hard_stop: 900, operation_costs: { search: 1, detail: 1 }, reserve: { manual_research: 10, retries: 10, publisher_future: 10 } }
});
console.log(JSON.stringify(result.funnel, null, 2));
