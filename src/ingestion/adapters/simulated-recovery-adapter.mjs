import { assertRecoveryAuthorization, RecoveryAdapterError } from './recovery-adapter.mjs';

export function createSimulatedRecoveryAdapter(fixture) {
  const stable = structuredClone(fixture); const counters = { list: 0, detail: 0, byCursor: {}, byRecord: {} }; const attempts = new Map();
  return Object.freeze({ kind: 'simulated-local', capabilities: Object.freeze({ pagination: true, detail: true, network: false }), counters,
    async list({ cursor = null, authorization }) {
      assertRecoveryAuthorization(authorization, 'search'); counters.list++; counters.byCursor[cursor ?? 'start'] = (counters.byCursor[cursor ?? 'start'] ?? 0) + 1;
      const page = stable.pages.find(item => (item.cursor ?? null) === cursor); if (!page) throw new RecoveryAdapterError('cursor_invalid', 'simulated cursor is absent or expired');
      if (page.error === 'transient') { const count = attempts.get(cursor) ?? 0; attempts.set(cursor, count + 1); if (count === 0) throw new RecoveryAdapterError('transient', 'simulated transient failure', { transient: true }); }
      if (page.error === 'permanent') throw new RecoveryAdapterError('permanent', 'simulated permanent failure');
      if (page.interrupt) throw new RecoveryAdapterError('interrupted', 'simulated interruption', { transient: true });
      return structuredClone({ cursor: page.cursor ?? null, next_cursor: page.next_cursor ?? null, items: page.items ?? [], raw: page });
    },
    async detail({ record_id, authorization }) {
      assertRecoveryAuthorization(authorization, 'detail'); counters.detail++; counters.byRecord[record_id] = (counters.byRecord[record_id] ?? 0) + 1;
      const detail = stable.details?.[record_id]; if (!detail) throw new RecoveryAdapterError('not_found', 'simulated detail not found'); return structuredClone({ record_id, raw: detail });
    }
  });
}
