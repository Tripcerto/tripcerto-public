import { describe, expect, it, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { App } from './App'
import { EngagePage } from './pages/EngagePage'
import { WorkspacePage } from './pages/WorkspacePage'
import { PilotPage } from './pages/PilotPage'
import { TrustPage } from './pages/TrustPage'
import { FaqPage } from './pages/FaqPage'
import { AboutPage } from './pages/AboutPage'
import { LegalPage } from './pages/LegalPage'
import privacyHtml from './content/legal/privacy.html?raw'
import termsHtml from './content/legal/terms.html?raw'
import { home } from '@/content/home'
import { engage } from '@/content/engage'
import { workspace } from '@/content/workspace'
import { pilot } from '@/content/pilot'
import { trust } from '@/content/trust'
import { faq } from '@/content/faq'
import { about, advisers, founders } from '@/content/about'
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
    headings: [
      home.products['H-3-A'],
      home.systems['H-11-A'],
      home.audience['H-7-A'],
      home.founders['H-12-A'],
      home.advisers['H-13-A'],
      home.close['H-9-A'],
    ],
  },
  {
    name: 'engage',
    Page: EngagePage,
    h1: engage.hero['E-1-A'],
    headings: [engage.sales['E-4-A'], engage.business['E-5-A'], engage.close['E-9-A']],
  },
  {
    name: 'workspace',
    Page: WorkspacePage,
    h1: workspace.hero['W-1-A'],
    headings: [workspace.trip['W-3-A'], workspace.fit['W-4-A'], workspace.close['W-8-A']],
  },
  {
    name: 'pilot',
    Page: PilotPage,
    h1: pilot.hero['P-1-A'],
    headings: [pilot.includes['P-7-A'], pilot.measures['P-3-A'], pilot.close['P-6-A']],
  },
  {
    name: 'faq',
    Page: FaqPage,
    h1: faq.hero['F-1-A'],
    headings: [...faq.groups.map((group) => group.heading), faq.close['F-7-A']],
  },
  {
    name: 'about',
    Page: AboutPage,
    h1: about.hero['A-1-A'],
    headings: [about.story['A-2-A'], about.founders['A-3-A'], about.advisers['A-6-A'], about.company['A-4-A'], about.close['A-5-A']],
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

/* A page's own entrance runs as it loads; every other animation belongs to
   a frame, and a frame plays only once it is wholly on screen (inside a
   Reveal) or stands still at its end. */
const ENTRANCE = new Set(['animate-rise', 'animate-fade-in'])
const choreographed = (el: Element) =>
  (el.getAttribute('class') ?? '')
    .split(/\s+/)
    .some((name) => (name.startsWith('animate-') && !ENTRANCE.has(name)) || name === 'text-shimmer')

describe.each(SITE)('$name page', ({ Page, h1, headings }) => {
  it('holds every frame animation until the frame is wholly on screen', () => {
    const { container } = render(<Page />)
    const loose = [...container.querySelectorAll('*')]
      .filter(choreographed)
      .filter((el) => !el.closest('.reveal, .still'))
      .map((el) => el.getAttribute('class'))
    expect(loose).toEqual([])
  })

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
    for (const p of [PAGES.engage, PAGES.workspace, PAGES.pilot, PAGES.faq, PAGES.about, PAGES.trust]) expect(hrefs).toContain(p)
    expect(hrefs).toContain('/legal/privacy')
    expect(hrefs).toContain('/legal/terms')
  })

  it('renders every section heading from the copy file', () => {
    render(<Page />)
    for (const text of headings) expect(screen.getAllByText(text).length).toBeGreaterThan(0)
  })

  it('lands every in-page link on a section of the page', () => {
    render(<Page />)
    const hashes = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('#'))
    for (const hash of hashes) expect(document.getElementById(hash.slice(1))).not.toBeNull()
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
    { name: 'Engage', line: home.engage['H-4-A'], href: PAGES.engage },
    { name: 'Workspace', line: home.workspace['H-5-A'], href: PAGES.workspace },
  ])('gives $name a tile whose name opens its page', ({ name, line, href }) => {
    render(<App />)
    const section = within(document.getElementById(SECTION.products)!)
    const product = within(section.getByRole('heading', { level: 3, name }).closest('article')!)
    product.getByText(line)
    expect(product.getByRole('link', { name }).getAttribute('href')).toBe(href)
  })
})

