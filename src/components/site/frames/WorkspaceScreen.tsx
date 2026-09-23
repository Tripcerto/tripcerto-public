import type { LucideIcon } from 'lucide-react'
import { BedDouble, Check, Clock, Plane, TrendingUp, TriangleAlert } from 'lucide-react'
import { PRODUCT_GLYPH, type Glyph } from '@/components/site/frames/glyphs'
import { BalloonGlyph } from '@/components/site/frames/SafariScene'
import { StatusBadge, type BadgeTone } from '@/components/site/frames/StatusBadge'
import { BADGE, ICON, TYPE, type Surface } from '@/components/site/frames/type'
import { WindowShell } from '@/components/site/frames/WindowShell'
import { WorkspaceChat } from '@/components/site/frames/WorkspaceChat'
import { delay } from '@/components/site/frames/motion'
import { BEAT, trip, type RowKind, type RowStatus } from '@/components/site/frames/trip'
import { cn } from '@/lib/utils'

/* Workspace, titled as the app it is. The assistant's pane on the left; on
   the right the itinerary fills in on the assistant's steps: the trip's
   name once the request is read; the items flowing in top to bottom (flight
   in, the camp and the balloon the traveller picked in the chat, the
   flight to the coast, flight out); every price and the quote's total
   sliding in from the right at once; then the two gaps it left, flagged
   together, each with what to pick to fill it, and the trip's readiness.
   The itinerary sizes from its own width (the frames' itinerary scale), so
   it can also stand alone in a window of its own. */

const T = TYPE.itinerary
const B = BADGE.itinerary
const EngageGlyph = PRODUCT_GLYPH.Engage

const ROW_GLYPH: Record<RowKind, Glyph> = {
  stay: BedDouble,
  activity: BalloonGlyph,
  flight: Plane,
  gap: TriangleAlert,
}

const STATUS: Record<Exclude<RowStatus, 'gap'>, { tone: BadgeTone; glyph: LucideIcon }> = {
  confirmed: { tone: 'done', glyph: Check },
  request: { tone: 'waiting', glyph: Clock },
  held: { tone: 'waiting', glyph: Clock },
}

const ROW_GRID =
  'grid h-full grid-cols-[4.2cqw_minmax(0,1fr)_14.5cqw_5.5cqw] items-center gap-[3.9cqw] rounded-[2.26cqw] border pl-[3.9cqw] pr-[2.9cqw]'

type Row = (typeof trip.rows)[number]

function RowText({ row, gap }: { row: Row; gap: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-[1.6cqw] leading-tight">
      <span className={cn('truncate font-semibold', gap && 'text-pink dark:text-paper')}>{row.name}</span>
      {row.picked && (
        <span
          className={cn(
            'flex shrink-0 items-center gap-[0.8cqw] rounded-full bg-primary/12 px-[1.45cqw] py-[0.4cqw] font-semibold text-pink dark:bg-primary/25 dark:text-peach',
            T.kind,
          )}
        >
          <EngageGlyph className="size-[2.26cqw]" />
          {trip.picked}
        </span>
      )}
    </div>
  )
}

