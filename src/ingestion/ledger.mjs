import { mkdir, open, readFile, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export function parseLedger(text) {
  if (!text.trim()) return [];
  return text.trimEnd().split('\n').map((line, index) => { try { return JSON.parse(line); } catch { throw new Error(`corrupt ledger at line ${index + 1}`); } });
}
export async function readLedger(path) { try { return parseLedger(await readFile(path, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return []; throw error; } }
export async function appendLedgerEvent(path, event) {
  await mkdir(dirname(path), { recursive: true });
  const lock = `${path}.lock`;
  try {
    await mkdir(lock);
  } catch (error) { if (error.code === 'EEXIST') throw new Error('ledger is locked'); throw error; }
  try {
    const handle = await open(path, 'a');
    await handle.writeFile(`${JSON.stringify(event)}\n`, 'utf8');
    await handle.sync();
    await handle.close();
    return event;
  } finally { await rm(lock, { recursive: true, force: true }); }
}
export function makeLedgerEvent(event, now = new Date()) { return { entry_id: `le-${randomUUID()}`, timestamp: now.toISOString(), ...event }; }
export function summarizeLedger(events, period) {
  const selected = events.filter(e => e.period === period);
  return {
    confirmed: selected.reduce((n, e) => n + (e.event === 'confirmation' || e.event === 'compensation' ? e.consumed_units : 0), 0),
    reserved: selected.reduce((n, e) => n + (e.event === 'reservation' ? e.estimated_units : 0) - (['confirmation','failure','refund'].includes(e.event) ? e.estimated_units : 0), 0)
  };
}
