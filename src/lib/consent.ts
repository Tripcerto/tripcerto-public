import { useSyncExternalStore } from 'react'

export type ConsentDecision = 'granted' | 'denied'

/* The visitor's answer on analytics, kept on .tripcerto.com so an answer
   given on one tripcerto.com host holds on all of them. Its value is
   `<policy version>.<answer>.<seconds when decided>`, and a new policy
   version asks everyone again. api/consent.ts sets the same cookie from the
   server, so Safari keeps it for its full age rather than a week. */
export const CONSENT_COOKIE = 'tc_consent'
/* Marks our own browsers, which Google Analytics never loads in. */
export const TEAM_COOKIE = 'tc_team'
export const CONSENT_POLICY_VERSION = 2
export const CONSENT_MAX_AGE_SECONDS = 15552000
/* How far ahead of the device's clock an answer's date may sit: the server
   dates it by its own clock, and a device running behind reads a fresh answer
   as a little in the future. Anything further ahead would never reach six
   months, and reads as no answer. */
export const CONSENT_CLOCK_SKEW_SECONDS = 86400

const ENDPOINT = '/api/consent'
const SHARED_DOMAIN = 'tripcerto.com'

export function formatConsentValue(analytics: ConsentDecision, decidedAt: number): string {
  return `${CONSENT_POLICY_VERSION}.${analytics}.${Math.floor(decidedAt / 1000)}`
}

/* The answer a cookie value records, or null when there is none to go on:
   another policy version, an answer older than the cookie may live or dated
   further ahead than a slow clock explains, or anything that is not the
   format above. */
export function parseConsentValue(raw: string | null | undefined, now: number): ConsentDecision | null {
  const parts = raw?.split('.') ?? []
  if (parts.length !== 3) return null
  const [version, answer, seconds] = parts
  if (version !== String(CONSENT_POLICY_VERSION)) return null
  if (answer !== 'granted' && answer !== 'denied') return null
  if (!/^[1-9]\d*$/.test(seconds)) return null
  const decidedAt = Number(seconds) * 1000
  if (decidedAt - now > CONSENT_CLOCK_SKEW_SECONDS * 1000) return null
  if (now - decidedAt > CONSENT_MAX_AGE_SECONDS * 1000) return null
  return answer
}

/* Shared with every tripcerto.com host, host-only anywhere else (a Vercel
   preview, localhost), and Secure wherever the page is. */
export function cookieAttributes(hostname: string, secure: boolean, maxAge: number = CONSENT_MAX_AGE_SECONDS): string {
  const shared = hostname === SHARED_DOMAIN || hostname.endsWith(`.${SHARED_DOMAIN}`)
  return `Path=/; Max-Age=${maxAge}; SameSite=Lax${shared ? `; Domain=.${SHARED_DOMAIN}` : ''}${secure ? '; Secure' : ''}`
}

export function readCookie(cookieHeader: string, name: string): string | null {
  for (const pair of cookieHeader.split(';')) {
    const equals = pair.indexOf('=')
    if (equals !== -1 && pair.slice(0, equals).trim() === name) return pair.slice(equals + 1).trim()
  }
  return null
}

export function readConsent(): ConsentDecision | null {
  if (typeof document === 'undefined') return null
  return parseConsentValue(readCookie(document.cookie, CONSENT_COOKIE), Date.now())
}

export function isTeamBrowser(): boolean {
  return typeof document !== 'undefined' && readCookie(document.cookie, TEAM_COOKIE) === '1'
}

function writeCookie(name: string, value: string, maxAge?: number) {
  document.cookie = `${name}=${value}; ${cookieAttributes(location.hostname, location.protocol === 'https:', maxAge)}`
}

/* The page writes the cookie itself so the answer holds at once, then asks
   the host to set it again from the server. A failed request leaves the
   page's own cookie standing. */
function post(body: { analytics: ConsentDecision } | { team: boolean }) {
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}

interface ConsentState {
  analytics: ConsentDecision | null
  asking: boolean
}

/* The build renders no bar and reads no cookie: it has no visitor. */
const SERVER_STATE: ConsentState = { analytics: null, asking: false }

function serverState(): ConsentState {
  return SERVER_STATE
}

/* The answer is read from the cookie once, when the page first asks for it,
   and from then on the page holds it: an answer given here stands for this
   page even where the browser refuses the cookie. */
let state: ConsentState | null = null
const listeners = new Set<() => void>()

function clientState(): ConsentState {
  if (!state) {
    const analytics = readConsent()
    state = { analytics, asking: analytics === null }
  }
  return state
}

function setState(next: ConsentState) {
  state = next
  for (const listener of listeners) listener()
}

/* A page the back-forward cache restores, or a tab coming back into view,
   takes up an answer given on another page since it was last shown. No
   cookie is not news: the cookie may simply be refused. */
function subscribe(listener: () => void) {
  const sync = () => {
    const analytics = readConsent()
    if (analytics !== null && analytics !== clientState().analytics) setState({ analytics, asking: false })
  }
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) sync()
  }
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') sync()
  }
  listeners.add(listener)
  window.addEventListener('pageshow', onPageShow)
  document.addEventListener('visibilitychange', onVisibilityChange)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('pageshow', onPageShow)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
}

export function saveConsent(analytics: ConsentDecision): void {
  writeCookie(CONSENT_COOKIE, formatConsentValue(analytics, Date.now()))
  setState({ analytics, asking: false })
  post({ analytics })
}

export function markTeamBrowser(on: boolean): void {
  if (on) writeCookie(TEAM_COOKIE, '1')
  else writeCookie(TEAM_COOKIE, '', 0)
  post({ team: on })
}

function reopen() {
  setState({ ...clientState(), asking: true })
}

export function useConsent(): { analytics: ConsentDecision | null; asking: boolean; decide(a: ConsentDecision): void; reopen(): void } {
  const { analytics, asking } = useSyncExternalStore(subscribe, clientState, serverState)
  return { analytics, asking, decide: saveConsent, reopen }
}
