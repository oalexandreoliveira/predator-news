import { mkdir, rm } from 'node:fs/promises';
import { appendLedgerEvent, readLedger } from '../ledger.mjs';
import { applyReviewCommand } from './review-queue.mjs';
export const appendReviewEvent = (path, event) => appendLedgerEvent(path, event);
export const readReviewAudit = path => readLedger(path);
export async function executeReviewCommand(path, command, policy) {
  const lock = `${path}.review-lock`; try { await mkdir(lock); } catch (error) { if (error.code === 'EEXIST') throw new Error('review audit is locked'); throw error; }
  try { const events = await readLedger(path); const result = applyReviewCommand(events, command, policy); if (!result.idempotent) await appendLedgerEvent(path, result.event); return result; }
  finally { await rm(lock, { recursive: true, force: true }); }
}
