import { promotionMappedPaths } from './reviewed-transformer.mjs';
const get = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
export function createSemanticDiff(artifact, proposal, blocked = []) {
  const reviewed = new Set(artifact.field_decisions.map(field => field.canonical_path));
  return { additions: [{ path: '/payload/id', value: proposal?.payload?.id, rule: 'stable_identifier' }], mappings: [...reviewed].sort().map(path => ({ from: `/field_decisions/${path}`, to: `/payload/${path.replaceAll('.','/')}`, value: get(proposal?.payload, path) })), intentional_omissions: promotionMappedPaths().filter(path => !reviewed.has(path)).map(path => ({ path: `/payload/${path.replaceAll('.','/')}`, reason: 'not_explicitly_reviewed' })), blocks: blocked.map(error => ({ code: error.code, path: error.path, detail: error.detail })) };
}
