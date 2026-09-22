import { Fragment } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check, ChevronRight, LayoutPanelLeft, MessageCircle } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading, Lede, Section } from '@/components/site/Section'
import { ROLE_GLYPH } from '@/components/site/lower/roleGlyphs'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

/* Candidate C of the lower half of the home page: the journey as three
   dots and a tick, the roles as a ruled list beside the heading, and the
   pilot measures folded into the close, which opens with the hero's pill. */

type DotLabel = (typeof home.opportunity.dots)[number]['label']

/* The two products stand in glass; the outcome is the tick, solid green. */
const DOT: Record<DotLabel, { glyph: LucideIcon; pill: string; tone?: string }> = {
  Engage: { glyph: MessageCircle, pill: 'glass', tone: 'text-link' },
  Workspace: { glyph: LayoutPanelLeft, pill: 'glass', tone: 'text-link' },
  Booked: { glyph: Check, pill: 'bg-up text-paper' },
}

const PILL =
  'inline-flex h-9 items-center gap-2 rounded-full border border-white/50 bg-white/15 pl-4 pr-3 text-[14px] font-medium text-paper backdrop-blur-md transition-colors hover:bg-white/25'

export function LowerC() {
  return (
    <>
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

      <Section id={SECTION.audience} className="py-16 md:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <Heading>{home.audience['H-7-A']}</Heading>
            <Lede className="mt-5 max-w-[40rem]">{home.audience['H-7-B']}</Lede>
          </div>
          <ul role="list" className="border-t border-line">
            {home.audience.roles.map(({ role, measure, line }) => {
              const Glyph = ROLE_GLYPH[role]
              return (
                <li
                  key={role}
                  className="grid grid-cols-1 gap-2 border-b border-line py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6"
                >
                  <div className="flex items-start gap-3">
                    <Glyph size={20} aria-hidden className="mt-[2px] shrink-0 text-link" />
                    <div>
                      <h3 className="text-[16px] font-semibold">{role}</h3>
                      <p className="mt-0.5 text-[13px] text-dim">{measure}</p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-[1.55] text-body/80">{line}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      <section id={SECTION.close} className="relative scroll-mt-16 overflow-hidden">
        <Band />
        <div className="shell relative py-20 text-center md:py-28">
          <a href={PAGES.pilot} className={PILL}>
            Pilot
            <span className="text-paper/50" aria-hidden>
              ·
            </span>
            {home.close['H-9-D']}
            <ChevronRight size={14} aria-hidden />
          </a>
          <Heading className="mx-auto mt-8 max-w-[40rem] text-paper">{home.close['H-9-A']}</Heading>
          <Lede className="mx-auto mt-5 max-w-[40rem] text-paper/85">{home.close['H-9-B']}</Lede>
          <p className="mx-auto mt-8 max-w-[44rem] text-[14px] text-paper/75">
            {home.proof['H-8-A']}:{' '}
            {home.proof.measures.map((measure, i) => (
              <Fragment key={measure}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{measure}</span>
              </Fragment>
            ))}
          </p>
          <Button asChild variant="accent" size="lg" className="mt-10">
            <a href={DEMO_URL}>
              {home.close['H-9-C']}
              <ArrowRight aria-hidden />
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
