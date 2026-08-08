import { join } from 'node:path';
import { authorizeOperation } from './budget-guard.mjs';
import { collectPages } from './pagination.mjs';
import { normalizeRecord } from './normalization.mjs';
import { preDeduplicate, finalDeduplicate } from './deduplication.mjs';
import { writeSyntheticSnapshot } from './snapshot.mjs';

export async function runSimulatedBatch({ adapter, fingerprint, canonicalIndex, workdir, budgetConfig, stopAfterPages = Infinity, audit = async () => {} }) {
  const state = { confirmed: 0, reserved: 0 }; const authorize = operation => authorizeOperation(operation, budgetConfig, state);
  const collection = await collectPages({ adapter, fingerprint, checkpointPath: join(workdir, 'checkpoint.json'), authorize, audit, stopAfterPages });
  const rawItems = collection.pages.flatMap(page => page.items); const normalized = []; const candidates = []; const seenRecordIds = new Set();
  for (const raw of rawItems) {
    if (seenRecordIds.has(raw.record_id)) continue; seenRecordIds.add(raw.record_id);
    await writeSyntheticSnapshot(join(workdir, 'snapshots', `${raw.record_id}.json`), { version: 1, origin: 'simulated-local', query_fingerprint: fingerprint, raw }, fingerprint);
    const record = normalizeRecord(raw); const pre = preDeduplicate(record, { canonicalIndex, batchRecords: normalized }); normalized.push(record);
    let detail = null; let final = pre;
    if (pre.retrieve_detail) { detail = await adapter.detail({ record_id: raw.record_id, authorization: authorize('detail') }); final = finalDeduplicate(record, canonicalIndex, canonicalIndex.version); }
    candidates.push({ candidate_id: `cand-${raw.record_id}`, raw_snapshot: `${raw.record_id}.json`, normalized: record, pre_deduplication: pre, detail: detail?.raw ?? null, deduplication: final });
  }
  const count = result => candidates.filter(c => c.pre_deduplication.result === result).length;
  return { fixture: 'simulated-local', fingerprint, completed: collection.completed, candidates, funnel: { listed: rawItems.length, pre_exact_duplicates: count('exact_duplicate'), probable: count('probable_duplicate'), details_simulated: candidates.filter(c => c.detail).length, final_duplicates: candidates.filter(c => c.deduplication.result === 'exact_duplicate').length, distinct: candidates.filter(c => c.deduplication.result === 'distinct_decision').length, invalid: count('invalid'), insufficient: count('insufficient_evidence') } };
}
