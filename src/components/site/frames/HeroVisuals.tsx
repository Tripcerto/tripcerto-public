import { useState, type CSSProperties, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { delay } from '@/components/site/frames/motion'
import { BEAT, HANDOFF } from '@/components/site/frames/trip'

/* The two product frames as one story. The Workspace window sits up and to
   the right, the phone in front at bottom left, over the window's
   assistant pane, softly out of focus. The traveller's chat plays on the
   phone; once the phone has sent the trip (--handoff), the phone steps
   aside and back out of focus, the window comes forward into it and fills
   in from it, every entrance inside it held
   back by the same time (--d0). Both frames stand from the first paint in
   the story's opening state, so a pair not yet wholly on screen still
   shows them; only what happens inside them waits for the Reveal. Both
   are sized from the column width, so
   the pair keeps its shape from a phone screen to a 1680 shell. Once the
   story has played, Replay under the window plays it again from the start
   (a new key remounts the pair, and with it every entrance). */

const STORY = { '--handoff': `${HANDOFF}s` } as CSSProperties
const HELD_BACK = { '--d0': `${HANDOFF}s` } as CSSProperties

export function HeroVisuals({ window, phone }: { window: ReactNode; phone: ReactNode }) {
  const [run, setRun] = useState(0)
  return (
    <div key={run} className="relative mx-auto flow-root w-full max-w-[880px] lg:max-w-none" style={STORY}>
      <div className="animate-window-front relative mb-[9%] ml-[8%]">
        <div style={HELD_BACK}>{window}</div>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="animate-pop absolute right-0 top-full mt-[1.5%] inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-paper/80 transition-colors hover:bg-white/10 hover:text-paper motion-reduce:hidden"
          style={delay(HANDOFF + BEAT.replay)}
        >
          <RotateCcw size={15} aria-hidden />
          Replay
        </button>
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-[36%]">
        <div className="animate-phone-back">
          <div className="animate-float" style={delay(1.6)}>
            {phone}
          </div>
        </div>
      </div>
    </div>
  )
}
