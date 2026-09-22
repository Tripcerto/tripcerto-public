import type { LucideIcon } from 'lucide-react'
import { Check, LayoutPanelLeft, MessageCircle } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

type Stage = (typeof home.opportunity.stages)[number]['name']

const GLYPH: Record<Stage, { icon: LucideIcon; tone: string }> = {
  Engage: { icon: MessageCircle, tone: 'text-link' },
  Workspace: { icon: LayoutPanelLeft, tone: 'text-link' },
  Booked: { icon: Check, tone: 'text-up' },
}

/* The journey as three ruled columns of type: the product before the
   inquiry, the product after it, the outcome. Taylor (22 Sep evening)
   rejected pills, connecting lines and a choreographed reveal here ("too
   big, too clunky … not clear enough"); this is the plain statement. */
export function Opportunity() {
  return (
    <Section id={SECTION.opportunity} tone="tint" className="py-20 md:py-28">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.opportunity['H-2-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.opportunity['H-2-B']}</Lede>
      </div>

      {/* Three pillars, centred and clear of the edges when the screen is
          tight, widening with it: one pillar below md, three inside 52rem at
          md, 62rem at lg, the whole shell from xl. */}
      <ol
        role="list"
        className="mx-auto mt-14 grid w-full max-w-[26rem] grid-cols-1 md:mt-16 md:max-w-[52rem] md:grid-cols-3 md:gap-x-10 lg:max-w-[62rem] xl:max-w-none xl:gap-x-14"
      >
        {home.opportunity.stages.map(({ when, name, line }) => {
          const { icon: Glyph, tone } = GLYPH[name]
          return (
            <li key={name} className="border-t border-line pt-6 pb-8 md:pb-0">
              <p className="text-[13px] font-semibold text-dim">{when}</p>
              <h3 className="mt-3 flex items-center gap-2.5 text-[19px] font-semibold">
                <Glyph size={22} aria-hidden className={cn('shrink-0', tone)} />
                {name}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.55] text-body/80">{line}</p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
