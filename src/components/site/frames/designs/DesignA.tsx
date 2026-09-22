import type { CSSProperties, ReactNode } from 'react'
import { ArrowUp, BedDouble, Car, Check, Clock, Plane, Sparkles, TrendingUp, TriangleAlert } from 'lucide-react'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowShell } from '@/components/site/frames/WindowShell'
import { BalloonGlyph, SafariScene } from '@/components/site/frames/SafariScene'
import { delay } from '@/components/site/frames/motion'
import { story, type Kind, type Status } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* Design A: real text on frosted white glass. Every string from the story
   is shown as text, so the frames read as the product itself. */

const TURN_AT = [0.9, 1.5, 2.1, 2.8, 3.3] as const

export function Phone() {
  return (
    <PhoneFrame className="w-full border-white/60 bg-white/20 backdrop-blur-2xl" islandClassName="bg-ink/80">
      <div aria-hidden className="flex h-full w-full flex-col bg-white/40 text-[4.4cqw] leading-[1.35] text-ink">
        <div className="animate-pop flex items-center gap-[2.6cqw] bg-white/60 px-[5cqw] pb-[3cqw] pt-[15cqw]" style={delay(0.8)}>
          <span className="flex size-[9cqw] shrink-0 items-center justify-center rounded-full bg-ink font-bold text-paper">S</span>
          <span className="flex min-w-0 flex-col leading-[1.25]">
            <span className="truncate font-semibold">{story.partner}</span>
            <span className="flex items-center gap-[1.4cqw] text-[3.4cqw] text-muted">
              <span className="size-[1.8cqw] rounded-full bg-up" />
              Stella · online
            </span>
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-[2.4cqw] overflow-hidden px-[4cqw] py-[3cqw]">
          {story.chat.map((turn, i) => (
            <Turn key={i} from={turn.from} at={TURN_AT[i]}>
              {'text' in turn ? turn.text : null}
            </Turn>
          ))}
        </div>

        <div className="flex flex-col gap-[2.4cqw] px-[4cqw] pb-[4cqw]">
          <div className="animate-pop flex justify-center" style={delay(3.9)}>
            <span className="inline-flex items-center gap-[1.4cqw] rounded-full bg-white/75 px-[3cqw] py-[1.2cqw] text-[3.4cqw] text-ink/70">
              <Check className="size-[3.6cqw] text-up" />
              {story.handoff}
            </span>
          </div>
          <div
            className="animate-pop flex items-center rounded-full border border-white bg-white/85 py-[1.2cqw] pl-[4cqw] pr-[1.2cqw]"
            style={delay(0.9)}
          >
            <span className="flex-1 text-ink/45">{story.composer}</span>
            <span className="flex size-[8cqw] items-center justify-center rounded-full bg-primary text-paper">
              <ArrowUp className="size-[4.4cqw]" />
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function Turn({ from, at, children }: { from: (typeof story.chat)[number]['from']; at: number; children: ReactNode }) {
  if (from === 'card') return <Card at={at} />
  if (from === 'typing') {
    return (
      <div
        className="animate-pop flex w-fit items-center gap-[1.4cqw] rounded-[4cqw] rounded-bl-[1.2cqw] bg-white/80 px-[3.6cqw] py-[3cqw]"
        style={delay(at)}
      >
        {[0, 0.2, 0.4].map((d) => (
          <span key={d} className="animate-blink size-[1.9cqw] rounded-full bg-ink/60" style={delay(d)} />
        ))}
      </div>
    )
  }
  const traveller = from === 'traveller'
  return (
    <div
      className={cn(
        'animate-pop max-w-[84%] rounded-[4cqw] px-[3.6cqw] py-[2.4cqw]',
        traveller ? 'self-end rounded-br-[1.2cqw] bg-ink/85 text-paper' : 'self-start rounded-bl-[1.2cqw] bg-white/80 text-ink',
      )}
      style={delay(at)}
    >
      {children}
    </div>
  )
}

function Card({ at }: { at: number }) {
  return (
    <div className="animate-pop w-[86%] self-start overflow-hidden rounded-[4cqw] bg-white/90" style={delay(at)}>
      <div className="aspect-[16/10] overflow-hidden">
        <SafariScene />
      </div>
      <div className="flex flex-col gap-[1.2cqw] p-[3.2cqw] leading-[1.3]">
        <div className="truncate">
          <span className="font-semibold">{story.card.title}</span>
          <span className="text-muted"> · {story.card.nights}</span>
        </div>
        <div className="truncate text-[3.7cqw] text-muted">{story.card.line}</div>
        <div className="mt-[0.8cqw] flex items-center justify-between gap-[2cqw]">
          <span className="font-semibold">{story.card.price}</span>
          <span className="rounded-full bg-primary px-[2.8cqw] py-[1.1cqw] text-[3.3cqw] font-medium text-paper">{story.card.action}</span>
        </div>
      </div>
    </div>
  )
}

const KIND_ICON: Record<Kind, (props: { className?: string }) => ReactNode> = {
  stay: BedDouble,
  transfer: Car,
  activity: BalloonGlyph,
  flight: Plane,
  gap: TriangleAlert,
}

const STATUS_ICON: Record<Exclude<Status, 'gap'>, (props: { className?: string }) => ReactNode> = {
  confirmed: Check,
  held: TrendingUp,
  pending: Clock,
}

const ROW_AT = (i: number) => 1.1 + i * 0.14

export function Window() {
  return (
    <WindowShell tone="light">
      <div aria-hidden className="grid h-full min-h-0 grid-cols-[34%_minmax(0,1fr)] text-[2.1cqw] leading-[1.35] text-ink">
        <div className="flex min-w-0 flex-col gap-[1.6cqw] border-r border-white/50 bg-white/20 p-[2.4cqw]">
          <div className="animate-pop flex items-center gap-[1cqw] font-semibold" style={delay(0.9)}>
            <Sparkles className="size-[2.4cqw] text-primary-deep" />
            Stella
          </div>
          <div className="animate-pop rounded-[1.8cqw] rounded-tl-[0.6cqw] bg-white/80 p-[2cqw] leading-[1.4] text-ink" style={delay(1.2)}>
            {story.stella.line}
          </div>
          <div className="animate-pop" style={delay(1.6)}>
            <span className="inline-flex items-center gap-[1cqw] rounded-full border border-white/80 bg-white/60 px-[1.6cqw] py-[0.7cqw] text-[1.8cqw] text-ink">
              <span className="size-[1.2cqw] shrink-0 rounded-full bg-primary" />
              {story.stella.chip}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[1.2cqw] bg-white/60 p-[2.4cqw]">
          <div className="animate-pop flex items-center justify-between gap-[2cqw]" style={delay(0.9)}>
            <div className="flex min-w-0 flex-col leading-[1.3]">
              <span className="truncate text-[2.3cqw] font-semibold">{story.trip.name}</span>
              <span className="truncate text-[1.8cqw] text-muted">
                · {story.trip.nights} nights · {story.trip.party}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-[1.4cqw]">
              <span className="text-[1.8cqw] text-muted">Quote</span>
              <span className="text-[2.3cqw] font-bold tabular-nums">{story.header.quote}</span>
              <span className="inline-flex items-center gap-[0.8cqw] rounded-full bg-up/15 px-[1.4cqw] py-[0.5cqw] text-[1.7cqw] font-semibold text-up">
                <TrendingUp className="size-[2cqw]" />
                {story.header.readyLabel}
                <span className="tabular-nums">{story.header.ready}</span>
                <span className="tabular-nums">{story.header.delta}</span>
              </span>
            </div>
          </div>

          {story.rows.map((row, i) =>
            row.status === 'gap' ? (
              <div key={i} className="animate-pop" style={delay(ROW_AT(i))}>
                <Row row={row} className="animate-flag" style={delay(ROW_AT(i) + 0.6)} />
              </div>
            ) : (
              <Row key={i} row={row} className="animate-pop" style={delay(ROW_AT(i))} />
            ),
          )}
        </div>
      </div>
    </WindowShell>
  )
}

function Row({ row, className, style }: { row: (typeof story.rows)[number]; className?: string; style: CSSProperties }) {
  const gap = row.status === 'gap'
  const Icon = KIND_ICON[row.kind]
  return (
    <div
      className={cn(
        'grid grid-cols-[4.6cqw_2.2cqw_minmax(0,1fr)_auto_auto] items-center gap-[1.2cqw] rounded-[1.2cqw] border px-[1.4cqw] py-[1.1cqw]',
        gap ? 'border-primary/40 bg-primary/10' : 'border-white/80 bg-white/85',
        className,
      )}
      style={style}
    >
      <span className="font-mono text-[1.7cqw] text-muted">{row.days}</span>
      <Icon className={cn('size-[2.2cqw]', gap ? 'text-primary-deep' : 'text-ink/70')} />
      {gap ? (
        <span className="line-clamp-2 text-[1.9cqw] font-semibold leading-[1.25] text-primary-deep">{row.place}</span>
      ) : (
        <span className="flex min-w-0 flex-col leading-[1.3]">
          <span className="truncate text-[1.9cqw] font-semibold">{row.place}</span>
          <span className="truncate text-[1.6cqw] text-muted">{row.detail}</span>
        </span>
      )}
      <span className="text-[1.9cqw] tabular-nums">{row.price}</span>
      {gap ? (
        <span className="whitespace-nowrap rounded-full bg-primary px-[1.4cqw] py-[0.5cqw] text-[1.5cqw] font-semibold text-paper">{row.detail}</span>
      ) : (
        <StatusPill status={row.status} />
      )}
    </div>
  )
}

function StatusPill({ status }: { status: Exclude<Status, 'gap'> }) {
  const Icon = STATUS_ICON[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.6cqw] whitespace-nowrap rounded-full px-[1.1cqw] py-[0.4cqw] text-[1.5cqw] font-medium',
        status === 'pending' ? 'bg-ink/[0.06] text-muted' : 'bg-up/15 text-up',
      )}
    >
      <Icon className="size-[1.7cqw]" />
      {story.statusLabel[status]}
    </span>
  )
}
