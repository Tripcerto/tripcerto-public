import { track } from '@vercel/analytics'
import { gaEvent } from '@/lib/ga'

/* Every event the site sends: why it exists, who owns it, where it goes and
   whether it is a conversion. The monorepo keeps the same list for chat and
   workspace (packages/core/src/lib/analyticsCatalogue.ts), and makes the
   conversions the GA property's key events. */

/* The build's name for each page (vite.config.ts), which its entry mounts
   it under. */
export type PageKey = 'home' | 'engage' | 'workspace' | 'pilot' | 'trust' | 'privacy' | 'terms'

type Destination = 'vercel' | 'ga'

interface EventSpec {
  why: string
  owner: string
  sendTo: readonly Destination[]
  conversion: boolean
}

export type EventParams = {
  page_view: { page: PageKey }
  section_view: { section: string; page: PageKey }
  demo_click: { button: 'hero' | 'close'; page: PageKey }
  contact_click: { page: PageKey }
  login_click: { place: 'nav' | 'menu' | 'footer'; page: PageKey }
}

/* Every parameter name any event sends. */
type EventParameter = { [K in keyof EventParams]: keyof EventParams[K] }[keyof EventParams]

/* `dimension`: a category GA can report on once the property registers it.
   `number`: a count, score or duration.
   `id`: one value per item, more rows than a report can show. */
type ParameterKind = 'dimension' | 'number' | 'id'

/* Every parameter, classified, as the monorepo's
   packages/core/src/lib/analyticsCatalogue.ts classifies chat's and the
   workspace's. Exhaustive by type: a new parameter does not compile until it
   is given a kind. The dimensions are registered on the property by the
   monorepo's scripts/ga/properties.mjs from its own copy of their names
   (WEBSITE_DIMENSIONS), so no category reaches GA unregistered while the two
   agree. */
export const EVENT_PARAMETERS = {
  button: 'dimension',
  page: 'dimension',
  place: 'dimension',
  section: 'dimension',
} as const satisfies { [P in EventParameter]: ParameterKind }

export const EVENTS = {
  page_view: { why: 'Which pages people land on and leave from', owner: 'Taylor', sendTo: ['ga'], conversion: false },
  section_view: { why: 'How far people read before leaving', owner: 'Taylor', sendTo: ['vercel', 'ga'], conversion: false },
  demo_click: { why: 'The conversion the website exists for', owner: 'Taylor', sendTo: ['vercel', 'ga'], conversion: true },
  contact_click: { why: 'The other way in', owner: 'Taylor', sendTo: ['vercel', 'ga'], conversion: true },
  login_click: { why: 'Keeps customers out of the prospect numbers', owner: 'Taylor', sendTo: ['vercel', 'ga'], conversion: false },
} as const satisfies { [K in keyof EventParams]: EventSpec }

/* The events a page sends itself; ga.ts sends the page view. */
type PageEvent = Exclude<keyof EventParams, 'page_view'>

let page: PageKey | null = null

/* Set once, by the entry's mount, before the page takes over its markup. */
export function enterPage(key: PageKey): void {
  page = key
}

export function currentPage(): PageKey | null {
  return page
}

/* Sends an event where the list says, with the page it happened on. A
   failed send never reaches the page. */
export function trackEvent<K extends PageEvent>(name: K, params: Omit<EventParams[K], 'page'>): void {
  if (!page) return
  const props: Record<string, string> = { ...params, page }
  const sendTo: readonly Destination[] = EVENTS[name].sendTo
  if (sendTo.includes('vercel')) {
    try {
      track(name, props)
    } catch {
      /* Analytics never blocks the page. */
    }
  }
  if (sendTo.includes('ga')) gaEvent(name, props)
}
