import { hashValue, PromotionBlockedError } from '../promotion/proposal-contract.mjs';
const forbiddenPath = path => !path || /[*?{}[\]]/.test(path) || path.includes('..') || path.endsWith('/') || path.includes('\\') || !path.startsWith('ingestion/fixtures/');
export function createDatasetManifest(input, parameters) {
  if (input.dataset !== 'DATASET-002') throw new PromotionBlockedError('dataset_not_allowed','/dataset','DATASET-002 required');
  if (input.dry_run !== true || input.promotion_authorized !== false) throw new PromotionBlockedError('manifest_invalid','/','dry_run=true and promotion_authorized=false required');
  if (!input.allowed_fixtures?.length || input.allowed_fixtures.some(f => forbiddenPath(f.path))) throw new PromotionBlockedError('fixture_not_allowed','/allowed_fixtures','explicit fixture files required');
  const base = { ...structuredClone(input), parameters_hash: hashValue(parameters) }; delete base.manifest_id;
  return Object.freeze({ manifest_id:`dataset-manifest-${hashValue(base).replace(':','-')}`,...base });
}
export function verifyManifest(manifest, files) { const base=structuredClone(manifest);delete base.manifest_id;if(`dataset-manifest-${hashValue(base).replace(':','-')}`!==manifest.manifest_id)throw new PromotionBlockedError('manifest_changed','/manifest_id','manifest mutated');for(const fixture of manifest.allowed_fixtures)if(files[fixture.path]!==fixture.sha256)throw new PromotionBlockedError('manifest_invalid',fixture.path,'fixture hash mismatch');return manifest; }
export const manifestFingerprint = manifest => manifest.manifest_id;
