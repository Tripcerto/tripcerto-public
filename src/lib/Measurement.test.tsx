import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import type { BeforeSend } from '@vercel/analytics/react'

const vercel = vi.hoisted(() => ({ beforeSend: null as BeforeSend | null }))

vi.mock('@vercel/analytics/react', () => ({
  Analytics: ({ beforeSend }: { beforeSend: BeforeSend }) => {
    vercel.beforeSend = beforeSend
    return null
  },
}))
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))
vi.mock('@/lib/ga', () => ({
  gaEvent: vi.fn(),
  initGoogleAnalytics: vi.fn(),
  sendPageView: vi.fn(),
  setAnalyticsLayout: vi.fn(),
  stopGoogleAnalytics: vi.fn(),
}))

/* The consent store reads the cookie once per page, so each test loads the
   page's modules afresh, as a new page would, one at a time: mocked modules
   loaded side by side can each get their own copy. */
async function load() {
  vi.resetModules()
  const { track } = await import('@vercel/analytics')
  const ga = await import('@/lib/ga')
  const events = await import('@/lib/events')
  const consent = await import('@/lib/consent')
  const { Measurement } = await import('./Measurement')
  events.enterPage('pilot')
  return { Measurement, consent, ga, track }
}

const now = () => Math.floor(Date.now() / 1000)

function clearCookies() {
  for (const name of ['tc_consent', 'tc_team']) document.cookie = `${name}=; Path=/; Max-Age=0`
}

/* A matchMedia whose answers follow a width the test sets, and whose
   queries report each change of it. */
function screenWidth(start: number) {
  let width = start
  const queries: MediaQuery[] = []
  class MediaQuery extends EventTarget implements MediaQueryList {
    readonly media: string
    onchange = null
    constructor(media: string) {
      super()
      this.media = media
      queries.push(this)
    }
    get matches() {
      return width >= Number(this.media.match(/min-width: (\d+)px/)?.[1] ?? Infinity)
    }
    addListener() {}
    removeListener() {}
  }
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => new MediaQuery(query))
  return (next: number) => {
    width = next
    for (const query of queries) query.dispatchEvent(new Event('change'))
  }
}

beforeEach(() => {
  clearCookies()
  vercel.beforeSend = null
  history.replaceState(null, '', '/pilot')
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
})

afterEach(() => {
  clearCookies()
  vi.restoreAllMocks()
})

describe('Vercel Web Analytics', () => {
  it('records every visitor, by origin, path and campaign tags only', async () => {
    const { Measurement } = await load()
    render(<Measurement />)
    expect(vercel.beforeSend?.({ type: 'pageview', url: 'https://www.tripcerto.com/pilot?utm_source=x&ref=abc#top' })).toEqual({
      type: 'pageview',
      url: 'https://www.tripcerto.com/pilot?utm_source=x',
    })
  })

  it('records nothing from our own browsers', async () => {
    document.cookie = 'tc_team=1; Path=/'
    const { Measurement } = await load()
    render(<Measurement />)
    expect(vercel.beforeSend?.({ type: 'event', url: 'https://www.tripcerto.com/pilot' })).toBeNull()
  })
})

describe('?team', () => {
  it('marks this browser as ours and takes the parameter off the address', async () => {
    history.replaceState(null, '', '/pilot?team&utm_source=x#top')
    const { Measurement, consent } = await load()
    render(<Measurement />)
    expect(consent.isTeamBrowser()).toBe(true)
    expect(`${location.pathname}${location.search}${location.hash}`).toBe('/pilot?utm_source=x#top')
  })

  it('unmarks it with ?team=off', async () => {
    document.cookie = 'tc_team=1; Path=/'
    history.replaceState(null, '', '/pilot?team=off')
    const { Measurement, consent } = await load()
    render(<Measurement />)
    expect(consent.isTeamBrowser()).toBe(false)
    expect(`${location.pathname}${location.search}`).toBe('/pilot')
  })
})

describe('Google Analytics', () => {
  it('waits for an answer', async () => {
    const { Measurement, ga } = await load()
    render(<Measurement />)
    expect(ga.initGoogleAnalytics).not.toHaveBeenCalled()
    expect(ga.sendPageView).not.toHaveBeenCalled()
  })

  it('starts on a yes given earlier, and sends the page', async () => {
    document.cookie = `tc_consent=2.granted.${now()}; Path=/`
    screenWidth(800)
    const { Measurement, ga } = await load()
    render(<Measurement />)
    expect(ga.initGoogleAnalytics).toHaveBeenCalledWith({ layout: 'tablet' })
    expect(ga.sendPageView).toHaveBeenCalledWith('pilot')
  })

  it('starts on Accept, and stops and clears its cookies on a later Reject', async () => {
    const { Measurement, consent, ga } = await load()
    render(<Measurement />)
    act(() => consent.saveConsent('granted'))
    expect(ga.initGoogleAnalytics).toHaveBeenCalledTimes(1)
    expect(ga.sendPageView).toHaveBeenCalledWith('pilot')
    act(() => consent.saveConsent('denied'))
    expect(ga.stopGoogleAnalytics).toHaveBeenCalled()
  })

  it('never starts in our own browsers', async () => {
    document.cookie = `tc_consent=2.granted.${now()}; Path=/`
    history.replaceState(null, '', '/pilot?team')
    const { Measurement, ga } = await load()
    render(<Measurement />)
    expect(ga.initGoogleAnalytics).not.toHaveBeenCalled()
    expect(ga.stopGoogleAnalytics).toHaveBeenCalled()
  })

  it('keeps the layout current as the window changes', async () => {
    document.cookie = `tc_consent=2.granted.${now()}; Path=/`
    const resize = screenWidth(1280)
    const { Measurement, ga } = await load()
    render(<Measurement />)
    expect(ga.initGoogleAnalytics).toHaveBeenCalledWith({ layout: 'desktop' })
    act(() => resize(375))
    expect(ga.setAnalyticsLayout).toHaveBeenLastCalledWith('phone')
    act(() => resize(639))
    expect(ga.setAnalyticsLayout).toHaveBeenLastCalledWith('phone')
    act(() => resize(640))
    expect(ga.setAnalyticsLayout).toHaveBeenLastCalledWith('tablet')
    act(() => resize(1024))
    expect(ga.setAnalyticsLayout).toHaveBeenLastCalledWith('desktop')
  })
})

describe('section views', () => {
  it('reports each section once, when its top reaches the middle of the screen', async () => {
    const options: IntersectionObserverInit[] = []
    const observed: Element[] = []
    let report: (entries: IntersectionObserverEntry[]) => void = () => {}
    vi.spyOn(window, 'IntersectionObserver').mockImplementation(
      class implements IntersectionObserver {
        readonly root = null
        readonly rootMargin = ''
        readonly thresholds = []
        constructor(callback: IntersectionObserverCallback, init: IntersectionObserverInit = {}) {
          report = (entries) => callback(entries, this)
          options.push(init)
        }
        observe(el: Element) {
          observed.push(el)
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return []
        }
      },
    )
    const { Measurement, track } = await load()
    render(
      <>
        <main>
          <section id="hero" />
          <section id="measures" />
        </main>
        <Measurement />
      </>,
    )
    expect(options).toEqual([{ threshold: 0, rootMargin: '0px 0px -50% 0px' }])
    const seen = (target: Element) => ({ isIntersecting: true, target }) as IntersectionObserverEntry
    act(() => report([seen(observed[1]), seen(observed[1])]))
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('section_view', { section: 'measures', page: 'pilot' })
  })
})
