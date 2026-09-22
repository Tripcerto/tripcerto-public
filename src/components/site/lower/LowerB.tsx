import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check, FileText, Inbox, LayoutPanelLeft, MessageCircle, Mic } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading, Lede, ProductBadge, Section } from '@/components/site/Section'
import { Stage } from '@/components/site/Stage'
import { BAR, BAR_FAINT, KIND_GLYPH, STATUS_GLYPH, STATUS_TONE } from '@/components/site/frames/glyphs'
import { Bar, StellaLine } from '@/components/site/frames/StellaLine'
import { delay } from '@/components/site/frames/motion'
import { story } from '@/components/site/frames/story'
import { ROLE_GLYPH } from '@/components/site/lower/roleGlyphs'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

/* Candidate B of the lower half of the home page: the journey drawn beside
   the copy in the frames' idiom, the roles as glass cards, a slim strip of
   the pilot measures, and the close on the band. */

const LINK = 'group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-link'

const [research, inquiry, quote, booked] = home.opportunity.steps

/* One stop on the journey: the node on the line, the step's name beside it
   and what the brief looks like at that point drawn underneath. The line
   runs from each node to the next; the last node is the tick. */
function Step({
  at,
  glyph: Glyph,
  label,
  done = false,
  children,
}: {
  at: number
  glyph: LucideIcon
  label: string
  done?: boolean
  children: ReactNode
}) {
  return (
    <div className="animate-pop flex gap-[2.4cqw]" style={delay(at)}>
      <div className="relative flex w-[7cqw] shrink-0 justify-center">
        <span
          className={cn(
            'flex size-[7cqw] items-center justify-center rounded-full',
            done ? 'bg-up text-paper' : 'border border-line bg-card text-link',
          )}
        >
          <Glyph className="size-[3.2cqw]" />
        </span>
        {!done && <span className="absolute top-[7cqw] -bottom-[3cqw] left-1/2 w-px -translate-x-1/2 bg-line" />}
      </div>
      <div className="min-w-0 flex-1">
        <span className="flex h-[7cqw] items-center text-[2.8cqw] font-semibold">{label}</span>
        <div className="mt-[1cqw]">{children}</div>
      </div>
    </div>
  )
}

const QUOTE_ROWS = [story.rows[0], story.rows[2], story.rows[3]] as const

function QuoteRow({ row, at }: { row: (typeof QUOTE_ROWS)[number]; at: number }) {
  const KindGlyph = KIND_GLYPH[row.kind]
  const StatusGlyph = STATUS_GLYPH[row.status]
  const gap = row.status === 'gap'
  return (
    <div className="animate-pop flex items-center gap-[1.2cqw]" style={delay(at)}>
      <KindGlyph className={cn('size-[2.2cqw] shrink-0', gap ? 'text-primary' : 'text-ink/70 dark:text-paper/80')} />
      <Bar className={cn('h-[1.1cqw] flex-1', gap ? 'bg-primary/40' : BAR)} />
      <span className="min-w-[7cqw] text-right font-mono text-[2cqw] tabular-nums">{row.price}</span>
      <span
        className={cn(
          'flex size-[2.6cqw] shrink-0 items-center justify-center rounded-full',
          STATUS_TONE[row.status],
          gap && 'animate-flag',
        )}
        style={gap ? delay(at + 0.6) : undefined}
      >
        <StatusGlyph className="size-[1.5cqw]" />
      </span>
    </div>
  )
}

/* The same brief, from the website to the booking: what the traveller
   said, the brief it became, the quote built from it, the booking. Words
   are bars; only the story's numerals are printed. */
