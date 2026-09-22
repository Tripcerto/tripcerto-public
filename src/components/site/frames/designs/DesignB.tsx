import type { ComponentType, ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUp,
  BedDouble,
  Binoculars,
  CalendarDays,
  Car,
  Check,
  Clock,
  Heart,
  MessageSquare,
  Plane,
  Plus,
  Sparkles,
  Sunrise,
  TrendingUp,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowShell } from '@/components/site/frames/WindowShell'
import { BalloonGlyph, SafariScene } from '@/components/site/frames/SafariScene'
import { delay } from '@/components/site/frames/motion'
import { story, type Kind, type Status } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* Design B: the same trip told without prose. Words become bars, meaning
   is carried by glyphs, and the only characters on either screen are the
   story's numerals. */

type Glyph = ComponentType<{ className?: string }>

const KIND_GLYPH: Record<Kind, Glyph> = {
  stay: BedDouble,
  transfer: Car,
  activity: BalloonGlyph,
  flight: Plane,
  gap: TriangleAlert,
}

const STATUS_GLYPH: Record<Status, Glyph> = {
  confirmed: Check,
  held: TrendingUp,
  pending: Clock,
  gap: Plus,
}

const STATUS_TONE: Record<Status, string> = {
  confirmed: 'bg-up/15 text-up',
  held: 'bg-up/15 text-up',
  pending: 'bg-ink/[0.06] text-muted',
  gap: 'bg-primary text-paper',
}

/* Place and detail bar widths per row, in story order. */
const ROW_BARS = [
  ['w-[82%]', 'w-[44%]'],
  ['w-[74%]', 'w-[50%]'],
  ['w-[78%]', ''],
  ['w-[70%]', 'w-[38%]'],
  ['w-[85%]', 'w-[46%]'],
  ['w-[76%]', 'w-[42%]'],
] as const

const CARD_PRICE = story.card.price.match(/£[\d,]+/)?.[0] ?? ''

function Bar({ className }: { className: string }) {
  return <span className={cn('block rounded-full', className)} />
}

function Traveller({ children, at }: { children: ReactNode; at: number }) {
  return (
    <div
      className="animate-pop max-w-[80%] self-end rounded-[4cqw] rounded-br-[1.2cqw] bg-ink/85 p-[3.5cqw] text-paper"
      style={delay(at)}
    >
      {children}
    </div>
  )
}

