import { describe, expect, it, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { App } from './App'
import { EngagePage } from './pages/EngagePage'
import { WorkspacePage } from './pages/WorkspacePage'
import { PilotPage } from './pages/PilotPage'
import { TrustPage } from './pages/TrustPage'
import { home } from '@/content/home'
import { engage } from '@/content/engage'
import { workspace } from '@/content/workspace'
import { pilot } from '@/content/pilot'
import { trust } from '@/content/trust'
import { DEMO_URL, LOGIN_URL, PAGES, SECTION } from '@/lib/links'

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

/* Every page of the site, with its h1 and the headings its copy file
   carries; the same four checks run over each. */
const SITE = [
  {
    name: 'home',
    Page: App,
    h1: home.hero['H-1-A'],
    headings: [home.opportunity['H-2-A'], home.products['H-3-A'], home.audience['H-7-A'], home.close['H-9-A']],
  },
  {
    name: 'engage',
    Page: EngagePage,
    h1: engage.hero['E-1-A'],
    headings: [
      engage.travellers['E-3-A'],
      engage.sales['E-4-A'],
      engage.business['E-5-A'],
      engage.boundaries['E-7-A'],
      engage.close['E-9-A'],
    ],
  },
  {
    name: 'workspace',
    Page: WorkspacePage,
    h1: workspace.hero['W-1-A'],
    headings: [
      workspace.trip['W-3-A'],
      workspace.systems['W-4-A'],
      workspace.boundaries['W-6-A'],
      workspace.close['W-8-A'],
    ],
  },
  {
    name: 'pilot',
    Page: PilotPage,
    h1: pilot.hero['P-1-A'],
    headings: [pilot.runs['P-2-A'], pilot.measures['P-3-A'], pilot.needs['P-4-A'], pilot.after['P-5-A'], pilot.close['P-6-A']],
  },
  {
    name: 'trust',
    Page: TrustPage,
    h1: trust.hero['T-1-A'].join(' '),
    headings: [
      trust.moves['T-2-A'],
      trust.decides['T-3-A'],
      trust.access['T-7-A'],
      trust.programme['T-4-A'],
      trust.legal['T-5-A'],
      trust.status['T-6-A'],
      trust.close['T-8-A'],
    ],
  },
] as const

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

describe.each(SITE)('$name page', ({ Page, h1, headings }) => {
  it('renders one h1 carrying the hero headline', () => {
    render(<Page />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(h1)
  })

  it('links the demo, login and page routes', () => {
    render(<Page />)
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toContain(DEMO_URL)
    expect(hrefs).toContain(LOGIN_URL)
    for (const p of [PAGES.engage, PAGES.workspace, PAGES.pilot, PAGES.trust]) expect(hrefs).toContain(p)
    expect(hrefs).toContain('/legal/privacy')
    expect(hrefs).toContain('/legal/terms')
  })

  it('renders every section heading from the copy file', () => {
    render(<Page />)
    for (const text of headings) expect(screen.getAllByText(text).length).toBeGreaterThan(0)
  })

  it('keeps banned language and imperative headlines off the page', () => {
    const { container } = render(<Page />)
    const text = container.textContent ?? ''
    for (const re of BANNED) expect(text).not.toMatch(re)
    for (const h of [h1, ...headings]) expect(h).not.toMatch(IMPERATIVE_OPENERS)
  })
})

describe('home products section', () => {
  it('is where "See how it works" lands', () => {
    render(<App />)
    const link = screen.getByRole('link', { name: home.hero['H-1-D'] })
    expect(link.getAttribute('href')).toBe(`#${SECTION.products}`)
    expect(document.getElementById(SECTION.products)).not.toBeNull()
  })

  it.each([
    { name: 'Engage', line: home.engage['H-4-A'], body: home.engage['H-4-B'], link: home.engage.link, href: PAGES.engage },
    { name: 'Workspace', line: home.workspace['H-5-A'], body: home.workspace['H-5-B'], link: home.workspace.link, href: PAGES.workspace },
  ])('gives $name a card that opens its page', ({ name, line, body, link, href }) => {
    render(<App />)
    const section = within(document.getElementById(SECTION.products)!)
    const card = within(section.getByRole('heading', { level: 3, name }).closest('article')!)
    card.getByText(line)
    card.getByText(body)
    expect(card.getByRole('link', { name: link }).getAttribute('href')).toBe(href)
  })
})
