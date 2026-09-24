// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import handler, { handleConsent } from '../consent'

const post = (body: unknown, init: RequestInit = {}, url = 'https://www.tripcerto.com/api/consent') =>
  new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: new URL(url).origin },
    body: JSON.stringify(body),
    ...init,
  })

describe('POST /api/consent', () => {
  it('sets a 180-day cookie on .tripcerto.com', async () => {
    const res = await handleConsent(post({ analytics: 'granted' }), 1_758_620_000_000)
    expect(res.status).toBe(204)
    expect(res.headers.get('set-cookie')).toBe('tc_consent=2.granted.1758620000; Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('records a refusal the same way', async () => {
    const res = await handleConsent(post({ analytics: 'denied' }), 1_758_620_000_000)
    expect(res.status).toBe(204)
    expect(res.headers.get('set-cookie')).toBe('tc_consent=2.denied.1758620000; Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
  })

  it('marks and unmarks a team browser', async () => {
    expect((await handleConsent(post({ team: true }), 0)).headers.get('set-cookie')).toBe('tc_team=1; Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
    expect((await handleConsent(post({ team: false }), 0)).headers.get('set-cookie')).toBe('tc_team=; Path=/; Max-Age=0; SameSite=Lax; Domain=.tripcerto.com; Secure')
  })

  it('keeps the cookie to the host everywhere but tripcerto.com', async () => {
    const preview = await handleConsent(post({ analytics: 'granted' }, {}, 'https://tripcerto-public.vercel.app/api/consent'), 1_758_620_000_000)
    expect(preview.headers.get('set-cookie')).toBe('tc_consent=2.granted.1758620000; Path=/; Max-Age=15552000; SameSite=Lax; Secure')
    const local = await handleConsent(post({ analytics: 'granted' }, {}, 'http://localhost:3000/api/consent'), 1_758_620_000_000)
    expect(local.headers.get('set-cookie')).toBe('tc_consent=2.granted.1758620000; Path=/; Max-Age=15552000; SameSite=Lax')
  })

  it('refuses another origin, another method and a bad body', async () => {
    expect((await handleConsent(post({ analytics: 'granted' }, { headers: { 'content-type': 'application/json', origin: 'https://evil.example' } }), 0)).status).toBe(403)
    expect((await handleConsent(new Request('https://www.tripcerto.com/api/consent'), 0)).status).toBe(405)
    expect((await handleConsent(post({ analytics: 'yes' }), 0)).status).toBe(400)
    expect((await handleConsent(post('granted'), 0)).status).toBe(400)
  })

  it('refuses a request with no origin at all, and says why', async () => {
    const res = await handleConsent(post({ analytics: 'granted' }, { headers: { 'content-type': 'application/json' } }), 0)
    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ ok: false, error: 'forbidden_origin' })
    expect(res.headers.get('content-type')).toBe('application/json')
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  it('names the one method it answers, says why, and caches no refusal', async () => {
    const res = await handleConsent(new Request('https://www.tripcerto.com/api/consent', { method: 'PUT', body: '{}' }), 0)
    expect(res.status).toBe(405)
    expect(await res.json()).toEqual({ ok: false, error: 'method_not_allowed' })
    expect(res.headers.get('allow')).toBe('POST')
    expect(res.headers.get('content-type')).toBe('application/json')
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  /* Behind Vercel's proxy the function may see its own internal address;
     the public one is in the forwarded headers, and that is the origin a
     browser sends. */
  describe('behind the proxy', () => {
    const forwarded = (headers: Record<string, string>, url = 'http://127.0.0.1:3000/api/consent') =>
      new Request(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify({ analytics: 'denied' }),
      })

    it('judges the origin and the Secure flag by the address the browser used', async () => {
      const res = await handleConsent(
        forwarded({ origin: 'https://www.tripcerto.com', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'www.tripcerto.com' }),
        1_758_620_000_000,
      )
      expect(res.status).toBe(204)
      expect(res.headers.get('set-cookie')).toBe('tc_consent=2.denied.1758620000; Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
    })

    it('takes the first value of a forwarded list', async () => {
      const res = await handleConsent(
        forwarded({ origin: 'https://www.tripcerto.com', 'x-forwarded-proto': 'https, http', 'x-forwarded-host': 'www.tripcerto.com, 127.0.0.1:3000' }),
        1_758_620_000_000,
      )
      expect(res.status).toBe(204)
      expect(res.headers.get('set-cookie')).toMatch(/; Domain=\.tripcerto\.com; Secure$/)
    })

    it('falls back to the request address for whichever header is missing', async () => {
      const proto = await handleConsent(forwarded({ origin: 'http://www.tripcerto.com', 'x-forwarded-host': 'www.tripcerto.com' }), 0)
      expect(proto.status).toBe(204)
      expect(proto.headers.get('set-cookie')).toMatch(/; Domain=\.tripcerto\.com$/)
      const host = await handleConsent(forwarded({ origin: 'https://127.0.0.1:3000', 'x-forwarded-proto': 'https' }), 0)
      expect(host.status).toBe(204)
      expect(host.headers.get('set-cookie')).toMatch(/SameSite=Lax; Secure$/)
    })

    it('refuses an origin that is not the forwarded one', async () => {
      for (const origin of ['http://127.0.0.1:3000', 'https://tripcerto-public.vercel.app', 'http://www.tripcerto.com']) {
        const res = await handleConsent(forwarded({ origin, 'x-forwarded-proto': 'https', 'x-forwarded-host': 'www.tripcerto.com' }), 0)
        expect(res.status, origin).toBe(403)
        expect(await res.json()).toEqual({ ok: false, error: 'forbidden_origin' })
        expect(res.headers.get('set-cookie')).toBeNull()
      }
    })

    it('refuses a forwarded host that is not a host', async () => {
      const res = await handleConsent(forwarded({ origin: 'https://www.tripcerto.com', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'www tripcerto com' }), 0)
      expect(res.status).toBe(403)
      expect(await res.json()).toEqual({ ok: false, error: 'forbidden_origin' })
    })
  })

  it('is the handler the platform calls', async () => {
    const res = await handler.fetch(post({ analytics: 'granted' }))
    expect(res.status).toBe(204)
    expect(res.headers.get('set-cookie')).toMatch(/^tc_consent=2\.granted\.\d+; /)
  })

  it('answers every malformed body with the same error and no cookie', async () => {
    const bodies = [
      post({ analytics: 'granted', team: true }),
      post({ team: 'yes' }),
      post({}),
      post([]),
      post(null),
      post(undefined, { body: '{"analytics":' }),
      post({ analytics: 'granted' }, { headers: { 'content-type': 'text/plain', origin: 'https://www.tripcerto.com' } }),
      post({ analytics: 'granted' }, { headers: { origin: 'https://www.tripcerto.com' }, body: new Blob([JSON.stringify({ analytics: 'granted' })]) }),
    ]
    for (const req of bodies) {
      const res = await handleConsent(req, 0)
      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ ok: false, error: 'invalid_body' })
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(res.headers.get('set-cookie')).toBeNull()
    }
  })

  it('accepts JSON that names its charset', async () => {
    const res = await handleConsent(post({ analytics: 'granted' }, { headers: { 'content-type': 'application/json; charset=utf-8', origin: 'https://www.tripcerto.com' } }), 0)
    expect(res.status).toBe(204)
  })
})

/* Vercel deploys every file under api/ as a function, except those on a path
   with a segment starting `_` or `.`: a test anywhere else would ship as an
   endpoint. */
it('keeps every test out of the functions Vercel deploys', () => {
  const api = join(import.meta.dirname, '..')
  const deployed = readdirSync(api, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(api, join(entry.parentPath, entry.name)))
    .filter((path) => !path.split('/').some((segment) => segment.startsWith('_') || segment.startsWith('.')) && !path.endsWith('.d.ts'))
  expect(deployed).toEqual(['consent.ts'])
})

/* Vercel runs a function in iad1 (Washington) unless the project names a
   region; the consent endpoint runs in London. */
it('runs the functions in London', () => {
  const config: { regions?: string[] } = JSON.parse(readFileSync(join(import.meta.dirname, '..', '..', 'vercel.json'), 'utf8'))
  expect(config.regions).toEqual(['lhr1'])
})
