export class IngestionBlockedError extends Error {
  constructor(code, message) { super(message); this.name = 'IngestionBlockedError'; this.code = code; }
}
