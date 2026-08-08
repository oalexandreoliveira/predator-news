import { createHash } from 'node:crypto';
export const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
export const hashValue = value => `sha256:${createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')}`;
export class PromotionBlockedError extends Error { constructor(code, path, detail) { super(`${code} at ${path}: ${detail}`); this.name = 'PromotionBlockedError'; this.code = code; this.path = path; this.detail = detail; } }
export function assertProposalEnvelope(proposal, outputPath) {
  if (proposal.canonical !== false || proposal.publishable !== false || proposal.promotion_status !== 'proposed') throw new PromotionBlockedError('proposal_not_noncanonical', '/', 'proposal markers are required');
  if (!outputPath?.endsWith('.proposal.json') || /data[\\/]jurisprudencia/i.test(outputPath)) throw new PromotionBlockedError('canonical_write_attempt', '/outputPath', 'operational .proposal.json path required'); return proposal;
}
