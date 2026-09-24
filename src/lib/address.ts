/* Every address that leaves the page for an analytics service goes through
   here. A link someone was sent can carry what identifies them, so the hash
   never leaves, and the query leaves only as the campaign tags analytics
   needs to say where a visit came from. */

/* The query parameters an analytics address keeps: the campaign tags on a
   link we or a partner published. */
const CAMPAIGN_TAGS: ReadonlySet<string> = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'])

/* The page as origin and path, which is what decides whether a page is new. */
export function pageAddress(loc: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${loc.origin}${loc.pathname}`
}

/* A web address as an analytics service may receive it: origin, path and
   the campaign tags, in the order they came and exactly as they were
   written. Every other parameter and the hash go. Empty for anything that
   is not a web address. */
export function analyticsAddress(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return ''
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return ''
  const tags = parsed.search
    .slice(1)
    .split('&')
    .filter((pair) => CAMPAIGN_TAGS.has(pair.split('=', 1)[0]))
  return `${parsed.origin}${parsed.pathname}${tags.length > 0 ? `?${tags.join('&')}` : ''}`
}
