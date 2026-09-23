import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// The stand-ins below are for jsdom. A file that opts into the node
// environment (the server render test) has no window at all, and keeps it
// that way so a stray browser read during render fails.
const browser = typeof window !== 'undefined'

// jsdom has no matchMedia — animations read prefers-reduced-motion.
if (browser && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// jsdom has no IntersectionObserver. Auto-fire as intersecting on observe so
// `.reveal` content is present and useReveal adds `.in` deterministically.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  private cb: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb
  }
  observe = (el: Element) => {
    this.cb(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      this,
    )
  }
  unobserve = () => {}
  disconnect = () => {}
  takeRecords = () => []
}
if (browser) vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// jsdom has no ResizeObserver, which the consent bar measures itself with,
// and lays nothing out, so there is never a resize to report.
class MockResizeObserver implements ResizeObserver {
  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
}
if (browser) vi.stubGlobal('ResizeObserver', MockResizeObserver)
