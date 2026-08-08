export function lookupCache(entry, fingerprint, now = new Date()) {
  if (!entry || entry.query_fingerprint !== fingerprint) return { status: 'miss' };
  if (entry.invalidated_at) return { status: 'invalidated', entry };
  if (!entry.expires_at || Number.isNaN(Date.parse(entry.expires_at))) return { status: 'expired', entry };
  return new Date(entry.expires_at) > now ? { status: 'hit', entry } : { status: 'expired', entry };
}

export function assertForcedRefresh(reason) {
  if (!String(reason ?? '').trim()) throw new TypeError('forced refresh requires a reason');
  return { forced: true, reason: reason.trim() };
}
