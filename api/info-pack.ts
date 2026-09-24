/* POST /api/info-pack: a request for one of the information packs, the
   pilot's, Engage's or Workspace's, from the form on that page. It is
   emailed to the team through Resend, with the requester as the reply-to,
   and the team replies with the pack; nothing is stored here. The body is
   exactly `{"email": string, "pack": "pilot"|"engage"|"workspace",
   "website": string}`, where `website` is a field people never see and so
   leave empty: a body that fills it is answered as sent and not emailed.

   Until the project holds RESEND_API_KEY the function answers 503, and the
   form tells the reader to email the team instead. */

import { NO_STORE, ownOrigin, readJson, refuse } from './_http.js'

export const PACKS = ['pilot', 'engage', 'workspace'] as const
export type Pack = (typeof PACKS)[number]

const PACK_NAME: Record<Pack, string> = { pilot: 'pilot', engage: 'Engage', workspace: 'Workspace' }

export const INFO_PACK_TO = 'hello@tripcerto.com'
export const INFO_PACK_FROM = 'Tripcerto website <website@notifications.tripcerto.com>'

/* An address with one @, something either side of it and a dot in the
   domain, no longer than an address can be. The browser checks the same
   before it sends. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX = 254

type PackRequest = { email: string; pack: Pack; trap: boolean }

function requestFor(body: unknown): PackRequest | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const keys = Object.keys(body).sort()
  if (keys.join() !== 'email,pack,website') return null
  const { email, pack, website } = body as Record<string, unknown>
  if (typeof email !== 'string' || typeof website !== 'string') return null
  const address = email.trim()
  if (address.length > EMAIL_MAX || !EMAIL.test(address)) return null
  if (!PACKS.includes(pack as Pack)) return null
  return { email: address, pack: pack as Pack, trap: website !== '' }
}

export type Send = (input: string, init: RequestInit) => Promise<Response>

export async function handleInfoPack(req: Request, key: string | undefined, send: Send): Promise<Response> {
  if (req.method !== 'POST') return refuse(405, 'method_not_allowed', { allow: 'POST' })
  const own = ownOrigin(req)
  if (!own) return refuse(403, 'forbidden_origin')
  const request = requestFor(await readJson(req))
  if (!request) return refuse(400, 'invalid_body')
  if (request.trap) return new Response(null, { status: 204, headers: NO_STORE })
  if (!key) {
    console.error(JSON.stringify({ event: 'info_pack_request', outcome: 'faulted', reason: 'not_configured', pack: request.pack }))
    return refuse(503, 'not_configured')
  }
  const name = PACK_NAME[request.pack]
  const res = await send('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: INFO_PACK_FROM,
      to: [INFO_PACK_TO],
      reply_to: request.email,
      subject: `The ${name} information pack, for ${request.email}`,
      text: `${request.email} asked for the ${name} information pack on ${own.host}. Reply to this email to send it.`,
    }),
  }).catch(() => null)
  if (!res?.ok) {
    console.error(JSON.stringify({ event: 'info_pack_request', outcome: 'faulted', reason: 'send_failed', status: res?.status ?? null, pack: request.pack }))
    return refuse(502, 'send_failed')
  }
  return new Response(null, { status: 204, headers: NO_STORE })
}

export const config = { useWebApi: true }

export default { fetch: (req: Request) => handleInfoPack(req, process.env.RESEND_API_KEY, fetch) }
