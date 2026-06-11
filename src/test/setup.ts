import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// jsdom has no matchMedia — animations read prefers-reduced-motion.
if (!window.matchMedia) {
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
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
