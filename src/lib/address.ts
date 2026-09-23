/* Origin and path only, never the query or the hash: a campaign tag or a
   link someone was sent can carry what identifies them. Every address that
   leaves the page for an analytics service goes through here. */

export function pageAddress(loc: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${loc.origin}${loc.pathname}`
}

/* Any web address reduced to its origin and path; empty for anything that
   is not one. */
export function stripAddress(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return ''
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return ''
  return `${parsed.origin}${parsed.pathname}`
}
