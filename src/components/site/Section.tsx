import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Every section below a hero is one strip in the same rhythm, and this
   file is where it lives: the same padding above and below, a centred head
   (the heading, and the lede 20px under it), then its content the same
   distance under the head, across the shell's width. The close band keeps
   the rhythm too, from SECTION_PAD and SectionHead. No section sets a
   padding or a gap of its own. */
export const SECTION_PAD = 'py-20 md:py-28'

export function Section({
  id,
  heading,
  lede,
  action,
  tone = 'page',
  children,
}: {
  id?: string
  heading: string
  lede?: string
  action?: ReactNode
  tone?: 'page' | 'tint'
  children?: ReactNode
}) {
  return (
    <section id={id} className={cn(SECTION_PAD, tone === 'tint' && 'bg-soft')}>
      <div className="shell">
        <SectionHead heading={heading} lede={lede} action={action} />
        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  )
}

/* A section's head: the heading, the lede under it, and an action under
   that where the section has one (a link, or the close's buttons), all
   centred. On the band it is set in paper. */
export function SectionHead({
  heading,
  lede,
  action,
  onBand = false,
}: {
  heading: string
  lede?: string
  action?: ReactNode
  onBand?: boolean
}) {
  return (
    <div className="mx-auto max-w-[44rem] text-center">
      <h2 className={cn('text-heading text-balance', onBand && 'text-paper')}>{heading}</h2>
      {lede && (
        <p className={cn('mx-auto mt-5 max-w-[40rem] text-lede text-pretty', onBand ? 'text-paper/85' : 'text-dim')}>{lede}</p>
      )}
      {action && <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  )
}
