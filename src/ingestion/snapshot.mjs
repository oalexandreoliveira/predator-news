import { mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export function validateSyntheticSnapshot(value, fingerprint) {
  if (!value || value.version !== 1 || value.origin !== 'simulated-local' || value.query_fingerprint !== fingerprint || !value.raw || value.normalized || value.candidate) throw new Error('invalid or incompatible synthetic snapshot'); return value;
}
export async function writeSyntheticSnapshot(path, snapshot, fingerprint) { validateSyntheticSnapshot(snapshot, fingerprint); await mkdir(dirname(path), { recursive: true }); const temp = `${path}.${randomUUID()}.tmp`; const handle = await open(temp, 'wx'); await handle.writeFile(`${JSON.stringify(snapshot, null, 2)}\n`); await handle.sync(); await handle.close(); try { await rename(temp, path); } catch (error) { await rm(temp, { force: true }); throw error; } return snapshot; }
export async function readSyntheticSnapshot(path, fingerprint) { return validateSyntheticSnapshot(JSON.parse(await readFile(path, 'utf8')), fingerprint); }
