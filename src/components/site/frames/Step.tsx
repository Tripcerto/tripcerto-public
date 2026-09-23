import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { BADGE, type FrameScale } from '@/components/site/frames/type'
import { delay, sweepFrom } from '@/components/site/frames/motion'
import { cn } from '@/lib/utils'

const GAP = { window: 'gap-x-[1.1cqw]', phone: 'gap-x-[2.6cqw]' } as const satisfies Partial<Record<FrameScale, string>>

/* One piece of the assistant's work, drawn the same way in both frames.
   While it runs (from `start`): a spinner and its name lit by the sweep,
   which starts on the first letter as the step appears. At `end`: the
   badge and the settled line take their place, with the step's result, if
   it has one, on the right. Given `joined`, a thin line comes down from the
   step above into the badge, opening with this step, so no line waits
   under a step for one that has not come yet. */
export function Step({
  scale,
  start,
  end,
  text,
  done,
  badge,
  result,
  joined = false,
}: {
  scale: keyof typeof GAP
  start: number
  end: number
  text: string
  done: ReactNode
  badge: ReactNode
  result?: string
  joined?: boolean
}) {
  return (
    <div className={cn('grid grid-cols-[auto_minmax(0,1fr)] items-center', GAP[scale])}>
      {joined && <span className="col-start-1 h-[1.2cqw] w-px justify-self-center bg-ink/12 dark:bg-white/15" />}
      <span className="col-start-1 grid">
        <span className="animate-vanish col-start-1 row-start-1" style={delay(end)}>
          <LoaderCircle className={cn('animate-spin text-ink/35 dark:text-paper/45', BADGE[scale].size)} strokeWidth={2.4} />
        </span>
        <span className="animate-pop col-start-1 row-start-1" style={delay(end)}>
          {badge}
        </span>
      </span>
      <span className="col-start-2 grid min-w-0">
        <span className="animate-vanish col-start-1 row-start-1 truncate" style={{ ...delay(end), ...sweepFrom(start) }}>
          <span className="text-shimmer font-medium">{text}…</span>
        </span>
        <span className="animate-pop col-start-1 row-start-1 flex min-w-0 items-baseline gap-[1cqw]" style={delay(end)}>
          {done}
          {result && <span className="ml-auto shrink-0 tabular-nums text-ink/55 dark:text-paper/60">{result}</span>}
        </span>
      </span>
    </div>
  )
}
