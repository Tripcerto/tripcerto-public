import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

vi.mock('@/lib/events', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/events')>()), trackEvent: vi.fn() }))

/* The consent store reads the cookie once per page, so each test loads the
   page's modules afresh, as a new page would. The mocked event list loads
   first: loaded alongside the components, they can each get their own. */
async function load() {
  vi.resetModules()
  const { trackEvent } = await import('@/lib/events')
  const [{ Hero }, { PageHero }, { Close }, { Nav }, { Footer }, { ConsentBar }, links] = await Promise.all([
    import('./Hero'),
    import('./PageHero'),
    import('./Close'),
    import('./Nav'),
    import('./Footer'),
    import('./ConsentBar'),
    import('@/lib/links'),
  ])
  return { Hero, PageHero, Close, Nav, Footer, ConsentBar, trackEvent: vi.mocked(trackEvent), ...links }
}

/* jsdom cannot follow a link; the click is all these tests need. */
const stay = (event: MouseEvent) => event.preventDefault()

const bar = () => screen.queryByRole('region', { name: 'Analytics permission' })

beforeEach(() => {
  document.addEventListener('click', stay)
  document.cookie = `tc_consent=2.granted.${Math.floor(Date.now() / 1000)}; Path=/`
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
})

afterEach(() => {
  document.removeEventListener('click', stay)
  document.cookie = 'tc_consent=; Path=/; Max-Age=0'
  vi.restoreAllMocks()
})

describe('the demo buttons', () => {
  it('count the hero and the close apart', async () => {
    const { Hero, Close, DEMO_URL, trackEvent } = await load()
    render(
      <>
        <Hero />
        <Close heading="Close" primary={{ label: 'Book a close demo', href: DEMO_URL }} />
      </>,
    )
    const demos = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === DEMO_URL)
    expect(demos).toHaveLength(2)
    fireEvent.click(demos[0])
    expect(trackEvent).toHaveBeenLastCalledWith('demo_click', { button: 'hero' })
    fireEvent.click(demos[1])
    expect(trackEvent).toHaveBeenLastCalledWith('demo_click', { button: 'close' })
    expect(trackEvent).toHaveBeenCalledTimes(2)
  })

  it('count a page opening as the hero, and nothing else as a demo', async () => {
    const { PageHero, Close, DEMO_URL, PAGES, trackEvent } = await load()
    render(
      <>
        <PageHero title="Title" lede="Lede" primary={{ label: 'Book a demo', href: DEMO_URL }} secondary={{ label: 'See the pilot', href: PAGES.pilot }} />
        <Close heading="Close" primary={{ label: 'Read on', href: PAGES.trust }} secondary={{ label: 'Pilot', href: PAGES.pilot }} />
      </>,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Book a demo' }))
    expect(trackEvent).toHaveBeenCalledWith('demo_click', { button: 'hero' })
    for (const name of ['See the pilot', 'Read on', 'Pilot']) fireEvent.click(screen.getByRole('link', { name }))
    expect(trackEvent).toHaveBeenCalledTimes(1)
  })
})

describe('the nav', () => {
  it('counts Login in the bar and in the phone menu apart', async () => {
    const { Nav, LOGIN_URL, trackEvent } = await load()
    render(<Nav />)
    const logins = screen.getAllByRole('link', { name: 'Login' })
    expect(logins.map((a) => a.getAttribute('href'))).toEqual([LOGIN_URL, LOGIN_URL])
    fireEvent.click(logins[0])
    expect(trackEvent).toHaveBeenLastCalledWith('login_click', { place: 'nav' })
    fireEvent.click(logins[1])
    expect(trackEvent).toHaveBeenLastCalledWith('login_click', { place: 'menu' })
    fireEvent.click(screen.getAllByRole('link', { name: 'Engage' })[1])
    expect(trackEvent).toHaveBeenCalledTimes(2)
  })

  it('ends the phone menu with Cookie settings, which closes the menu and asks again', async () => {
    const { Nav, ConsentBar } = await load()
    render(
      <>
        <Nav />
        <ConsentBar />
      </>,
    )
    expect(bar()).toBeNull()
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(toggle)
    const menu = document.getElementById('site-menu')!
    expect([...menu.querySelectorAll('a, button')].at(-1)?.textContent).toBe('Cookie settings')
    fireEvent.click(within(menu).getByRole('button', { name: 'Cookie settings' }))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(bar()).not.toBeNull()
  })
})

describe('the footer', () => {
  it('counts Login and the email address', async () => {
    const { Footer, CONTACT_EMAIL, trackEvent } = await load()
    render(<Footer />)
    fireEvent.click(screen.getByRole('link', { name: 'Login' }))
    expect(trackEvent).toHaveBeenLastCalledWith('login_click', { place: 'footer' })
    fireEvent.click(screen.getByRole('link', { name: CONTACT_EMAIL }))
    expect(trackEvent).toHaveBeenLastCalledWith('contact_click', {})
    for (const name of ['Engage', 'Status', 'Privacy']) fireEvent.click(screen.getByRole('link', { name }))
    expect(trackEvent).toHaveBeenCalledTimes(2)
  })

  it('offers Cookie settings with the legal pages, set as they are, which asks again', async () => {
    const { Footer, ConsentBar } = await load()
    render(
      <>
        <Footer />
        <ConsentBar />
      </>,
    )
    const settings = screen.getByRole('button', { name: 'Cookie settings' })
    const terms = screen.getByRole('link', { name: 'Terms' })
    expect(settings.closest('ul')).toBe(terms.closest('ul'))
    expect(settings.className).toContain(terms.className)
    expect(bar()).toBeNull()
    fireEvent.click(settings)
    expect(bar()).not.toBeNull()
  })
})
