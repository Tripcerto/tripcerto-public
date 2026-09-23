import { describe, expect, it } from 'vitest'
import { handleConsent } from '../../api/consent'
import { CONSENT_COOKIE, TEAM_COOKIE, cookieAttributes, formatConsentValue, parseConsentValue, readCookie, type ConsentDecision } from './consent'

const NOW = 1_758_620_000
const DAY = 86_400

describe('tc_consent', () => {
  it('formats policy version, answer and seconds', () => {
    expect(formatConsentValue('granted', NOW * 1000)).toBe('2.granted.1758620000')
    expect(formatConsentValue('denied', NOW * 1000 + 999)).toBe('2.denied.1758620000')
  })

  it('reads a live answer and refuses stale, wrong-version and junk values', () => {
    expect(parseConsentValue('2.denied.1758620000', NOW * 1000)).toBe('denied')
    expect(parseConsentValue('1.granted.1758620000', NOW * 1000)).toBeNull()
    expect(parseConsentValue('2.granted.1', NOW * 1000)).toBeNull()
    expect(parseConsentValue('2.maybe.1758620000', NOW * 1000)).toBeNull()
    expect(parseConsentValue(null, NOW * 1000)).toBeNull()
  })

  it('keeps an answer for 180 days and not a second longer', () => {
    const decided = `2.granted.${NOW - 180 * DAY}`
    expect(parseConsentValue(decided, NOW * 1000)).toBe('granted')
    expect(parseConsentValue(decided, (NOW + 1) * 1000)).toBeNull()
  })

  it('refuses a value that is not exactly version, answer and whole seconds', () => {
    for (const raw of ['', '2.granted', '2.granted.1758620000.1', '02.granted.1758620000', '2.granted.0', '2.granted.-1758620000', '2.granted.17586e5', '2.granted.1758620000.5', undefined]) {
      expect(parseConsentValue(raw, NOW * 1000)).toBeNull()
    }
  })

  it('shares the cookie across tripcerto.com and nowhere else', () => {
    // The same string is asserted in packages/core/src/consent/__tests__/consentCookie.test.ts in the monorepo.
    expect(cookieAttributes('www.tripcerto.com', true)).toBe('Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
    expect(cookieAttributes('tripcerto.com', true)).toBe('Path=/; Max-Age=15552000; SameSite=Lax; Domain=.tripcerto.com; Secure')
    expect(cookieAttributes('localhost', false)).toBe('Path=/; Max-Age=15552000; SameSite=Lax')
    expect(cookieAttributes('tripcerto-public.vercel.app', true)).toBe('Path=/; Max-Age=15552000; SameSite=Lax; Secure')
    expect(cookieAttributes('nottripcerto.com', true)).toBe('Path=/; Max-Age=15552000; SameSite=Lax; Secure')
  })

  it('expires a cookie with a max age of nought', () => {
    expect(cookieAttributes('www.tripcerto.com', true, 0)).toBe('Path=/; Max-Age=0; SameSite=Lax; Domain=.tripcerto.com; Secure')
  })

  it('finds one cookie among several', () => {
    expect(readCookie('a=1; tc_consent=2.granted.5; b=2', 'tc_consent')).toBe('2.granted.5')
    expect(readCookie('a=1', 'tc_consent')).toBeNull()
    expect(readCookie('xtc_consent=2.granted.5', 'tc_consent')).toBeNull()
    expect(readCookie('', 'tc_consent')).toBeNull()
  })
})

/* api/consent.ts restates the format, because a function cannot import the
   site's modules; this holds its cookie to the page's for the same inputs. */
describe('the endpoint and the page', () => {
  const request = (host: string, body: object) =>
    new Request(`https://${host}/api/consent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: `https://${host}` },
      body: JSON.stringify(body),
    })

  it.each(['www.tripcerto.com', 'tripcerto-public.vercel.app'])('set the same cookies on %s', async (host) => {
    for (const analytics of ['granted', 'denied'] satisfies ConsentDecision[]) {
      const res = await handleConsent(request(host, { analytics }), NOW * 1000)
      expect(res.headers.get('set-cookie')).toBe(`${CONSENT_COOKIE}=${formatConsentValue(analytics, NOW * 1000)}; ${cookieAttributes(host, true)}`)
    }
    const marked = await handleConsent(request(host, { team: true }), NOW * 1000)
    expect(marked.headers.get('set-cookie')).toBe(`${TEAM_COOKIE}=1; ${cookieAttributes(host, true)}`)
    const unmarked = await handleConsent(request(host, { team: false }), NOW * 1000)
    expect(unmarked.headers.get('set-cookie')).toBe(`${TEAM_COOKIE}=; ${cookieAttributes(host, true, 0)}`)
  })
})
