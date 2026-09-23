/* POST /api/consent: sets the analytics answer, or the mark on our own
   browsers, as a cookie from the server. Safari keeps a cookie a script
   writes for seven days at most, and one the server sets for its full age.
   On a tripcerto.com host the cookie is set on .tripcerto.com, so an answer
   given on one host holds on all of them.

   A function cannot import the site's Vite-resolved modules, so the cookie's
   format is restated here; src/lib/consent.test.ts holds the two to the same
   strings. */

type ConsentDecision = 'granted' | 'denied'

const CONSENT_COOKIE = 'tc_consent'
const TEAM_COOKIE = 'tc_team'
const CONSENT_POLICY_VERSION = 2
const CONSENT_MAX_AGE_SECONDS = 15552000
const SHARED_DOMAIN = 'tripcerto.com'

function formatConsentValue(analytics: ConsentDecision, decidedAt: number): string {
  return `${CONSENT_POLICY_VERSION}.${analytics}.${Math.floor(decidedAt / 1000)}`
}

function cookieAttributes(hostname: string, secure: boolean, maxAge: number = CONSENT_MAX_AGE_SECONDS): string {
  const shared = hostname === SHARED_DOMAIN || hostname.endsWith(`.${SHARED_DOMAIN}`)
  return `Path=/; Max-Age=${maxAge}; SameSite=Lax${shared ? `; Domain=.${SHARED_DOMAIN}` : ''}${secure ? '; Secure' : ''}`
}

const NO_STORE = { 'cache-control': 'no-store' }

/* The cookie a body asks for: exactly `{"analytics":"granted"|"denied"}` or
   `{"team":true|false}`, and nothing else. */
function cookieFor(body: unknown, url: URL, now: number): string | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body) || Object.keys(body).length !== 1) return null
  const attributes = (maxAge?: number) => cookieAttributes(url.hostname, url.protocol === 'https:', maxAge)
  if ('analytics' in body && (body.analytics === 'granted' || body.analytics === 'denied')) {
    return `${CONSENT_COOKIE}=${formatConsentValue(body.analytics, now)}; ${attributes()}`
  }
  if ('team' in body && typeof body.team === 'boolean') {
    return body.team ? `${TEAM_COOKIE}=1; ${attributes()}` : `${TEAM_COOKIE}=; ${attributes(0)}`
  }
  return null
}

async function readJson(req: Request): Promise<unknown> {
  const type = req.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return undefined
  try {
    return await req.json()
  } catch {
    return undefined
  }
}

/* Only the page's own origin may set the cookie: a request from anywhere
   else, or with no Origin at all, is refused before its body is read. */
export async function handleConsent(req: Request, now: number): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { ...NO_STORE, allow: 'POST' } })
  const url = new URL(req.url)
  if (req.headers.get('origin') !== url.origin) return new Response(null, { status: 403, headers: NO_STORE })
  const cookie = cookieFor(await readJson(req), url, now)
  if (!cookie) return Response.json({ ok: false, error: 'invalid_body' }, { status: 400, headers: NO_STORE })
  return new Response(null, { status: 204, headers: { ...NO_STORE, 'set-cookie': cookie } })
}

export const config = { useWebApi: true }

export default { fetch: (req: Request) => handleConsent(req, Date.now()) }
