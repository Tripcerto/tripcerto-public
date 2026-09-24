import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'

/* The store reads the cookie once per page, so each test loads it afresh,
   as a new page would. */
async function load() {
  vi.resetModules()
  const [consent, { ConsentBar }] = await Promise.all([import('@/lib/consent'), import('./ConsentBar')])
  return { ...consent, ConsentBar }
}

function clearCookies() {
  for (const name of ['tc_consent', 'tc_team']) document.cookie = `${name}=; Path=/; Max-Age=0`
}

const bar = () => screen.queryByRole('region', { name: 'Analytics permission' })
/* The full question needs the width of sm and more than a landscape phone's height. */
const WIDE_AND_TALL = 'sm:[@media(height>480px)]'
/* A class that lays the bar out another way at some width. */
const REFLOWS = /^(?:xs|sm|md|lg|xl|2xl|max-[\w-]+|min-[\w-]+|\[@media[^\]]*\]):(?:flex|grid|block|inline|hidden|contents|items-|justify-)/
const posted = () => vi.mocked(fetch).mock.calls.map(([url, init]) => ({ url, method: init?.method, body: init?.body, keepalive: init?.keepalive }))

beforeEach(() => {
  clearCookies()
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
})

afterEach(() => {
  clearCookies()
  vi.restoreAllMocks()
})

describe('ConsentBar', () => {
  it('renders nothing in the build, which has no visitor to ask', async () => {
    const { ConsentBar } = await load()
    expect(renderToString(<ConsentBar />)).toBe('')
  })

  it('asks a visitor who has not answered, and links the privacy notice', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    expect(bar()?.textContent).toContain('Can we measure how the site is used, with Google Analytics?')
    expect(screen.getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe('/legal/privacy')
  })

  it('asks in four words on a phone, in full from sm, and in four again on a landscape phone', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    const brief = screen.getByText('Allow Google Analytics?')
    const full = screen.getByText('Can we measure how the site is used, with Google Analytics? Never advertising.')
    expect([...brief.classList]).toEqual([`${WIDE_AND_TALL}:hidden`])
    expect([...full.classList]).toEqual(['hidden', `${WIDE_AND_TALL}:inline`])
    expect(full.parentElement).toBe(brief.parentElement)
    expect(brief.parentElement?.textContent).toBe(
      'Allow Google Analytics?Can we measure how the site is used, with Google Analytics? Never advertising. Privacy',
    )
  })

  it('keeps the question and both answers on one row at every width', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    const question = screen.getByRole('link', { name: 'Privacy' }).parentElement!
    const answers = screen.getByRole('button', { name: 'Reject' }).parentElement!
    const row = question.parentElement!
    expect(answers.parentElement).toBe(row)
    expect(answers).toBe(screen.getByRole('button', { name: 'Accept' }).parentElement)
    expect(row.classList).toContain('flex')
    expect(row.classList).toContain('items-center')
    expect(row.classList).not.toContain('flex-col')
    expect([...row.classList, ...answers.classList].filter((c) => REFLOWS.test(c))).toEqual([])
  })

  it('keeps quiet for a visitor who has answered', async () => {
    document.cookie = `tc_consent=2.denied.${Math.floor(Date.now() / 1000)}; Path=/`
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    expect(bar()).toBeNull()
  })

  it('asks again when the answer was given under another policy', async () => {
    document.cookie = `tc_consent=1.granted.${Math.floor(Date.now() / 1000)}; Path=/`
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    expect(bar()).not.toBeNull()
  })

  it('records Accept on the page, then with the host, and goes', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    expect(document.cookie).toMatch(/(^|; )tc_consent=2\.granted\.\d+($|;)/)
    expect(posted()).toEqual([{ url: '/api/consent', method: 'POST', body: JSON.stringify({ analytics: 'granted' }), keepalive: true }])
    expect(bar()).toBeNull()
  })

  it('records Reject the same way', async () => {
    const { ConsentBar, readConsent } = await load()
    render(<ConsentBar />)
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(readConsent()).toBe('denied')
    expect(posted()).toEqual([{ url: '/api/consent', method: 'POST', body: JSON.stringify({ analytics: 'denied' }), keepalive: true }])
    expect(bar()).toBeNull()
  })

  it('gives Reject and Accept the same weight', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    const reject = screen.getByRole('button', { name: 'Reject' })
    const accept = screen.getByRole('button', { name: 'Accept' })
    expect(reject.className).toBe(accept.className)
    expect(accept.className).toContain('min-h-11')
  })

  it('holds an answer for the page when the browser refuses the cookie', async () => {
    const { ConsentBar, readConsent } = await load()
    render(<ConsentBar />)
    vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(readConsent()).toBeNull()
    expect(bar()).toBeNull()
  })

  it('comes back when reopened, with the answer still standing', async () => {
    const { ConsentBar, useConsent } = await load()
    render(<ConsentBar />)
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    const { result } = renderHook(() => useConsent())
    expect(result.current).toMatchObject({ analytics: 'granted', asking: false })
    act(() => result.current.reopen())
    expect(bar()).not.toBeNull()
    expect(result.current).toMatchObject({ analytics: 'granted', asking: true })
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(result.current).toMatchObject({ analytics: 'denied', asking: false })
  })

  it('takes up an answer given on another page when the back-forward cache restores this one', async () => {
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    document.cookie = `tc_consent=2.granted.${Math.floor(Date.now() / 1000)}; Path=/`
    act(() => {
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
    })
    expect(bar()).toBeNull()
  })

  it('lifts the end of the page clear of the bar while it shows', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(88)
    const { ConsentBar } = await load()
    render(<ConsentBar />)
    expect(document.body.style.paddingBottom).toBe('88px')
    expect(document.documentElement.style.scrollPaddingBottom).toBe('88px')
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    expect(document.body.style.paddingBottom).toBe('')
    expect(document.documentElement.style.scrollPaddingBottom).toBe('')
  })
})

describe('markTeamBrowser', () => {
  it('marks this browser at once and asks the host to keep the mark', async () => {
    const { isTeamBrowser, markTeamBrowser } = await load()
    markTeamBrowser(true)
    expect(isTeamBrowser()).toBe(true)
    markTeamBrowser(false)
    expect(isTeamBrowser()).toBe(false)
    expect(posted().map(({ body }) => body)).toEqual([JSON.stringify({ team: true }), JSON.stringify({ team: false })])
  })
})
