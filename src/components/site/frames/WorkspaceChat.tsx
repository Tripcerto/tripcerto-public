import type { ReactNode } from 'react'
import { Check, FileText, TriangleAlert } from 'lucide-react'
import { Composer } from '@/components/site/frames/Composer'
import { StatusBadge } from '@/components/site/frames/StatusBadge'
import { Step } from '@/components/site/frames/Step'
import { BADGE, TYPE } from '@/components/site/frames/type'
import { delay } from '@/components/site/frames/motion'
import { BEAT, trip } from '@/components/site/frames/trip'
import { cn } from '@/lib/utils'

/* The assistant's pane in Workspace, picking up where the phone left off.
   The pane has no header of its own: the quote request arrives from the
   website at the top, a file in the itinerary's icon grey with a green
   pulse, level with the trip's name across the window. The assistant's work sits at the foot of the chat,
   above the input bar, and grows upwards as it goes. Its steps (`Step`,
   drawn as the phone draws its own) open one at a time, each bringing a
   thin rail down to it from the step above. Each runs as a spinner and a
   lit line, then settles into a tick and its result as that result lands
   in the itinerary, and stays, so the rail reads as the work done. The
   last step finds the gaps, and the assistant then simply speaks, as it
   does on the phone: what to do about them. Badges, input and type match
   the phone's, from the frames' one scale. */

const T = TYPE.window
const B = BADGE.window

/* Something opening in the chat at `at`: it grows from no height, so what
   is below it moves down, fading in as it opens. */
function Opens({ at, className, children }: { at: number; className?: string; children: ReactNode }) {
  return (
    <div className={cn('animate-grow', className)} style={delay(at)}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export function WorkspaceChat() {
  const detect = trip.detect
  return (
    <div className={cn('flex flex-1 flex-col leading-[1.35]', T.text)}>
      <div className="animate-pop" style={delay(BEAT.request)}>
        <div
          className="animate-ring flex items-center gap-[1.2cqw] rounded-[1.5cqw] border border-ink/10 bg-white/90 p-[1.2cqw] dark:border-white/15 dark:bg-white/10"
          style={delay(BEAT.request + 0.2)}
        >
          <FileText className={cn('shrink-0 text-ink/70 dark:text-paper/80', B.size)} strokeWidth={1.8} />
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate font-semibold">{trip.enquiry.from}</span>
            <span className={cn('truncate whitespace-nowrap text-ink/55 dark:text-paper/60', T.detail)}>{trip.enquiry.line}</span>
          </span>
        </div>
      </div>

      <div className={cn('mt-auto flex flex-col pt-[1.8cqw]', T.detail)}>
        {trip.steps.map((step, index) => (
          <Opens key={step.text} at={step.start}>
            <Step
              scale="window"
              start={step.start}
              end={step.end}
              text={step.text}
              done={<span className="truncate text-ink/80 dark:text-paper/80">{step.text}</span>}
              badge={<StatusBadge scale="window" tone="done" glyph={Check} />}
              result={step.result}
              joined={index > 0}
            />
          </Opens>
        ))}
        <Opens at={detect.start}>
          <Step
            scale="window"
            start={detect.start}
            end={detect.end}
            text={detect.text}
            done={<span className="truncate font-semibold text-pink dark:text-peach">{detect.found}</span>}
            badge={<StatusBadge scale="window" tone="flag" glyph={TriangleAlert} />}
            joined
          />
        </Opens>
      </div>

      <Opens at={BEAT.next}>
        <p className="pt-[1.8cqw]">{trip.next}</p>
      </Opens>

      <Composer scale="window" placeholder={trip.paneComposer} at={0.1} className="mt-[1.8cqw]" />
    </div>
  )
}
