import { createHash } from 'node:crypto';

const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
export function createTaxonomyView(taxonomy, aliases = {}, catalogs = {}) {
  const snapshot = structuredClone({ taxonomy, aliases, catalogs });
  const version = `sha256:${createHash('sha256').update(JSON.stringify(stable(snapshot))).digest('hex')}`;
  const families = new Map(Object.entries(snapshot.taxonomy.families ?? {}).map(([name, values]) => [name, new Set(values)]));
  const aliasMaps = new Map(Object.entries(snapshot.aliases.aliases ?? {}).map(([family, values]) => [family, new Map(Object.entries(values))]));
  return Object.freeze({ version, has: (family, value) => families.get(family)?.has(value) ?? false, resolve: (family, value) => families.get(family)?.has(value) ? value : aliasMaps.get(family)?.get(value) ?? null, values: family => [...(families.get(family) ?? [])] });
}
