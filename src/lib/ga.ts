import { pageAddress, stripAddress } from '@/lib/address'
import type { PageKey } from '@/lib/events'

/* The only module that talks to Google Analytics: src/lib/events.test.ts
   fails on a `gtag(` or a `dataLayer` anywhere else. It loads gtag.js once,
   only on our own hosts and only after a visitor says yes (Measurement), and
   sends page views itself, as origin and path, because GA's own would carry
   the query string. Events reach it through trackEvent (events.ts). The
   monorepo's packages/core/src/lib/googleAnalytics.ts does the same for chat
   and workspace, into the same property. */

type GtagArgs =
  | [command: 'js', date: Date]
  | [command: 'consent', mode: 'default', params: Record<string, 'granted' | 'denied'>]
  | [command: 'config', targetId: string, params: Record<string, unknown>]
  | [command: 'set', params: Record<string, unknown>]
  | [command: 'event', name: string, params: Record<string, string>]

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/* Tripcerto's GA4 property (555458356), shared by the website, chat and
   workspace. */
export const GA_ID = 'G-3Y54L9Y33Y'

/* GA loads on these hosts only, the same four as chat and workspace, unless
   VITE_GA_DEBUG=1. */
const GA_HOSTS: readonly string[] = ['www.tripcerto.com', 'tripcerto.com', 'chat.tripcerto.com', 'workspace.tripcerto.com']

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js'

/* Thirteen months, the longest the ICO's guidance treats as proportionate
   for an analytics cookie. */
const COOKIE_EXPIRES_SECONDS = 33696000

/* `phone` below 640px, `tablet` below 1024px, else `desktop`: the site's
   sm and lg breakpoints, and the monorepo's phone and shell ones. */
export type Layout = 'phone' | 'tablet' | 'desktop'

let loaded = false
let lastPageAddress: string | null = null
/* What every event carries while GA runs: GA4 sends no parameter of our own
   given in `set` or `config`, only what rides the event itself. */
let stamp: { app_surface: 'website'; layout: Layout } | null = null

const debugging = () => import.meta.env.VITE_GA_DEBUG === '1'

/* Pushes the raw arguments object, as Google's snippet does: gtag.js reads
   its queue by that shape and ignores a plain array. */
function gtag(...args: GtagArgs): void
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

export function mayMeasureHere(hostname: string): boolean {
  return GA_HOSTS.includes(hostname) || debugging()
}

/* Starts GA, or starts it again after a withdrawal, without a second
   script. Does nothing off our hosts. */
export function initGoogleAnalytics({ layout }: { layout: Layout }): void {
  if (!mayMeasureHere(window.location.hostname) || stamp) return

  if (!loaded) {
    loaded = true
    window.dataLayer = window.dataLayer ?? []
    const script = document.createElement('script')
    script.async = true
    script.src = `${GTAG_SRC}?id=${GA_ID}`
    document.head.appendChild(script)
    gtag('js', new Date())
    /* gtag.js is fetched only after a yes, so analytics storage is granted
       by the time it runs; every advertising purpose is denied outright. */
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    })
  }

  Reflect.set(window, `ga-disable-${GA_ID}`, false)
  /* The address rides `set`, not `config`: a config parameter outranks a
     set one, so an address in config would pin every later event to it. */
  gtag('set', { page_location: pageAddress(), page_referrer: stripAddress(document.referrer) })
  gtag('config', GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: COOKIE_EXPIRES_SECONDS,
    ...(debugging() && { debug_mode: true }),
  })
  stamp = { app_surface: 'website', layout }
}

/* Stamped on every later event, so a phone and a desktop visit stay apart
   after a resize. */
export function setAnalyticsLayout(layout: Layout): void {
  if (stamp) stamp = { ...stamp, layout }
}

/* One page view per address, as origin and path. */
export function sendPageView(page: PageKey): void {
  if (!stamp) return
  const address = pageAddress()
  if (address === lastPageAddress) return
  lastPageAddress = address
  gtag('event', 'page_view', { page_location: address, page, ...stamp })
}

export function gaEvent(name: string, params: Record<string, string>): void {
  if (stamp) gtag('event', name, { ...params, ...stamp })
}

/* `.www.tripcerto.com`, `.tripcerto.com` and `.com`: GA writes its cookies
   on the widest of these that takes them. */
function parentDomains(hostname: string): string[] {
  const labels = hostname.split('.')
  return labels.slice(0, -1).map((_, i) => `.${labels.slice(i).join('.')}`)
}

/* A withdrawal: GA stops sending from this page and its cookies go. gtag.js
   cannot be unloaded, so the property is switched off by Google's own
   switch, and `_ga` and `_ga_<id>` are expired on the host and on every
   domain above it. */
export function stopGoogleAnalytics(): void {
  Reflect.set(window, `ga-disable-${GA_ID}`, true)
  stamp = null
  lastPageAddress = null
  const names = new Set(
    document.cookie
      .split(';')
      .map((pair) => pair.trim().split('=')[0])
      .filter((name) => name === '_ga' || name.startsWith('_ga_')),
  )
  const domains = parentDomains(window.location.hostname)
  for (const name of names) {
    document.cookie = `${name}=; Path=/; Max-Age=0`
    for (const domain of domains) document.cookie = `${name}=; Path=/; Max-Age=0; Domain=${domain}`
  }
}
