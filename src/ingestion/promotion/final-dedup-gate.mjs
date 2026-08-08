import { normalizeRecord } from '../normalization.mjs';
import { preDeduplicate } from '../deduplication.mjs';
import { PromotionBlockedError } from './proposal-contract.mjs';
export function runFinalDedupGate(proposal, canonicalIndex, expectedVersion) {
  if (canonicalIndex.version !== expectedVersion) throw new PromotionBlockedError('canonical_index_stale', '/canonical_index_version', 'index changed concurrently');
  const p = proposal.payload; const normalized = normalizeRecord({ record_id: p.id, tribunal: p.identificacao.tribunal, process: p.identificacao.processo, decision_date: p.identificacao.data_julgamento, chamber: p.identificacao.orgao_julgador, reporter: p.identificacao.relator });
  const sameProcess = canonicalIndex.byProcess.get(`${normalized.tribunal}|${normalized.process.normalized}`);
  if (sameProcess) {
    const sameUnit = sameProcess.decision_date === normalized.decision_date && sameProcess.chamber === normalized.chamber;
    throw new PromotionBlockedError(sameUnit ? 'exact_duplicate' : 'probable_duplicate', '/payload/identificacao/processo', sameUnit ? 'same process and decision metadata' : 'same process with distinct decision metadata');
  }
  const result = preDeduplicate(normalized, { canonicalIndex });
  if (result.result === 'exact_duplicate') throw new PromotionBlockedError('exact_duplicate', '/payload/id', result.reasons.join(','));
  if (result.result === 'probable_duplicate') throw new PromotionBlockedError('probable_duplicate', '/payload/identificacao/processo', result.reasons.join(','));
  if (result.result === 'invalid' || result.result === 'insufficient_evidence') throw new PromotionBlockedError('invalid_proposal_identity', '/payload/identificacao', result.reasons.join(',')); return result;
}
