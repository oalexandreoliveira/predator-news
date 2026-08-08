import { cp, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
export async function simulatePromotionSandbox({ repoRoot, proposals, induceFailure = false }) {
  const sandbox = await mkdtemp(join(repoRoot, 'ingestion', 'sandboxes', 'promotion-')); let proofBuild = null;
  try {
    for (const name of ['content','data','schemas','scripts','src']) await cp(join(repoRoot, name), join(sandbox, name), { recursive: true });
    for (const proposal of proposals) { const path = join(sandbox, 'data', 'jurisprudencia', `${proposal.payload.id}.yaml`); await writeFile(path, YAML.stringify(proposal.payload), { flag: 'wx' }); }
    if (induceFailure) throw new Error('induced sandbox failure');
    await import(`${pathToFileURL(join(sandbox, 'scripts', 'build.mjs')).href}?proof=${Date.now()}`);
    proofBuild = join(sandbox, 'proof-build'); await rename(join(sandbox, 'dist'), proofBuild);
    return { validated: true, built: true, applied: proposals.length, proof_build_was_isolated: proofBuild.startsWith(sandbox) };
  } finally { await rm(sandbox, { recursive: true, force: true }); }
}
