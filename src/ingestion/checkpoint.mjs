import { mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export function validateCheckpoint(value, fingerprint) {
  if (!value || value.version !== 1 || typeof value.query_fingerprint !== 'string' || !['running','completed','interrupted'].includes(value.status) || !Number.isInteger(value.completed_pages) || value.completed_pages < 0) throw new Error('invalid checkpoint');
  if (fingerprint && value.query_fingerprint !== fingerprint) throw new Error('checkpoint fingerprint mismatch');
  if (value.status !== 'completed' && value.next_cursor == null && value.completed_pages > 0) throw new Error('checkpoint cursor missing'); return value;
}
export async function readCheckpoint(path, fingerprint) { let text; try { text = await readFile(path, 'utf8'); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } try { return validateCheckpoint(JSON.parse(text), fingerprint); } catch (error) { throw new Error(`checkpoint rejected: ${error.message}`); } }
export async function writeCheckpoint(path, checkpoint) {
  validateCheckpoint(checkpoint); await mkdir(dirname(path), { recursive: true }); const temp = `${path}.${randomUUID()}.tmp`; const handle = await open(temp, 'wx'); await handle.writeFile(`${JSON.stringify(checkpoint, null, 2)}\n`); await handle.sync(); await handle.close();
  try { await rename(temp, path); } catch (error) { await rm(temp, { force: true }); throw error; } return checkpoint;
}
