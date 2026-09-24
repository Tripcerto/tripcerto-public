import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { pack as copy } from '@/content/pack'
import { CONTACT_EMAIL } from '@/lib/links'
import { cn } from '@/lib/utils'

export type Pack = keyof typeof copy.names

type State = 'idle' | 'sending' | 'sent' | 'failed'

/* A request for an information pack, on the band: a work email and a
   small send button beside it (Taylor, 24 Sep), one row from a small
   tablet up and stacked on a phone, then what the email is for. It posts to /api/info-pack (api/info-pack.ts), which
   emails the team. Sent, the form gives way to the thanks; failed, for
   any reason, it says so and gives the team's address, so no request is
   lost without the reader knowing. The field named `website` is off
   screen and out of the tab order: a person leaves it empty, and a form
   filler that fills it is answered as sent and never emailed. */
export function InfoPackForm({ pack, label, className }: { pack: Pack; label?: string; className?: string }) {
  const [state, setState] = useState<State>('idle')
  const id = useId()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/info-pack', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: String(data.get('email') ?? ''), pack, website: String(data.get('website') ?? '') }),
      })
      setState(res.ok ? 'sent' : 'failed')
    } catch {
      setState('failed')
    }
  }

  if (state === 'sent') {
    return (
      <p role="status" className={cn('text-lede text-paper', className)}>
        {copy.sent}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn('relative w-full max-w-[32rem]', className)}>
      {/* The field's label: shown where nothing above says what the form
          is for (the Pilot page's hero), read out only where a heading
          does (a close). */}
      <label htmlFor={id} className={label ? 'mb-3 block text-label text-paper' : 'sr-only'}>
        {label ?? copy.label}
      </label>
      <div className="flex flex-col gap-3 xs:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder={copy.placeholder}
          className="h-11 min-w-0 flex-1 rounded-full border border-white/60 bg-white px-5 text-copy text-ink placeholder:text-ink/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        />
        <Button type="submit" variant="accent" disabled={state === 'sending'}>
          {state === 'sending' ? copy.sending : copy.submit}
        </Button>
      </div>
      <div aria-hidden className="absolute -left-[9999px] top-0">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <p role="status" className="mt-3 text-small text-paper empty:mt-0">
        {state === 'failed' && (
          <>
            {copy.failed}{' '}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`The ${copy.names[pack]} information pack`)}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </>
        )}
      </p>
      <p className="mt-3 text-small text-paper/85">
        {copy.note}{' '}
        <a href="/legal/privacy" className="underline underline-offset-4">
          {copy.privacy}
        </a>
      </p>
    </form>
  )
}
