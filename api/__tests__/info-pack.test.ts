// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { handleInfoPack, INFO_PACK_FROM, INFO_PACK_TO, type Send } from '../info-pack'

const URL_ = 'https://www.tripcerto.com/api/info-pack'
const post = (body: unknown, headers: Record<string, string> = { 'content-type': 'application/json', origin: 'https://www.tripcerto.com' }) =>
  new Request(URL_, { method: 'POST', headers, body: JSON.stringify(body) })
const ask = { email: 'ops@operator.example', pack: 'pilot', website: '' }
const resend = (status = 200) => vi.fn<Send>(async () => new Response('{}', { status }))

describe('POST /api/info-pack', () => {
  it('emails the team the request, with the reader to reply to', async () => {
    const send = resend()
    const res = await handleInfoPack(post(ask), 're_key', send)
    expect(res.status).toBe(204)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(send).toHaveBeenCalledOnce()
    const [url, init] = send.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer re_key')
    expect(JSON.parse(init.body as string)).toEqual({
      from: INFO_PACK_FROM,
      to: [INFO_PACK_TO],
      reply_to: 'ops@operator.example',
      subject: 'The pilot information pack, for ops@operator.example',
      text: 'ops@operator.example asked for the pilot information pack on www.tripcerto.com. Reply to this email to send it.',
    })
  })

  it('names the product pack it was asked for', async () => {
    const send = resend()
    await handleInfoPack(post({ ...ask, pack: 'engage' }), 're_key', send)
    expect(JSON.parse(send.mock.calls[0][1].body as string).subject).toBe('The Engage information pack, for ops@operator.example')
  })

  it('answers a filled trap as sent, and sends nothing', async () => {
    const send = resend()
    const res = await handleInfoPack(post({ ...ask, website: 'https://spam.example' }), 're_key', send)
    expect(res.status).toBe(204)
    expect(send).not.toHaveBeenCalled()
  })

  it('says it is not set up, rather than dropping the request, until it holds a key', async () => {
    const send = resend()
    const res = await handleInfoPack(post(ask), undefined, send)
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ ok: false, error: 'not_configured' })
    expect(send).not.toHaveBeenCalled()
  })

  it('says the send failed when Resend refuses it or cannot be reached', async () => {
    expect((await handleInfoPack(post(ask), 're_key', resend(422))).status).toBe(502)
    const down = vi.fn<Send>(async () => {
      throw new TypeError('fetch failed')
    })
    const res = await handleInfoPack(post(ask), 're_key', down)
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ ok: false, error: 'send_failed' })
  })

  it('refuses another origin, another method and a bad body', async () => {
    const send = resend()
    expect((await handleInfoPack(post(ask, { 'content-type': 'application/json', origin: 'https://evil.example' }), 're_key', send)).status).toBe(403)
    expect((await handleInfoPack(post(ask, { 'content-type': 'application/json' }), 're_key', send)).status).toBe(403)
    const get = await handleInfoPack(new Request(URL_), 're_key', send)
    expect(get.status).toBe(405)
    expect(get.headers.get('allow')).toBe('POST')
    for (const body of [
      { ...ask, email: 'not an address' },
      { ...ask, email: `${'a'.repeat(250)}@x.example` },
      { ...ask, pack: 'deck' },
      { email: ask.email, pack: ask.pack },
      { ...ask, extra: true },
      'ops@operator.example',
    ]) {
      expect((await handleInfoPack(post(body), 're_key', send)).status).toBe(400)
    }
    expect(send).not.toHaveBeenCalled()
  })
})
