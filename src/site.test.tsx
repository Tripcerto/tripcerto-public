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
   messaging foundation refuses to lead with. The intelligence layer is
   banned as the category ("the intelligence layer for travel"); the home
   page's "the intelligence layer between your customers and your experts"
   is the founders' own line, agreed on 24 Sep, and says where it sits. */
const BANNED = [
  /intelligence layer for/i,
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
      home.layer['H-11-A'].join(' '),
      home.audience['H-7-A'],
      about.team['A-3-A'],
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
    headings: [about.story['A-2-A'], about.team['A-3-A'], about.company['A-4-A'], about.close['A-5-A']],
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
    for (const text of headings) expect(screen.getAllByRole('heading', { name: text }).length).toBeGreaterThan(0)
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

/* The team stands on the home page and on About as one section: the
   founders, each with the role, the facts, the note and a link to the
   person's LinkedIn, then the board of advisers, each a name and a
   LinkedIn and nothing more. */
describe.each([
  { name: 'home', Page: App },
  { name: 'about', Page: AboutPage },
])('the team on the $name page', ({ Page }) => {
  const tiles = (group: string) => {
    render(<Page />)
    const section = within(document.getElementById(SECTION.team)!)
    const list = within(section.getByRole('heading', { level: 3, name: group }).nextElementSibling as HTMLElement)
    return (name: string) => within(list.getByRole('heading', { level: 4, name }).closest('li')!)
  }

  it('gives each founder a tile with the role, the facts and the note', () => {
    const tile = tiles(about.team['A-3-B'])
    for (const person of founders) {
      const t = tile(person.name)
      t.getByText(person.role)
      for (const { figure, label } of person.facts) {
        t.getByText(figure)
        t.getByText(label)
      }
      t.getByText(person.note)
      if (person.linkedin) expect(t.getByRole('link', { name: /LinkedIn/ }).getAttribute('href')).toBe(person.linkedin)
    }
  })

  it('gives each adviser a tile with the name and the LinkedIn alone', () => {
    const tile = tiles(about.team['A-3-C'])
    for (const person of advisers) {
      const t = tile(person.name)
      expect(t.getByRole('link', { name: /LinkedIn/ }).getAttribute('href')).toBe(person.linkedin)
      expect(t.getAllByText(/./).map((el) => el.textContent)).toEqual([person.name, `LinkedIn: ${person.name} (opens in a new tab)`, `: ${person.name} (opens in a new tab)`])
    }
  })
})

/* The About story's timeline: each year a heading, in order, with its
   line; and each line written to fill two lines of the timeline's measure,
   so the entries above and below the rail stand level. The length is the
   proxy jsdom can check for the rendered width: measured in Chrome, lines
   of 42 to 63 characters set in two lines at every measure from 232px to
   275px, and the timeline's is 248px. */
describe('the About timeline', () => {
  it('gives each year its line, in order', () => {
    render(<AboutPage />)
    const story = within(document.getElementById('why-tripcerto')!)
    expect(story.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(about.story.timeline.map((m) => m.year))
    for (const { line } of about.story.timeline) story.getByText(line)
  })

  it('writes every line to fill two lines of the measure', () => {
    for (const { line } of about.story.timeline) {
      expect(line.length, line).toBeGreaterThanOrEqual(40)
      expect(line.length, line).toBeLessThanOrEqual(64)
    }
  })
})

describe('home layer section', () => {
  it('sets Tripcerto between the customers and the experts, with a product for each side, on the business\'s own data', () => {
    render(<App />)
    const section = within(document.getElementById(SECTION.layer)!)
    const { customers, products, experts, data } = home.layer
    const names = section.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names).toEqual([customers.name, 'Tripcerto', experts.name])
    for (const side of [customers, experts]) section.getByText(side.line)
    for (const { name, line } of products) {
      within(section.getByRole('heading', { level: 4, name }).closest('li')!).getByText(line)
    }
    section.getByText(data)
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
