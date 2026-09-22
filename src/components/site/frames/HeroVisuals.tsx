import type { ReactNode } from 'react'
import { delay } from '@/components/site/frames/motion'

/* The two product frames as one composition: the Workspace window sits up
   and to the right, the phone in front at bottom left, hanging a little
   below the window and covering Stella's pane, as if the same trip had
   loaded on the phone. Both are sized from the column width, so the pair
   keeps its shape from a phone screen to a 1680 shell. The window rises
   first, the phone follows and then floats. */
export function HeroVisuals({ window, phone }: { window: ReactNode; phone: ReactNode }) {
  return (
    <div className="relative mx-auto flow-root w-full max-w-[560px] lg:max-w-none">
      <div className="animate-pop mb-[20%] ml-[10%] sm:mb-[16%] lg:mb-[12%] lg:ml-[9%]" style={delay(0.1)}>
        {window}
      </div>
      <div className="animate-pop absolute bottom-0 left-0 z-10 w-[42%] lg:w-[38%]" style={delay(0.3)}>
        <div className="animate-float" style={delay(1.6)}>
          {phone}
        </div>
      </div>
    </div>
  )
}
