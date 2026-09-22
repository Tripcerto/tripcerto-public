import { describe, expect, it, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'
import { home } from '@/content/home'
import { DEMO_URL, LOGIN_URL, PAGES } from '@/lib/links'

/* Language Charlie's guide bans from headlines, and the category phrases the
   messaging foundation refuses to lead with. */
const BANNED = [
  /intelligence layer/i,
  /seamless/i,
  /AI-powered/i,
  /chatbot/i,
  /orchestrat/i,
  /unlock/i,
  /transform travel/i,
  /end-to-end/i,
]
const IMPERATIVE_OPENERS = /^(turn|answer|use|let|add|recommend|pass|choose|run)\b/i

beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', { value: IO, writable: true })
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }),
  })
})

describe('home page', () => {
  it('renders one h1 carrying the hero headline', () => {
    render(<App />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(home.hero['H-1-A'])
  })

  it('links the demo, login and page routes', () => {
    render(<App />)
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toContain(DEMO_URL)
    expect(hrefs).toContain(LOGIN_URL)
    for (const p of [PAGES.engage, PAGES.workspace, PAGES.pilot, PAGES.trust]) expect(hrefs).toContain(p)
    expect(hrefs).toContain('/legal/privacy/')
    expect(hrefs).toContain('/legal/terms/')
  })

  it('renders every section heading from the copy file', () => {
    render(<App />)
    for (const text of [
      home.opportunity['H-2-A'],
      home.engage['H-4-A'],
      home.workspace['H-5-A'],
      home.audience['H-7-A'],
      home.close['H-9-A'],
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0)
    }
  })

  it('keeps banned language and imperative headlines off the page', () => {
    const { container } = render(<App />)
    const text = container.textContent ?? ''
    for (const re of BANNED) expect(text).not.toMatch(re)
    const headlines = [
      home.hero['H-1-A'],
      home.opportunity['H-2-A'],
      home.engage['H-4-A'],
      home.workspace['H-5-A'],
      home.audience['H-7-A'],
      home.close['H-9-A'],
    ]
    for (const h of headlines) expect(h).not.toMatch(IMPERATIVE_OPENERS)
  })
})