function ItemRow({ index }: { index: number }) {
  const row = trip.rows[index]
  const KindGlyph = ROW_GLYPH[row.kind]
  const at = BEAT.rows + index * BEAT.rowGap
  if (row.status === 'gap') {
    return (
      <div className="animate-flow grid h-[8.4cqw]" style={delay(at)}>
        <div className="col-start-1 row-start-1 rounded-[2.26cqw] border border-dashed border-ink/15 dark:border-white/20" />
        <div className="animate-pop col-start-1 row-start-1" style={delay(BEAT.gaps)}>
          <div className={cn(ROW_GRID, 'animate-flag border-primary/40 bg-primary/10 dark:border-primary/60 dark:bg-primary/25')} style={delay(BEAT.gaps)}>
            <KindGlyph className={cn(ICON.itinerary, 'text-pink dark:text-primary')} />
            <RowText row={row} gap />
            <span
              className={cn(
                'col-span-2 flex h-[5.16cqw] items-center justify-self-end whitespace-nowrap rounded-full border border-primary/40 bg-white px-[2.1cqw] font-semibold text-pink dark:border-primary/60 dark:bg-white/10 dark:text-peach',
                T.kind,
              )}
            >
              {row.action}
            </span>
          </div>
        </div>
      </div>
    )
  }
  const status = STATUS[row.status]
  return (
    <div className="animate-flow h-[8.4cqw]" style={delay(at)}>
      <div className={cn(ROW_GRID, 'border-ink/[0.06] bg-white/85 dark:border-white/10 dark:bg-white/[0.08]')}>
        <KindGlyph className={cn(ICON.itinerary, 'text-ink/70 dark:text-paper/80')} />
        <RowText row={row} gap={false} />
        <span className="animate-slide text-right font-semibold tabular-nums" style={delay(BEAT.prices)}>
          {row.price}
        </span>
        <StatusBadge scale="itinerary" tone={status.tone} glyph={status.glyph} />
      </div>
    </div>
  )
}

/* The itinerary on its own: the trip's name and readiness, its rows and
   the quote's total. A size container, so everything in it scales with
   its own width. */
function Itinerary() {
  return (
    <div className="@container min-w-0">
      <div className={cn('flex h-full flex-col gap-[1.6cqw] bg-white/60 p-[4.2cqw] leading-[1.35] dark:bg-white/[0.04]', T.text)}>
        <div className="flex items-center justify-between gap-[3.2cqw] pb-[1.6cqw]">
          <span className="animate-pop flex min-w-0 flex-col leading-tight" style={delay(BEAT.named)}>
            <span className="truncate font-semibold">{trip.title}</span>
            <span className={cn('truncate text-ink/55 dark:text-paper/60', T.detail)}>{trip.meta}</span>
          </span>
          <span
            className={cn(
              'animate-pop flex shrink-0 items-center gap-[1.3cqw] rounded-full bg-up-tint px-[2.26cqw] py-[0.97cqw] font-semibold tabular-nums text-up dark:bg-up dark:text-paper',
              T.detail,
            )}
            style={delay(BEAT.found)}
          >
            <TrendingUp className={B.glyph} />
            {trip.ready}
          </span>
        </div>
        {trip.rows.map((row, i) => (
          <ItemRow key={row.name} index={i} />
        ))}
        <div
          className="animate-slide mt-auto flex items-baseline justify-end gap-[2.6cqw] border-t border-ink/[0.08] pt-[2.26cqw] dark:border-white/10"
          style={delay(BEAT.prices)}
        >
          <span className={cn('font-semibold text-ink/55 dark:text-paper/60', T.detail)}>Quote total</span>
          <span className={cn('font-semibold tabular-nums', T.total)}>{trip.quote}</span>
        </div>
      </div>
    </div>
  )
}

/* The whole app: the assistant's pane beside the itinerary, in a 4:3
   window. */
export function WorkspaceScreen({ surface }: { surface: Surface }) {
  return (
    <WindowShell title="Workspace" surface={surface} shape="screen">
      <div className="grid h-full grid-cols-[38%_minmax(0,1fr)] text-ink dark:text-paper">
        <div className="flex min-w-0 flex-col border-r border-white/50 bg-white/20 p-[2.6cqw] dark:border-white/10 dark:bg-white/[0.06]">
          <WorkspaceChat />
        </div>
        <Itinerary />
      </div>
    </WindowShell>
  )
}

/* The itinerary alone in the Workspace window, the window as tall as the
   trip. */
export function ItineraryScreen({ surface }: { surface: Surface }) {
  return (
    <WindowShell title="Workspace" surface={surface} shape="content">
      <Itinerary />
    </WindowShell>
  )
}
