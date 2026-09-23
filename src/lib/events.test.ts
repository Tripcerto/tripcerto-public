import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))
vi.mock('@/lib/ga', () => ({ gaEvent: vi.fn() }))

const { track } = await import('@vercel/analytics')
const { gaEvent } = await import('@/lib/ga')
const { EVENTS, enterPage, trackEvent } = await import('./events')

/* Every source file of the page, as written: test files are left out, as
   they name what they check. */
const SOURCES = Object.entries(import.meta.glob<string>('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true })).filter(
  ([path]) => !/\.test\.tsx?$/.test(path),
)

describe('the event list', () => {
  it('says why each event exists and who owns it', () => {
    for (const spec of Object.values(EVENTS)) {
      expect(spec.why.trim()).not.toBe('')
      expect(spec.owner.trim()).not.toBe('')
      expect(spec.sendTo.length).toBeGreaterThan(0)
    }
  })

  it('counts a demo and a contact as the conversions', () => {
    // The monorepo's scripts/ga/properties.test.mjs asserts the same literal.
    const conversions = Object.entries(EVENTS)
      .filter(([, spec]) => spec.conversion)
      .map(([name]) => name)
      .sort()
    expect(conversions).toEqual(['contact_click', 'demo_click'])
  })

  it('has a call site for every event the page sends', () => {
    for (const name of Object.keys(EVENTS)) {
      if (name === 'page_view') continue
      const senders = SOURCES.filter(([, source]) => source.includes(`trackEvent('${name}'`))
      expect(senders.map(([path]) => path), name).not.toEqual([])
    }
  })

  it('leaves Google Analytics to the loader alone', () => {
    expect(SOURCES.map(([path]) => path)).toContain('/src/lib/ga.ts')
    const talking = SOURCES.filter(([path, source]) => path !== '/src/lib/ga.ts' && (source.includes('gtag(') || source.includes('dataLayer')))
    expect(talking.map(([path]) => path)).toEqual([])
  })
})

describe('trackEvent', () => {
  beforeEach(() => {
    vi.mocked(track).mockReset()
    vi.mocked(gaEvent).mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends each event where the list says, with the page it happened on', () => {
    enterPage('engage')
    trackEvent('demo_click', { button: 'hero' })
    expect(track).toHaveBeenCalledWith('demo_click', { button: 'hero', page: 'engage' })
    expect(gaEvent).toHaveBeenCalledWith('demo_click', { button: 'hero', page: 'engage' })

    enterPage('privacy')
    trackEvent('contact_click', {})
    expect(track).toHaveBeenLastCalledWith('contact_click', { page: 'privacy' })
    expect(gaEvent).toHaveBeenLastCalledWith('contact_click', { page: 'privacy' })
  })

  it('never lets a failed send reach the page', () => {
    enterPage('home')
    vi.mocked(track).mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => trackEvent('login_click', { place: 'footer' })).not.toThrow()
    expect(gaEvent).toHaveBeenCalledWith('login_click', { place: 'footer', page: 'home' })
  })
})
