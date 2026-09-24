import type { ReactNode } from 'react'
import { Lines, type Copy } from '@/components/site/Lines'
import { cn } from '@/lib/utils'

/* Every section below a hero is one strip in the same rhythm, and this
   file is where it lives: the same padding above and below, a centred head
   (the heading, and the lede 20px under it), then its content the same
   distance under the head, across the shell's width. The close band keeps
   the rhythm too, from SECTION_PAD and SectionHead. No section sets a
   padding or a gap of its own. Like the type, the spacing grows with the
   screen from a 390px phone to a 1024px laptop and never steps at a
   breakpoint: a section's padding from 80px to 112px, the head to the
   content from 48px to 64px. */
export const SECTION_PAD = 'py-[clamp(5rem,3.8rem+5vw,7rem)]'

/* The width tiles take, so their edges line up down the page: below lg,
   where they stack or sit two to a row, one centred column 36rem wide, so
   a tile on a tablet is the size it is on a laptop; from lg, where they sit
   side by side, the shell's whole width. The product tiles, the layer's
   panel, the roles and the team all take it. */
export const TILES = 'mx-auto w-full max-w-[36rem] lg:max-w-none'

/* A hero's padding, on the home page and every other, and the legal
   pages' opening: below the fixed bar from 112px to 160px, and 64px to 96px
   under the hero's content, on the same curve. */
export const HERO_PAD = 'pt-[clamp(7rem,5.15rem+7.6vw,10rem)] pb-[clamp(4rem,2.8rem+5vw,6rem)]'

export function Section({
  id,
  heading,
  lede,
  action,
  tone = 'page',
  children,
}: {
  id?: string
  heading: Copy
  lede?: Copy
  action?: ReactNode
  tone?: 'page' | 'tint'
  children?: ReactNode
}) {
  return (
    <section id={id} className={cn(SECTION_PAD, tone === 'tint' && 'bg-soft')}>
      <div className="shell">
        <SectionHead heading={heading} lede={lede} action={action} />
        {children && <div className="mt-[clamp(3rem,2.4rem+2.5vw,4rem)]">{children}</div>}
      </div>
    </section>
  )
}

/* A section's head: the heading, the lede under it, and an action under
   that where the section has one (a link, or the close's buttons), all
   centred. The heading's measure is wide enough that no heading on the site
   runs past two lines from a tablet up (but the home page's layer
   heading, the founders' sentence word for word, which takes three on a
   tablet held upright and two from a laptop), and a short one, as every
   close's is, stands on one; the lede keeps the narrower measure prose reads best
   at. Either can set its own lines (Lines). On the band it is set in
   paper. */
export function SectionHead({
  heading,
  lede,
  action,
  onBand = false,
}: {
  heading: Copy
  lede?: Copy
  action?: ReactNode
  onBand?: boolean
}) {
  return (
    <div className="mx-auto max-w-[52rem] text-center">
      <h2 className={cn('text-heading text-balance', onBand && 'text-paper')}>
        <Lines text={heading} />
      </h2>
      {lede && (
        <p className={cn('mx-auto mt-5 max-w-[40rem] text-lede text-pretty', onBand ? 'text-paper/85' : 'text-dim')}>
          <Lines text={lede} />
        </p>
      )}
      {action && <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  )
}
