import { TrendingUp } from 'lucide-react'
import { WindowShell } from '@/components/site/frames/WindowShell'
import { BAR, BAR_FAINT, KIND_GLYPH, STATUS_GLYPH, STATUS_TONE } from '@/components/site/frames/glyphs'
import { Bar, StellaLine } from '@/components/site/frames/StellaLine'
import { delay } from '@/components/site/frames/motion'
import { story } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* Workspace: Stella's pane on the left, the itemised list on the right,
   two rows in coral, the rest confirmed or held. */

const ROW_BARS = [
  ['w-[82%]', 'w-[44%]'],
  ['w-[74%]', 'w-[50%]'],
  ['w-[78%]', ''],
  ['w-[70%]', 'w-[38%]'],
  ['w-[85%]', 'w-[46%]'],
  ['w-[76%]', 'w-[42%]'],
] as const

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
          gap
            ? 'animate-flag border-primary/40 bg-primary/10 dark:border-primary/60 dark:bg-primary/25'
            : 'border-ink/[0.06] bg-white/85 dark:border-white/10 dark:bg-white/[0.08]',
        )}
        style={gap ? delay(at + 0.6) : undefined}
      >
        <span className="font-mono text-[1.8cqw] text-muted dark:text-paper/50">{row.days}</span>
        <KindGlyph className={cn('size-[2.6cqw]', gap ? 'text-primary-deep dark:text-primary' : 'text-ink/70 dark:text-paper/80')} />
        <div className="flex min-w-0 flex-col gap-[0.9cqw]">
          <Bar className={cn('h-[1.2cqw]', place, gap ? 'bg-primary/40' : BAR)} />
          {detail && <Bar className={cn('h-[0.9cqw]', BAR_FAINT, detail)} />}
        </div>
        <span className="text-right font-medium tabular-nums">{row.price}</span>
        <span className={cn('flex size-[3.4cqw] items-center justify-center rounded-full', STATUS_TONE[row.status])}>
          <StatusGlyph className="size-[2cqw]" />
        </span>
      </div>
    </div>
  )
}

export function WorkspaceScreen() {
  return (
    <WindowShell>
      <div aria-hidden className="grid h-full grid-cols-[34%_minmax(0,1fr)] text-[2.1cqw] leading-[1.35] text-ink dark:text-paper">
        <div className="border-r border-white/50 bg-white/20 p-[2.6cqw] dark:border-white/10 dark:bg-white/[0.06]">
          <StellaLine at={1.2} scale="window" />
        </div>

        <div className="flex min-w-0 flex-col gap-[1.2cqw] bg-white/60 p-[2.6cqw] dark:bg-white/[0.04]">
          <div className="animate-pop flex items-center justify-between pb-[1cqw]" style={delay(0.9)}>
            <Bar className={cn('h-[1.4cqw] w-[22cqw]', BAR)} />
            <div className="flex items-center gap-[1.6cqw]">
              <span className="text-[2.6cqw] font-semibold tabular-nums">{story.header.quote}</span>
              <span className="flex items-center gap-[0.8cqw] rounded-full bg-up/15 px-[1.4cqw] py-[0.6cqw] text-[1.8cqw] font-semibold tabular-nums text-up dark:bg-up dark:text-paper">
                <TrendingUp className="size-[2cqw]" />
                {story.header.ready}
                <span className="text-up/70 dark:text-paper/70">{story.header.delta}</span>
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
