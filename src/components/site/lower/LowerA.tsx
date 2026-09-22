import { ArrowRight, Check, Inbox, LayoutPanelLeft, ListChecks, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading, Lede, ProductBadge, Section } from '@/components/site/Section'
import { ROLE_GLYPH } from '@/components/site/lower/roleGlyphs'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

/* Candidate A, "one line": the journey as one track across the page with
   the two products hung over the segments they carry, the roles as ruled
   columns with no boxes, and the pilot's measures folded into the close. */
export function LowerA() {
  return (
    <>
      <Opportunity />
      <Audience />
      <Close />
    </>
  )
}

type Step = (typeof home.opportunity.steps)[number]

const STEP_GLYPH: Record<Step['label'], LucideIcon> = {
  Research: MessageCircle,
  Inquiry: Inbox,
  Quote: ListChecks,
  Booked: Check,
}

const PRODUCT = {
  engage: { glyph: MessageCircle, name: 'Engage' },
  workspace: { glyph: LayoutPanelLeft, name: 'Workspace' },
} as const

/* The product a step begins: its badge stands before the step on a phone,
   where the track runs down the page and nothing can hang over a segment. */
function productStarting(steps: readonly Step[], i: number) {
  const product = steps[i].product
  if (product === 'outcome' || (i > 0 && steps[i - 1].product === product)) return null
  return PRODUCT[product]
}

function Opportunity() {
  const steps = home.opportunity.steps
  return (
    <Section id={SECTION.opportunity} tone="tint" className="py-16 md:py-28">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.opportunity['H-2-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.opportunity['H-2-B']}</Lede>
      </div>

      <div className="mt-14 md:mt-16">
        <div className="mb-6 hidden md:grid md:grid-cols-4 md:gap-6">
          <div className="col-span-2 col-start-1 row-start-1 justify-self-center">
            <ProductBadge glyph={PRODUCT.engage.glyph}>{PRODUCT.engage.name}</ProductBadge>
          </div>
          <div className="col-span-2 col-start-2 row-start-1 justify-self-center">
            <ProductBadge glyph={PRODUCT.workspace.glyph}>{PRODUCT.workspace.name}</ProductBadge>
          </div>
        </div>

        <div className="relative">
          <span aria-hidden className="absolute inset-x-0 top-7 hidden h-px bg-line md:block" />
          <ol role="list" className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => {
              const Glyph = STEP_GLYPH[step.label]
              const badge = productStarting(steps, i)
              return (
                <li key={step.label} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                  {i < steps.length - 1 && (
                    <span aria-hidden className="absolute top-14 -bottom-10 left-7 w-px bg-line md:hidden" />
                  )}
                  <span
                    className={cn(
                      'flex size-14 shrink-0 items-center justify-center rounded-full',
                      step.product === 'outcome' ? 'bg-up text-paper' : 'glass text-link',
                    )}
                  >
                    <Glyph size={22} aria-hidden />
                  </span>
                  <div className="min-w-0 pt-3.5 md:pt-0">
                    {badge && (
                      <div className="mb-2 md:hidden">
                        <ProductBadge glyph={badge.glyph}>{badge.name}</ProductBadge>
                      </div>
                    )}
                    <h3 className="text-[17px] font-semibold md:mt-5">{step.label}</h3>
                    <p className="mt-1.5 text-[15px] text-dim">{step.line}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-[40rem] text-center text-[15px] text-dim">{home.opportunity.why}</p>
    </Section>
  )
}

/* The hairlines a column draws and the inset it keeps off them: one column
   with a rule above each but the first, pairs at sm with a rule between and
   one under the first pair, four across at lg with rules between. An outer
   edge carries no inset, so the block sits flush with the header above it. */
function columnRules(i: number, count: number) {
  const left = i % 2 === 0
  return cn(
    i > 0 && 'border-t',
    left ? 'sm:border-r sm:pr-6' : 'sm:pl-6',
    i < 2 ? 'sm:border-t-0' : 'lg:border-t-0',
    i > 0 && 'lg:pl-6',
    i < count - 1 && 'lg:border-r lg:pr-6',
  )
}

function Audience() {
  const roles = home.audience.roles.slice(0, 4)
  return (
    <Section id={SECTION.audience} className="py-16 md:py-28">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.audience['H-7-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.audience['H-7-B']}</Lede>
      </div>

      <ul role="list" className="mt-14 grid grid-cols-1 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {roles.map(({ role, measure, line }, i) => {
          const Glyph = ROLE_GLYPH[role]
          return (
            <li key={role} className={cn('border-line py-8', columnRules(i, roles.length))}>
              <Glyph size={22} aria-hidden className="text-link" />
              <h3 className="mt-5 text-[17px] font-semibold">{role}</h3>
              <p className="mt-1 text-[13px] font-medium text-dim">{measure}</p>
              <p className="mt-3 text-[15px] leading-[1.55] text-body/80">{line}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Close() {
  return (
    <section id={SECTION.close} className="relative scroll-mt-16 overflow-hidden">
      <Band />
      <div className="shell relative py-20 text-center md:py-28">
        <Heading className="mx-auto max-w-[40rem] text-paper">{home.close['H-9-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem] text-paper/85">{home.close['H-9-B']}</Lede>

        <p className="mt-10 text-[13px] font-semibold text-paper/80">{home.proof['H-8-A']}</p>
        <ul role="list" className="mt-3 flex flex-wrap justify-center gap-2">
          {home.proof.measures.map((measure) => (
            <li
              key={measure}
              className="rounded-full border border-white/50 bg-white/15 px-3.5 py-1.5 text-[13px] font-medium text-paper backdrop-blur-md"
            >
              {measure}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button asChild variant="accent" size="lg">
            <a href={DEMO_URL}>
              {home.close['H-9-C']}
              <ArrowRight aria-hidden />
            </a>
          </Button>
          <a href={PAGES.pilot} className="inline-flex min-h-11 items-center gap-1 font-semibold text-paper">
            {home.close['H-9-D']}
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
