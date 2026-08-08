import { createHash } from 'node:crypto';

const fold = value => String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;

export function canonicalizeQuery(query, plan, aliasesConfig = { aliases: {} }) {
  if (!Number.isInteger(plan?.version) || plan.version < 1) throw new TypeError('query plan version is required');
  const aliasMap = new Map();
  for (const [canonical, aliases] of Object.entries(aliasesConfig.aliases ?? {})) {
    aliasMap.set(fold(canonical), fold(canonical));
    for (const alias of aliases) aliasMap.set(fold(alias), fold(canonical));
  }
  const defaults = plan.default_parameters ?? {};
  const unordered = new Set(plan.unordered_filters ?? []);
  const normalized = {};
  for (const [key, raw] of Object.entries(query ?? {})) {
    if (raw == null) continue;
    const values = Array.isArray(raw) ? raw : [raw];
    let result = values.map(value => aliasMap.get(fold(value)) ?? fold(value));
    if (unordered.has(key)) result = [...new Set(result)].sort();
    const value = Array.isArray(raw) ? result : result[0];
    if (JSON.stringify(value) !== JSON.stringify(defaults[key])) normalized[key] = value;
  }
  return stable({ canonicalization_version: 1, query_plan_version: plan.version, filters: normalized });
}

export function fingerprintQuery(canonical) {
  return `sha256:${createHash('sha256').update(JSON.stringify(stable(canonical))).digest('hex')}`;
}
