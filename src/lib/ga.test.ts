import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const GA_ID = 'G-3Y54L9Y33Y'

const ORIGINAL_LOCATION = Object.getOwnPropertyDescriptor(window, 'location')!
const ORIGINAL_REFERRER = Object.getOwnPropertyDescriptor(Document.prototype, 'referrer')!

function visit(href: string) {
  Object.defineProperty(window, 'location', { value: new URL(href), configurable: true, writable: true })
}

/* gtag.js reads its queue as `arguments` objects; read them back as arrays. */
function queued(): unknown[][] {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>))
}

const scripts = () => document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')

/* The loader keeps what it has loaded for the life of the page, so each test
   loads it afresh, as a new page would. */
async function load() {
  vi.resetModules()
  return await import('./ga')
}

const CONFIG = {
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  cookie_expires: 33696000,
}

beforeEach(() => {
  document.head.innerHTML = ''
  delete window.dataLayer
  visit('https://www.tripcerto.com/engage?utm_source=x#top')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  Object.defineProperty(window, 'location', ORIGINAL_LOCATION)
  Object.defineProperty(Document.prototype, 'referrer', ORIGINAL_REFERRER)
  Reflect.deleteProperty(window, `ga-disable-${GA_ID}`)
})

describe('mayMeasureHere', () => {
  it('measures on tripcerto.com, chat and workspace, and nowhere else', async () => {
    const { mayMeasureHere } = await load()
    for (const host of ['www.tripcerto.com', 'tripcerto.com', 'chat.tripcerto.com', 'workspace.tripcerto.com']) expect(mayMeasureHere(host)).toBe(true)
    for (const host of ['localhost', 'tripcerto-public.vercel.app', 'admin.tripcerto.com', 'nottripcerto.com', 'www.tripcerto.com.evil.example']) {
      expect(mayMeasureHere(host)).toBe(false)
    }
  })

  it('measures anywhere with VITE_GA_DEBUG=1', async () => {
    vi.stubEnv('VITE_GA_DEBUG', '1')
    const { mayMeasureHere } = await load()
    expect(mayMeasureHere('localhost')).toBe(true)
  })
})

describe('initGoogleAnalytics', () => {
  it('does nothing at all off our hosts', async () => {
    visit('http://localhost:5173/engage')
    const { initGoogleAnalytics, sendPageView, gaEvent } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    sendPageView('engage')
    gaEvent('demo_click', { button: 'hero', page: 'engage' })
    expect(scripts()).toHaveLength(0)
    expect(window.dataLayer).toBeUndefined()
  })

  it('loads gtag.js once, then queues consent, the address and the config, in that order', async () => {
    const { initGoogleAnalytics } = await load()
    initGoogleAnalytics({ layout: 'tablet' })
    initGoogleAnalytics({ layout: 'tablet' })

    expect(scripts()).toHaveLength(1)
    expect(scripts()[0].getAttribute('src')).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)

    const queue = queued()
    expect(queue.map((entry) => entry[0])).toEqual(['js', 'consent', 'set', 'config'])
    expect(queue[0][1]).toBeInstanceOf(Date)
    expect(queue[1]).toEqual(['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' }])
    expect(queue[2]).toEqual(['set', { page_location: 'https://www.tripcerto.com/engage?utm_source=x', page_referrer: '' }])
    expect(queue[3]).toEqual(['config', GA_ID, CONFIG])
  })

  /* GA4 takes the address from `set`, but sends no parameter of our own
     given there or in a config, so the surface and the layout ride every
     event. */
  it('keeps our own parameters out of set and config', async () => {
    const { initGoogleAnalytics } = await load()
    initGoogleAnalytics({ layout: 'tablet' })
    for (const [command, ...rest] of queued().filter((entry) => entry[0] === 'set' || entry[0] === 'config')) {
      const params = rest.at(-1)
      expect(params, String(command)).not.toHaveProperty('app_surface')
      expect(params, String(command)).not.toHaveProperty('layout')
    }
  })

  it('strips the referrer to its origin, path and campaign tags', async () => {
    Object.defineProperty(Document.prototype, 'referrer', {
      get: () => 'https://www.google.com/search?q=tripcerto&utm_medium=email#x',
      configurable: true,
    })
    const { initGoogleAnalytics } = await load()
    initGoogleAnalytics({ layout: 'phone' })
    const set = queued().find((entry) => entry[0] === 'set')
    expect(set?.[1]).toMatchObject({ page_referrer: 'https://www.google.com/search?utm_medium=email' })
  })

  it('sends to DebugView with VITE_GA_DEBUG=1', async () => {
    vi.stubEnv('VITE_GA_DEBUG', '1')
    visit('http://localhost:5173/')
    const { initGoogleAnalytics } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    expect(queued().find((entry) => entry[0] === 'config')).toEqual(['config', GA_ID, { ...CONFIG, debug_mode: true }])
  })
})

