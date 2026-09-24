/* What the site's functions share: the refusal they answer with, the JSON
   body they read, and the check that a request came from the page's own
   origin. The underscore keeps Vercel from serving this file as a function
   of its own. */

export const NO_STORE = { 'cache-control': 'no-store' }

export async function readJson(req: Request): Promise<unknown> {
  const type = req.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return undefined
  try {
    return await req.json()
  } catch {
    return undefined
  }
}

export function refuse(status: number, error: string, headers: Record<string, string> = {}): Response {
  return Response.json({ ok: false, error }, { status, headers: { ...NO_STORE, ...headers } })
}

/* The address the browser used. Behind Vercel's proxy the request may carry
   an internal one; the forwarded headers carry the public scheme and host,
   which is what `Origin` names. Either header missing, the request's own
   value stands in for it. */
function publicOrigin(req: Request): URL {
  const url = new URL(req.url)
  const proto = req.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  const host = req.headers.get('x-forwarded-host')?.split(',')[0].trim()
  return new URL(`${proto ? `${proto}:` : url.protocol}//${host ?? url.host}`)
}

/* The page's own origin when the request came from it, and null for a
   request from anywhere else or with no Origin at all, which a function
   refuses before it reads the body. */
export function ownOrigin(req: Request): URL | null {
  let own: URL
  try {
    own = publicOrigin(req)
  } catch {
    return null
  }
  return req.headers.get('origin') === own.origin ? own : null
}
