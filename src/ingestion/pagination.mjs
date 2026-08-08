import { readCheckpoint, writeCheckpoint } from './checkpoint.mjs';
import { RecoveryAdapterError } from './adapters/recovery-adapter.mjs';
export async function collectPages({ adapter, fingerprint, checkpointPath, authorize, audit = async () => {}, maxRetries = 1, stopAfterPages = Infinity }) {
  const checkpoint = await readCheckpoint(checkpointPath, fingerprint); if (checkpoint?.status === 'completed') return { pages: [], resumed: true, completed: true };
  let cursor = checkpoint?.next_cursor ?? null; let completedPages = checkpoint?.completed_pages ?? 0; const pages = [];
  while (true) { let attempt = 0; let page;
    while (true) { try { page = await adapter.list({ cursor, authorization: authorize('search') }); break; } catch (error) { if (!(error instanceof RecoveryAdapterError) || !error.transient || attempt >= maxRetries) throw error; attempt++; await audit({ event: 'retry', cursor, attempt, error: error.code }); } }
    pages.push(page); completedPages++; const state = { version: 1, query_fingerprint: fingerprint, next_cursor: page.next_cursor, completed_pages: completedPages, status: page.next_cursor ? 'running' : 'completed' };
    await writeCheckpoint(checkpointPath, state); await audit({ event: 'page_completed', cursor, next_cursor: page.next_cursor });
    if (!page.next_cursor || pages.length >= stopAfterPages) return { pages, resumed: Boolean(checkpoint), completed: !page.next_cursor }; cursor = page.next_cursor;
  }
}
