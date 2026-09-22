import type { LucideIcon } from 'lucide-react'
import { Check, LayoutPanelLeft, MessageCircle } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

type DotLabel = (typeof home.opportunity.dots)[number]['label']

/* The journey as three dots and a tick: the two products stand in glass,
   the outcome is the tick, solid green. Taylor chose this over a four-step
   track and a drawn timeline (22 Sep). */
const DOT: Record<DotLabel, { glyph: LucideIcon; pill: string; tone?: string }> = {
  Engage: { glyph: MessageCircle, pill: 'glass', tone: 'text-link' },
  Workspace: { glyph: LayoutPanelLeft, pill: 'glass', tone: 'text-link' },
  Booked: { glyph: Check, pill: 'bg-up text-paper' },
}

export function Opportunity() {
  return (
    <Section id={SECTION.opportunity} tone="tint" className="py-16 md:py-28">
      <Heading className="mx-auto max-w-[44rem] text-center">{home.opportunity['H-2-A']}</Heading>

      {/* Each dot carries the hairline to the next one, so the list holds
          only its items: a vertical rule below the text in the column, a
          horizontal one from the pill's centre in the row. The gap is the
          rule's length. */}
      <ol
        role="list"
        className="mt-12 flex flex-col items-center gap-16 sm:flex-row sm:items-start sm:justify-center sm:gap-12 md:mt-14 md:gap-20"
      >
        {home.opportunity.dots.map(({ label, line }, i) => {
          const { glyph: Glyph, pill, tone } = DOT[label]
          return (
            <li key={label} className="relative flex max-w-[16rem] flex-col items-center">
              <h3 className={cn('inline-flex h-14 items-center gap-3 rounded-full px-6 text-[17px] font-semibold', pill)}>
                <Glyph size={20} aria-hidden className={tone} />
                {label}
              </h3>
              <p className="mt-4 text-center text-[15px] text-dim">{line}</p>
              {i < home.opportunity.dots.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-full mt-4 h-8 w-px bg-line sm:left-full sm:top-7 sm:mt-0 sm:h-px sm:w-12 md:w-20"
                />
              )}
            </li>
          )
        })}
      </ol>

      <Lede className="mx-auto mt-14 max-w-[40rem] text-center">{home.opportunity['H-2-B']}</Lede>
      <p className="mx-auto mt-5 max-w-[40rem] text-center text-[15px] text-dim">{home.opportunity.why}</p>
    </Section>
  )
}
