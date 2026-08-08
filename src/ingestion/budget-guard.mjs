import { randomUUID } from 'node:crypto';
import { IngestionBlockedError } from './errors.mjs';

const finiteNonnegative = value => Number.isFinite(value) && value >= 0;
const issuedAuthorizations = new WeakSet();
export const isValidAuthorization = authorization => Boolean(authorization && issuedAuthorizations.has(authorization));
export function authorizeOperation(operation, config, state, options = {}) {
  const cost = options.estimatedUnits ?? config?.operation_costs?.[operation];
  if (!finiteNonnegative(config?.monthly_limit)) throw new IngestionBlockedError('missing_monthly_limit', 'monthly_limit is required');
  if (!finiteNonnegative(config?.hard_stop) || config.hard_stop > config.monthly_limit) throw new IngestionBlockedError('invalid_hard_stop', 'valid hard_stop is required');
  if (!finiteNonnegative(cost)) throw new IngestionBlockedError('unknown_cost', `unknown cost for ${operation}`);
  const operationalReserve = Object.values(config.reserve ?? {}).reduce((n, v) => n + (finiteNonnegative(v) ? v : 0), 0);
  const ceiling = Math.min(config.monthly_limit, config.hard_stop);
  const available = ceiling - (state.confirmed ?? 0) - (state.reserved ?? 0) - operationalReserve;
  if (cost > available) throw new IngestionBlockedError('insufficient_budget', 'operation exceeds available ordinary budget');
  const authorization = { authorization_id: `auth-${randomUUID()}`, operation, estimated_units: cost, retry_of: options.retryOf ?? null };
  issuedAuthorizations.add(authorization);
  return Object.freeze(authorization);
}
export async function executeAuthorized({ operation, config, state, cacheResult, append, adapter, retryOf = null }) {
  if (cacheResult?.status === 'hit') { await append({ event: 'cache_hit', operation, estimated_units: 0, consumed_units: 0, retry_of: retryOf }); return cacheResult.entry; }
  const auth = authorizeOperation(operation, config, state, { retryOf });
  await append({ event: 'reservation', operation, estimated_units: auth.estimated_units, consumed_units: 0, authorization_id: auth.authorization_id, retry_of: auth.retry_of });
  try {
    const result = await adapter(auth);
    const actual = result.consumed_units;
    if (!finiteNonnegative(actual) || actual > auth.estimated_units || (state.confirmed ?? 0) + actual > config.hard_stop) throw new IngestionBlockedError('invalid_reconciliation', 'actual consumption is invalid or exceeds its authorization/hard stop');
    await append({ event: 'confirmation', operation, estimated_units: auth.estimated_units, consumed_units: actual, authorization_id: auth.authorization_id, retry_of: auth.retry_of });
    return result;
  } catch (error) {
    await append({ event: 'failure', operation, estimated_units: auth.estimated_units, consumed_units: 0, authorization_id: auth.authorization_id, retry_of: auth.retry_of, reason: error.message });
    throw error;
  }
}
