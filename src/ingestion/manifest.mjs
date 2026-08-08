import { mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export async function createManifest(path, manifest) {
  await mkdir(dirname(path), { recursive: true });
  try {
    const existing = JSON.parse(await readFile(path, 'utf8'));
    if (JSON.stringify(existing) !== JSON.stringify(manifest)) throw new Error('manifest already exists with different content');
    return { created: false, manifest: existing };
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = `${path}.${randomUUID()}.tmp`;
  const handle = await open(temporary, 'wx'); await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`); await handle.sync(); await handle.close();
  try { await rename(temporary, path); } catch (error) { await rm(temporary, { force: true }); throw error; }
  return { created: true, manifest };
}