function Journey() {
  return (
    <div aria-hidden className="flex flex-col gap-[3cqw]">
      <Step at={0} glyph={MessageCircle} label={research.label}>
        <div className="inline-flex items-end gap-[1.2cqw] rounded-[1.8cqw] rounded-bl-[0.6cqw] bg-ink/85 p-[1.6cqw] dark:bg-white/90">
          <span className="flex flex-col gap-[0.8cqw]">
            <Bar className="h-[1.1cqw] w-[26cqw] bg-paper/35 dark:bg-ink/25" />
            <Bar className="h-[1.1cqw] w-[18cqw] bg-paper/35 dark:bg-ink/25" />
          </span>
          <Mic className="size-[1.8cqw] shrink-0 text-paper/70 dark:text-ink/60" />
        </div>
        <StellaLine at={0.4} scale="window" className="mt-[1.2cqw] w-[34cqw]" />
      </Step>

      <Step at={0.2} glyph={Inbox} label={inquiry.label}>
        <div className="flex w-[54cqw] items-center gap-[1.2cqw] rounded-[1.8cqw] border border-dashed border-line bg-card p-[1.4cqw]">
          <span className="flex size-[4cqw] shrink-0 items-center justify-center rounded-[0.9cqw] bg-soft text-link">
            <FileText className="size-[2.2cqw]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[0.8cqw]">
            <Bar className={cn('h-[1.1cqw] w-[72%]', BAR)} />
            <Bar className={cn('h-[0.9cqw] w-[40%]', BAR_FAINT)} />
          </span>
          <Check className="size-[1.8cqw] shrink-0 text-up" />
        </div>
      </Step>

      <Step at={0.4} glyph={LayoutPanelLeft} label={quote.label}>
        <div className="flex w-[66cqw] flex-col gap-[0.8cqw] rounded-[1.8cqw] border border-line bg-card p-[1.2cqw]">
          {QUOTE_ROWS.map((row, i) => (
            <QuoteRow key={i} row={row} at={0.5 + i * 0.12} />
          ))}
        </div>
      </Step>

      <Step at={0.6} glyph={Check} label={booked.label} done>
        <div className="flex items-center gap-[1.2cqw]">
          <span className="flex size-[4cqw] shrink-0 items-center justify-center rounded-full bg-up text-paper">
            <Check className="size-[2.2cqw]" />
          </span>
          <span className="font-mono text-[2.4cqw] font-semibold tabular-nums">{story.header.quote}</span>
          <Bar className={cn('h-[1.1cqw] w-[10cqw]', BAR)} />
        </div>
      </Step>
    </div>
  )
}

export function LowerB() {
  return (
    <>
      <Section id={SECTION.opportunity} className="py-16 md:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div>
            <div className="flex flex-wrap gap-2">
              <ProductBadge glyph={MessageCircle}>Engage</ProductBadge>
              <ProductBadge glyph={LayoutPanelLeft}>Workspace</ProductBadge>
            </div>
            <Heading className="mt-5">{home.opportunity['H-2-A']}</Heading>
            <Lede className="mt-5 max-w-[40rem]">{home.opportunity['H-2-B']}</Lede>
            <p className="mt-5 max-w-[40rem] text-[15px] text-dim">{home.opportunity.why}</p>
          </div>
          <Stage caption={home.opportunity.steps.map((s) => s.label).join(' · ')} className="max-lg:mb-8">
            <div className="@container w-full max-w-[520px]">
              <Journey />
            </div>
          </Stage>
        </div>
      </Section>

      <Section id={SECTION.audience} className="py-16 md:py-28">
        <div className="mx-auto max-w-[44rem] text-center">
          <Heading>{home.audience['H-7-A']}</Heading>
          <Lede className="mx-auto mt-5 max-w-[40rem]">{home.audience['H-7-B']}</Lede>
        </div>
        <ul role="list" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.audience.roles.map(({ role, measure, line }) => {
            const Glyph = ROLE_GLYPH[role]
            return (
              <li key={role} className="glass rounded-lg p-6 md:p-7">
                <span className="flex size-10 items-center justify-center rounded-full bg-soft text-link">
                  <Glyph size={20} aria-hidden />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold">{role}</h3>
                <p className="mt-1 text-[13px] font-medium text-link">{measure}</p>
                <p className="mt-3 text-[15px] leading-[1.55] text-dim">{line}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id={SECTION.proof} tone="tint" className="py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div>
            <Heading className="text-[1.5rem] md:text-[1.75rem]">{home.proof['H-8-A']}</Heading>
            <Lede className="mt-3">{home.proof['H-8-B']}</Lede>
          </div>
          <div>
            <ul role="list" className="flex flex-wrap gap-2 lg:justify-end">
              {home.proof.measures.map((measure) => (
                <li
                  key={measure}
                  className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium"
                >
                  <Check size={14} aria-hidden className="text-up" />
                  {measure}
                </li>
              ))}
            </ul>
            <p className="mt-6 lg:text-right">
              <a href={PAGES.pilot} className={LINK}>
                {home.close['H-9-D']}
                <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
          </div>
        </div>
      </Section>

      <section id={SECTION.close} className="relative scroll-mt-16 overflow-hidden">
        <Band />
        <div className="shell relative py-20 text-center md:py-28">
          <Heading className="mx-auto max-w-[40rem] text-paper">{home.close['H-9-A']}</Heading>
          <Lede className="mx-auto mt-5 max-w-[40rem] text-paper/85">{home.close['H-9-B']}</Lede>
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