describe('sendPageView', () => {
  it('sends the page with its campaign tags and nothing else from the query, once per page', async () => {
    visit('https://www.tripcerto.com/engage?utm_source=li&ref=abc&utm_campaign=launch#top')
    const { initGoogleAnalytics, sendPageView } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    sendPageView('engage')
    sendPageView('engage')
    visit('https://www.tripcerto.com/engage?utm_source=email')
    sendPageView('engage')
    const views = queued().filter((entry) => entry[0] === 'event' && entry[1] === 'page_view')
    expect(views).toEqual([
      ['event', 'page_view', { page_location: 'https://www.tripcerto.com/engage?utm_source=li&utm_campaign=launch', page: 'engage', app_surface: 'website', layout: 'desktop' }],
    ])
  })

  it('sends nothing before GA is running', async () => {
    const { sendPageView } = await load()
    sendPageView('home')
    expect(window.dataLayer).toBeUndefined()
  })
})

describe('setAnalyticsLayout', () => {
  it('stamps the new layout on every later event', async () => {
    const { initGoogleAnalytics, setAnalyticsLayout, gaEvent } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    setAnalyticsLayout('phone')
    gaEvent('section_view', { section: 'hero', page: 'home' })
    expect(queued().at(-1)).toEqual(['event', 'section_view', { section: 'hero', page: 'home', app_surface: 'website', layout: 'phone' }])
  })
})

describe('stopGoogleAnalytics', () => {
  it('switches the property off and expires every GA cookie on the host and on .tripcerto.com', async () => {
    const { initGoogleAnalytics, stopGoogleAnalytics, gaEvent } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('_ga=GA1.1.1.2; tc_consent=2.denied.5; _ga_3Y54L9Y33Y=GS2.1.s1')
    const written: string[] = []
    vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
      written.push(value)
    })

    stopGoogleAnalytics()

    expect(Reflect.get(window, `ga-disable-${GA_ID}`)).toBe(true)
    for (const name of ['_ga', '_ga_3Y54L9Y33Y']) {
      expect(written).toContain(`${name}=; Path=/; Max-Age=0`)
      expect(written).toContain(`${name}=; Path=/; Max-Age=0; Domain=.tripcerto.com`)
    }
    expect(written.some((value) => value.startsWith('tc_consent='))).toBe(false)

    const before = queued().length
    gaEvent('demo_click', { button: 'close', page: 'engage' })
    expect(queued()).toHaveLength(before)
  })

  it('starts again after a new yes, with the same script', async () => {
    const { initGoogleAnalytics, sendPageView, stopGoogleAnalytics } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    sendPageView('home')
    stopGoogleAnalytics()
    initGoogleAnalytics({ layout: 'desktop' })
    sendPageView('home')
    expect(scripts()).toHaveLength(1)
    expect(Reflect.get(window, `ga-disable-${GA_ID}`)).toBe(false)
    expect(queued().filter((entry) => entry[1] === 'page_view')).toHaveLength(2)
  })
})

describe('gaEvent', () => {
  it('queues an event once GA is running, with the surface and the layout', async () => {
    const { initGoogleAnalytics, gaEvent } = await load()
    initGoogleAnalytics({ layout: 'desktop' })
    gaEvent('login_click', { place: 'nav', page: 'home' })
    expect(queued().at(-1)).toEqual(['event', 'login_click', { place: 'nav', page: 'home', app_surface: 'website', layout: 'desktop' }])
  })
})
