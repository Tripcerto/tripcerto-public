import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InfoPackForm } from './InfoPackForm'
import { pack } from '@/content/pack'
import { CONTACT_EMAIL } from '@/lib/links'

afterEach(() => vi.unstubAllGlobals())

const answer = (status: number) => vi.fn(async () => new Response(null, { status }))

describe('the information pack form', () => {
  it('sends the email and the pack, with the trap left empty, then thanks the reader', async () => {
    const fetch = answer(204)
    vi.stubGlobal('fetch', fetch)
    render(<InfoPackForm pack="engage" />)
    await userEvent.type(screen.getByLabelText(pack.label), 'ops@operator.example')
    await userEvent.click(screen.getByRole('button', { name: pack.submit }))
    const thanks = await screen.findByText(pack.sent)
    expect(thanks.getAttribute('role')).toBe('status')
    expect(document.activeElement).toBe(thanks)
    expect(screen.queryByRole('button', { name: pack.submit })).toBeNull()
    expect(fetch).toHaveBeenCalledWith('/api/info-pack', expect.objectContaining({ method: 'POST' }))
    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(init.body as string)).toEqual({ email: 'ops@operator.example', pack: 'engage', website: '' })
  })

  it('sends on Enter in the field, once, however often Enter is pressed while it sends', async () => {
    let settle: (res: Response) => void = () => {}
    const fetch = vi.fn(() => new Promise<Response>((resolve) => (settle = resolve)))
    vi.stubGlobal('fetch', fetch)
    render(<InfoPackForm pack="pilot" />)
    await userEvent.type(screen.getByPlaceholderText(pack.placeholder), 'ops@operator.example{Enter}{Enter}')
    expect(fetch).toHaveBeenCalledOnce()
    settle(new Response(null, { status: 204 }))
    expect(await screen.findByText(pack.sent)).toBeTruthy()
  })

  it('keeps an address the browser would refuse from being sent', async () => {
    const fetch = answer(204)
    vi.stubGlobal('fetch', fetch)
    render(<InfoPackForm pack="pilot" />)
    await userEvent.type(screen.getByLabelText(pack.label), 'not an address{Enter}')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('says when it did not send, and gives the address to write to instead', async () => {
    vi.stubGlobal('fetch', answer(503))
    render(<InfoPackForm pack="pilot" label="Get the pilot information pack by email" />)
    await userEvent.type(screen.getByLabelText('Get the pilot information pack by email'), 'ops@operator.example')
    await userEvent.click(screen.getByRole('button', { name: pack.submit }))
    const link = await screen.findByRole('link', { name: CONTACT_EMAIL })
    expect(link.getAttribute('href')).toBe(`mailto:${CONTACT_EMAIL}?subject=The%20pilot%20information%20pack`)
    screen.getByText(pack.failed, { exact: false })
  })

  it('says the same when the request never reaches the site', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))))
    render(<InfoPackForm pack="workspace" />)
    await userEvent.type(screen.getByLabelText(pack.label), 'ops@operator.example')
    await userEvent.click(screen.getByRole('button', { name: pack.submit }))
    expect(await screen.findByRole('link', { name: CONTACT_EMAIL })).toBeTruthy()
  })
})
