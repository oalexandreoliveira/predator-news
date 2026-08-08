import { isValidAuthorization } from '../budget-guard.mjs';

export class RecoveryAdapterError extends Error {
  constructor(code, message, { transient = false } = {}) { super(message); this.name = 'RecoveryAdapterError'; this.code = code; this.transient = transient; }
}
export function assertRecoveryAuthorization(authorization, operation) {
  if (!isValidAuthorization(authorization) || authorization.operation !== operation) throw new RecoveryAdapterError('invalid_authorization', `valid ${operation} authorization required`);
}
export function assertRecoveryAdapter(adapter) {
  if (!adapter || adapter.kind !== 'simulated-local' || typeof adapter.list !== 'function' || typeof adapter.detail !== 'function') throw new TypeError('a simulated local recovery adapter is required');
  return adapter;
}