describe('home roles grid', () => {
  it('gives every buying role a cell with its measures', () => {
    render(<App />)
    const section = within(document.getElementById(SECTION.audience)!)
    for (const { role, measures } of home.audience.roles) {
      const cell = within(section.getByRole('heading', { level: 3, name: role }).closest('li')!)
      for (const measure of measures) cell.getByText(measure)
    }
  })
})

/* The founders and the advisers stand on the home page and on About, each
   with the role and the line, the founders with a link to their LinkedIn. */
describe.each([
  { name: 'home', Page: App },
  { name: 'about', Page: AboutPage },
])('the people on the $name page', ({ Page }) => {
  it.each([
    { group: 'founders', id: SECTION.founders, people: founders },
    { group: 'advisers', id: SECTION.advisers, people: advisers },
  ])('give each of the $group a tile with the role and the line', ({ id, people }) => {
    render(<Page />)
    const section = within(document.getElementById(id)!)
    for (const person of people) {
      const tile = within(section.getByRole('heading', { level: 3, name: person.name }).closest('li')!)
      tile.getByText(person.role)
      tile.getByText(person.line)
      if (person.linkedin) expect(tile.getByRole('link', { name: /LinkedIn/ }).getAttribute('href')).toBe(person.linkedin)
    }
  })
})

describe('home systems section', () => {
  it('names each step, what carries it, and the systems that stay', () => {
    render(<App />)
    const section = within(document.getElementById(SECTION.systems)!)
    for (const { name, owner } of home.systems.steps) {
      const step = within(section.getByRole('heading', { level: 3, name }).closest('li')!)
      step.getByText(owner)
    }
    for (const system of home.systems.systems) section.getByText(system)
  })
})

describe('faq page', () => {
  it('sets every question in its group, with its answer in the markup', () => {
    render(<FaqPage />)
    for (const group of faq.groups) {
      const section = within(document.getElementById(group.id)!)
      for (const { q, a } of group.items) {
        section.getByRole('heading', { level: 3, name: q })
        section.getByText(a)
      }
    }
  })

  it('links each answer about data to a section the Trust page has', () => {
    render(<TrustPage />)
    for (const { link } of faq.groups.flatMap((group) => group.items)) {
      if (!link?.href.startsWith(`${PAGES.trust}#`)) continue
      expect(document.getElementById(link.href.split('#')[1])).not.toBeNull()
    }
  })

  it('writes its structured data from the questions on the page', () => {
    const { container } = render(<FaqPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '{}')
    expect(data['@type']).toBe('FAQPage')
    expect(data.mainEntity.map((q: { name: string }) => q.name)).toEqual(faq.groups.flatMap((g) => g.items.map((i) => i.q)))
  })
})

/* The legal documents sit inside the site's nav and footer, so a reader
   can leave them for any page. */
describe.each([
  { name: 'privacy', html: privacyHtml, h1: 'Privacy Policy' },
  { name: 'terms', html: termsHtml, h1: 'Terms of Use' },
])('$name page', ({ html, h1 }) => {
  it('renders the document under the nav, with the footer after it', () => {
    render(<LegalPage html={html} />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent).toBe(h1)
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    for (const p of ['/', PAGES.engage, PAGES.workspace, PAGES.pilot, PAGES.faq, PAGES.about, PAGES.trust, '/legal/privacy', '/legal/terms']) expect(hrefs).toContain(p)
    expect(hrefs).toContain(LOGIN_URL)
  })
})
