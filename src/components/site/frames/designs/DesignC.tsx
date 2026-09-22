import type { ComponentType, ReactNode } from 'react'
import {
  ArrowUp,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  Clock,
  Heart,
  Plane,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { delay } from '@/components/site/frames/motion'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { BalloonGlyph, SafariScene } from '@/components/site/frames/SafariScene'
import { story, type Kind, type Status } from '@/components/site/frames/story'
import { WindowShell } from '@/components/site/frames/WindowShell'

/* Design C — mixed, on smoked ink glass. Dark glass, light text. The few
   lines that carry the story are real text; everything else is drawn. */

type Glyph = ComponentType<{ className?: string }>

const KIND_ICON: Record<Kind, Glyph> = {
  stay: BedDouble,
  transfer: Car,
  activity: BalloonGlyph,
  flight: Plane,
  gap: TriangleAlert,
}

/* ---------------------------------------------------------------- phone */

const TURN = { header: 0.8, one: 0.9, two: 1.5, card: 2.1, three: 2.8, typing: 3.3, handoff: 3.9, composer: 0.9 } as const

export function Phone() {
  return (
    <PhoneFrame className="w-full border-ink/90 bg-ink/70 backdrop-blur-2xl" islandClassName="bg-ink">
      <div aria-hidden className="flex h-full flex-col bg-ink/55 text-[4.4cqw] leading-[1.35] text-paper">
        <div className="animate-pop flex items-center gap-[2.5cqw] px-[4cqw] pb-[2.5cqw] pt-[15cqw]" style={delay(TURN.header)}>
          <span className="grid size-[7.5cqw] place-items-center rounded-full bg-paper text-[3.8cqw] font-bold text-ink">S</span>
          <span className="flex min-w-0 flex-col leading-[1.2]">
            <span className="truncate font-semibold">{story.partner}</span>
            <span className="flex items-center gap-[1.2cqw] text-[3.3cqw] text-paper/60">
              <span className="size-[1.6cqw] rounded-full bg-up" />
              Stella · online
            </span>
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[2.4cqw] overflow-hidden px-[4cqw] pt-[1.5cqw]">
          <Traveller t={TURN.one}>
            <Drawn Icon={CalendarDays} w="w-[62%]" />
            <Drawn Icon={Users} w="w-[44%]" />
          </Traveller>

          <div className="animate-pop w-[84%] rounded-[3.5cqw] rounded-bl-[1.2cqw] bg-white/12 px-[3.2cqw] py-[2.4cqw] text-paper" style={delay(TURN.two)}>
            {story.chat[1].text}
          </div>

          <div className="animate-pop w-[84%] overflow-hidden rounded-[3.5cqw] border border-white/15 bg-white/10" style={delay(TURN.card)}>
            <div className="aspect-[16/10] w-full">
              <SafariScene />
            </div>
            <div className="flex flex-col gap-[1.2cqw] p-[3cqw] leading-[1.25]">
              <p>
                <span className="font-semibold">{story.card.title}</span>
                <span className="text-paper/60"> · {story.card.nights}</span>
              </p>
              <p className="text-[3.7cqw] text-paper/60">{story.card.line}</p>
              <div className="mt-[1cqw] flex items-center justify-between gap-[2cqw]">
                <span className="text-[3.9cqw] font-semibold">{story.card.price}</span>
                <span className="rounded-full bg-primary px-[2.8cqw] py-[1.2cqw] text-[3.3cqw] font-semibold text-paper">{story.card.action}</span>
              </div>
            </div>
          </div>

          <Traveller t={TURN.three}>
            <Drawn Icon={Heart} w="w-[52%]" />
          </Traveller>

          <div className="animate-pop flex w-fit items-center gap-[1.4cqw] rounded-[3.5cqw] rounded-bl-[1.2cqw] bg-white/12 px-[3.2cqw] py-[3cqw]" style={delay(TURN.typing)}>
            <span className="animate-blink size-[1.8cqw] rounded-full bg-paper" style={delay(0)} />
            <span className="animate-blink size-[1.8cqw] rounded-full bg-paper" style={delay(0.2)} />
            <span className="animate-blink size-[1.8cqw] rounded-full bg-paper" style={delay(0.4)} />
          </div>
        </div>

        <div className="animate-pop mx-[4cqw] mb-[2.5cqw] mt-[2cqw] flex items-center gap-[2cqw] text-[3.5cqw] text-paper/85" style={delay(TURN.handoff)}>
          <span className="grid size-[5cqw] shrink-0 place-items-center rounded-full bg-up text-paper">
            <Check className="size-[3.2cqw]" />
          </span>
          {story.handoff}
        </div>

        <div className="animate-pop mx-[4cqw] mb-[4cqw] flex h-[11cqw] shrink-0 items-center gap-[2cqw] rounded-full border border-white/15 bg-white/10 pl-[4cqw] pr-[1.8cqw]" style={delay(TURN.composer)}>
          <span className="h-[1.6cqw] flex-1 rounded-full bg-paper/30" />
          <span className="grid size-[7.6cqw] place-items-center rounded-full bg-primary text-paper">
            <ArrowUp className="size-[4.2cqw]" />
          </span>
        </div>
      </div>
    </PhoneFrame>
  )
}

function Traveller({ t, children }: { t: number; children: ReactNode }) {
  return (
    <div className="animate-pop flex w-[72%] flex-col gap-[2cqw] self-end rounded-[3.5cqw] rounded-br-[1.2cqw] bg-white/90 px-[3.2cqw] py-[2.8cqw] text-ink" style={delay(t)}>
      {children}
    </div>
  )
}

function Drawn({ Icon, w }: { Icon: Glyph; w: string }) {
  return (
    <span className="flex items-center gap-[2cqw]">
      <Icon className="size-[4cqw] shrink-0 text-ink" />
      <span className={cn('h-[1.6cqw] rounded-full bg-ink/25', w)} />
    </span>
  )
}

/* --------------------------------------------------------------- window */

const LIST = { header: 0.9, stella: 1.2, chip: 1.6, firstRow: 1.1, step: 0.14, flag: 0.6 } as const
const PLACE_W = ['w-[72%]', 'w-[64%]', '', 'w-[78%]', 'w-[68%]', 'w-[60%]'] as const
const DETAIL_W = ['w-[38%]', 'w-[30%]', '', 'w-[34%]', 'w-[42%]', 'w-[36%]'] as const
const ROW_GRID = 'grid grid-cols-[6cqw_3cqw_minmax(0,1fr)_9cqw_15cqw] items-center gap-[1.6cqw]'

export function Window() {
  return (
    <WindowShell tone="dark">
      <div aria-hidden className="grid h-full grid-cols-[34%_minmax(0,1fr)] text-[2.1cqw] leading-[1.35] text-paper">
        <div className="flex flex-col gap-[1.8cqw] border-r border-white/10 bg-white/[0.06] p-[2.6cqw]">
          <span className="flex items-center gap-[1cqw] text-[1.9cqw] font-medium text-paper/70">
            <Sparkles className="size-[2.4cqw]" />
            Stella
          </span>
          <p className="animate-pop rounded-[2cqw] rounded-tl-[0.7cqw] bg-white/12 px-[2cqw] py-[1.6cqw] text-paper" style={delay(LIST.stella)}>
            {story.stella.line}
          </p>
          <span className="animate-pop flex w-fit items-center gap-[1cqw] rounded-full bg-white/15 px-[1.8cqw] py-[0.8cqw] text-[1.8cqw] text-paper" style={delay(LIST.chip)}>
            <span className="size-[1.2cqw] rounded-full bg-primary" />
            {story.stella.chip}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-[1.2cqw] bg-white/[0.04] p-[2.6cqw]">
          <div className="animate-pop mb-[0.8cqw] flex items-center justify-between gap-[2cqw]" style={delay(LIST.header)}>
            <p className="flex min-w-0 flex-col leading-[1.3]">
              <span className="truncate text-[2.3cqw] font-semibold">{story.trip.name}</span>
              <span className="truncate text-[1.8cqw] text-paper/60">
                · {story.trip.nights} nights · {story.trip.party}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-[1.6cqw]">
              <span className="text-[1.9cqw] text-paper/60">Quote</span>
              <span className="font-bold tabular-nums">{story.header.quote}</span>
              <span className="flex items-center gap-[0.8cqw] rounded-full bg-up px-[1.6cqw] py-[0.6cqw] text-[1.8cqw] font-semibold text-paper">
                <TrendingUp className="size-[2cqw]" />
                {story.header.readyLabel} {story.header.ready}
                <span className="tabular-nums">{story.header.delta}</span>
              </span>
            </div>
          </div>

          {story.rows.map((row, i) => {
            const t = LIST.firstRow + i * LIST.step
            return row.status === 'gap' ? (
              <div key={row.days} className="animate-pop" style={delay(t)}>
                <div className={cn(ROW_GRID, 'animate-flag rounded-[1.4cqw] border border-primary/60 bg-primary/25 px-[1.8cqw] py-[1.5cqw]')} style={delay(t + LIST.flag)}>
                  <Days days={row.days} />
                  <TriangleAlert className="size-[2.6cqw] text-primary" />
                  <span className="line-clamp-2 text-[1.9cqw] leading-[1.25] text-paper">{row.place}</span>
                  <span className="col-span-2 flex justify-end">
                    <span className="rounded-full bg-primary px-[1.8cqw] py-[0.6cqw] text-[1.8cqw] font-semibold text-paper">{row.detail}</span>
                  </span>
                </div>
              </div>
            ) : (
              <Row key={row.days} kind={row.kind} days={row.days} price={row.price} status={row.status} placeW={PLACE_W[i]} detailW={DETAIL_W[i]} t={t} />
            )
          })}
        </div>
      </div>
    </WindowShell>
  )
}

function Row({
  kind,
  days,
  price,
  status,
  placeW,
  detailW,
  t,
}: {
  kind: Kind
  days: string
  price: string
  status: Exclude<Status, 'gap'>
  placeW: string
  detailW: string
  t: number
}) {
  const Icon = KIND_ICON[kind]
  return (
    <div className={cn(ROW_GRID, 'animate-pop rounded-[1.4cqw] border border-white/10 bg-white/[0.08] px-[1.8cqw] py-[1.5cqw]')} style={delay(t)}>
      <Days days={days} />
      <Icon className="size-[2.6cqw] text-paper/80" />
      <span className="flex min-w-0 flex-col gap-[0.8cqw]">
        <span className={cn('h-[1.4cqw] rounded-full bg-white/35', placeW)} />
        <span className={cn('h-[0.9cqw] rounded-full bg-white/20', detailW)} />
      </span>
      <span className="text-right tabular-nums text-paper">{price}</span>
      <span className="flex justify-end">
        <StatusMark status={status} />
      </span>
    </div>
  )
}

function Days({ days }: { days: string }) {
  return <span className="font-mono text-[1.9cqw] text-paper/50">{days}</span>
}

function StatusMark({ status }: { status: Exclude<Status, 'gap'> }) {
  if (status === 'pending') {
    return (
      <span className="flex items-center gap-[0.8cqw] whitespace-nowrap text-[1.8cqw] text-paper/60">
        <Clock className="size-[2.2cqw] text-paper/45" />
        {story.statusLabel.pending}
      </span>
    )
  }
  const Icon = status === 'confirmed' ? Check : TrendingUp
  return (
    <span className="grid size-[3.2cqw] place-items-center rounded-full bg-up text-paper">
      <Icon className="size-[2cqw]" />
    </span>
  )
}
