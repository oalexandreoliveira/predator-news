import { createHash } from 'node:crypto';
export const quoteHash = text => `sha256:${createHash('sha256').update(text).digest('hex')}`;
export function makeEvidence({ source = 'candidate_text', section, excerpt }) {
  if (!section || !excerpt) throw new TypeError('evidence section and excerpt are required');
  return { source, locator: { section, quote_hash: quoteHash(excerpt) }, excerpt };
}
export function verifyEvidence(candidate, evidence) { const text = candidate.sections?.[evidence.locator.section]; return typeof text === 'string' && text.includes(evidence.excerpt) && quoteHash(evidence.excerpt) === evidence.locator.quote_hash; }
export function validateConfidence(value) { if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError('confidence must be between 0 and 1'); return value; }