export function Phone() {
  return (
    <PhoneFrame className="w-full border-white/60 bg-white/20 backdrop-blur-2xl" islandClassName="bg-ink/80">
      <div aria-hidden className="flex h-full w-full flex-col bg-white/40 text-[4.4cqw] leading-[1.35] text-ink">
        <div className="animate-pop flex items-center gap-[2.5cqw] px-[5cqw] pb-[3cqw] pt-[15cqw]" style={delay(0.8)}>
          <span className="size-[7cqw] rounded-full bg-ink" />
          <Bar className="h-[2.2cqw] w-[28cqw] bg-ink/15" />
          <span className="ml-auto size-[2.4cqw] rounded-full bg-up" />
        </div>

        <div className="flex flex-col gap-[3cqw] px-[4cqw] pt-[1cqw]">
          <Traveller at={0.9}>
            <div className="flex items-center gap-[2cqw]">
              <CalendarDays className="size-[4cqw] shrink-0" />
              <Bar className="h-[2.2cqw] w-[30cqw] bg-paper/35" />
            </div>
            <div className="mt-[2cqw] flex items-center gap-[2cqw]">
              <Users className="size-[4cqw] shrink-0" />
              <Bar className="h-[2.2cqw] w-[20cqw] bg-paper/35" />
            </div>
            <div className="mt-[2.8cqw] flex gap-[1.5cqw]">
              <span className="flex items-center gap-[1.5cqw] rounded-full bg-paper/20 py-[1.2cqw] pl-[2cqw] pr-[2.6cqw]">
                <BalloonGlyph className="size-[3.6cqw]" />
                <Bar className="h-[1.8cqw] w-[7cqw] bg-paper/35" />
              </span>
              <span className="flex items-center gap-[1.5cqw] rounded-full bg-paper/20 py-[1.2cqw] pl-[2cqw] pr-[2.6cqw]">
                <Sunrise className="size-[3.6cqw]" />
                <Bar className="h-[1.8cqw] w-[9cqw] bg-paper/35" />
              </span>
            </div>
          </Traveller>

          <div
            className="animate-pop max-w-[78%] self-start rounded-[4cqw] rounded-bl-[1.2cqw] bg-white/80 p-[3.5cqw]"
            style={delay(1.5)}
          >
            <Bar className="h-[2.2cqw] w-[44cqw] bg-ink/15" />
            <Bar className="mt-[2cqw] h-[2.2cqw] w-[30cqw] bg-ink/15" />
          </div>

          <div
            className="animate-pop w-[82%] self-start overflow-hidden rounded-[4cqw] bg-white/85 shadow-card"
            style={delay(2.1)}
          >
            <div className="aspect-[4/3] w-full">
              <SafariScene />
            </div>
            <div className="p-[3.5cqw]">
              <div className="flex items-center justify-between gap-[2cqw]">
                <Bar className="h-[2.2cqw] w-[30cqw] bg-ink/15" />
                <span className="font-semibold tabular-nums">{CARD_PRICE}</span>
              </div>
              <div className="mt-[2.8cqw] flex gap-[1.5cqw]">
                <span className="flex size-[8cqw] items-center justify-center rounded-full bg-tint text-ink">
                  <BalloonGlyph className="size-[4.2cqw]" />
                </span>
                <span className="flex size-[8cqw] items-center justify-center rounded-full bg-tint text-ink">
                  <Sunrise className="size-[4.2cqw]" />
                </span>
                <span className="flex size-[8cqw] items-center justify-center rounded-full bg-tint text-ink">
                  <Binoculars className="size-[4.2cqw]" />
                </span>
              </div>
            </div>
          </div>

          <Traveller at={2.8}>
            <div className="flex items-center gap-[2cqw]">
              <Heart className="size-[4cqw] shrink-0" />
              <Bar className="h-[2.2cqw] w-[26cqw] bg-paper/35" />
            </div>
          </Traveller>

          <div
            className="animate-pop flex items-center gap-[1.4cqw] self-start rounded-[4cqw] rounded-bl-[1.2cqw] bg-white/80 px-[3.5cqw] py-[3cqw]"
            style={delay(3.3)}
          >
            <span className="animate-blink size-[2cqw] rounded-full bg-ink/50" style={delay(0)} />
            <span className="animate-blink size-[2cqw] rounded-full bg-ink/50" style={delay(0.2)} />
            <span className="animate-blink size-[2cqw] rounded-full bg-ink/50" style={delay(0.4)} />
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-[2.5cqw] px-[4cqw] pb-[4cqw]">
          <div
            className="animate-pop flex items-center gap-[1.5cqw] rounded-full bg-white/70 py-[1.4cqw] pl-[2.4cqw] pr-[3.2cqw]"
            style={delay(3.9)}
          >
            <Check className="size-[3.6cqw] text-up" />
            <Bar className="h-[2cqw] w-[26cqw] bg-ink/15" />
          </div>
          <div
            className="animate-pop flex w-full items-center rounded-full border border-white/60 bg-white/80 py-[1.6cqw] pl-[4cqw] pr-[1.6cqw]"
            style={delay(0.9)}
          >
            <Bar className="h-[2.2cqw] w-[26cqw] bg-ink/15" />
            <span className="ml-auto flex size-[8cqw] items-center justify-center rounded-full bg-primary text-paper">
              <ArrowUp className="size-[4.4cqw]" />
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function Row({ index }: { index: number }) {
  const row = story.rows[index]
  const [place, detail] = ROW_BARS[index]
  const KindGlyph = KIND_GLYPH[row.kind]
  const StatusGlyph = STATUS_GLYPH[row.status]
  const gap = row.status === 'gap'
  const at = 1.1 + index * 0.14
  return (
    <div className="animate-pop" style={delay(at)}>
      <div
        className={cn(
          'grid h-[7.4cqw] grid-cols-[5.5cqw_3.4cqw_minmax(0,1fr)_9cqw_3.4cqw] items-center gap-[1.6cqw] rounded-[1.4cqw] border px-[1.8cqw]',
          gap ? 'animate-flag border-primary/40 bg-primary/10' : 'border-ink/[0.06] bg-white/85',
        )}
        style={gap ? delay(at + 0.6) : undefined}
      >
        <span className="font-mono text-[1.8cqw] text-muted">{row.days}</span>
        <KindGlyph className={cn('size-[2.6cqw]', gap ? 'text-primary-deep' : 'text-ink/70')} />
        <div className="flex min-w-0 flex-col gap-[0.9cqw]">
          <Bar className={cn('h-[1.2cqw]', place, gap ? 'bg-primary/40' : 'bg-ink/15')} />
          {detail && <Bar className={cn('h-[0.9cqw] bg-ink/10', detail)} />}
        </div>
        <span className="text-right font-medium tabular-nums">{row.price}</span>
        <span className={cn('flex size-[3.4cqw] items-center justify-center rounded-full', STATUS_TONE[row.status])}>
          <StatusGlyph className="size-[2cqw]" />
        </span>
      </div>
    </div>
  )
}

export function Window() {
  return (
    <WindowShell tone="light">
      <div aria-hidden className="grid h-full grid-cols-[34%_minmax(0,1fr)] text-[2.1cqw] leading-[1.35] text-ink">
        <div className="flex flex-col gap-[2cqw] border-r border-white/50 bg-white/20 p-[2.6cqw]">
          <div className="animate-pop flex flex-col gap-[1.6cqw]" style={delay(1.2)}>
            <div className="flex items-center gap-[1.2cqw]">
              <span className="flex size-[3.6cqw] items-center justify-center rounded-full bg-ink text-paper">
                <Sparkles className="size-[2cqw]" />
              </span>
              <Bar className="h-[1.2cqw] w-[9cqw] bg-ink/15" />
            </div>
            <div className="flex flex-col gap-[1.4cqw] rounded-[2cqw] rounded-tl-[0.6cqw] bg-white/80 p-[2.2cqw]">
              <Bar className="h-[1.2cqw] w-[92%] bg-ink/15" />
              <Bar className="h-[1.2cqw] w-[70%] bg-ink/15" />
              <Bar className="h-[1.2cqw] w-[82%] bg-ink/15" />
            </div>
          </div>
          <div
            className="animate-pop flex items-center gap-[1.2cqw] self-start rounded-full border border-ink/10 bg-white/60 px-[1.8cqw] py-[1cqw] text-ink/70"
            style={delay(1.6)}
          >
            <MessageSquare className="size-[2cqw]" />
            <ArrowRight className="size-[2cqw]" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[1.2cqw] bg-white/60 p-[2.6cqw]">
          <div className="animate-pop flex items-center justify-between pb-[1cqw]" style={delay(0.9)}>
            <Bar className="h-[1.4cqw] w-[22cqw] bg-ink/20" />
            <div className="flex items-center gap-[1.6cqw]">
              <span className="text-[2.6cqw] font-semibold tabular-nums">{story.header.quote}</span>
              <span className="flex items-center gap-[0.8cqw] rounded-full bg-up/15 px-[1.4cqw] py-[0.6cqw] text-[1.8cqw] font-semibold tabular-nums text-up">
                <TrendingUp className="size-[2cqw]" />
                {story.header.ready}
                <span className="text-up/70">{story.header.delta}</span>
              </span>
            </div>
          </div>
          {story.rows.map((_, i) => (
            <Row key={i} index={i} />
          ))}
        </div>
      </div>
    </WindowShell>
  )
}
