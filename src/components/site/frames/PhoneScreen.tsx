import type { ReactNode } from 'react'
import { ChevronLeft, Sparkles, Sunrise, Volume2 } from 'lucide-react'
import type { Glyph } from '@/components/site/frames/glyphs'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { SafariScene, BalloonGlyph } from '@/components/site/frames/SafariScene'
import { BAR } from '@/components/site/frames/glyphs'
import { Bar, StellaLine } from '@/components/site/frames/StellaLine'
import { VoiceNote } from '@/components/site/frames/Voice'
import { delay } from '@/components/site/frames/motion'
import { story } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* Engage on the phone: the traveller writes, Stella answers with two
   activities she recommends and a word on them that can be heard as well
   as read, the traveller answers by voice, and Stella's next reply is on
   its way. It sits at the bottom of the screen as a conversation does.
   Bars stand for the words. Bezel and screen are painted, not glass, so
   the window behind the phone does not show through either. */

const ACTIVITY = [
  { glyph: BalloonGlyph, crop: 'balloon' },
  { glyph: Sunrise, crop: 'giraffe' },
] as const satisfies ReadonlyArray<{ glyph: Glyph; crop: 'balloon' | 'giraffe' }>

function Traveller({ children, at }: { children: ReactNode; at: number }) {
  return (
    <div
      className="animate-pop flex max-w-[78%] flex-col gap-[2.2cqw] self-end rounded-[4cqw] rounded-br-[1.2cqw] bg-ink/85 p-[3.6cqw] dark:bg-white/90"
      style={delay(at)}
    >
      {children}
    </div>
  )
}

const SAID = 'bg-paper/35 dark:bg-ink/25'

export function PhoneScreen() {
  return (
    <PhoneFrame
      className="w-full border-white/80 bg-band-frosted shadow-[0_2px_4px_rgb(43_18_32/0.08),0_24px_48px_-12px_rgb(43_18_32/0.35),0_60px_120px_-30px_rgb(43_18_32/0.4)] dark:border-ink/85 dark:bg-band-smoked"
      islandClassName="bg-ink/80 dark:bg-ink"
    >
      <div aria-hidden className="flex h-full w-full flex-col bg-band-frosted text-[4.4cqw] leading-[1.35] text-ink dark:bg-band-smoked dark:text-paper">
        <div className="animate-pop flex items-center gap-[3cqw] px-[4cqw] pb-[3cqw] pt-[13cqw]" style={delay(0.7)}>
          <ChevronLeft className="size-[5cqw] text-ink/70 dark:text-paper/70" />
          <span className="relative flex size-[9cqw] items-center justify-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink">
            <Sparkles className="size-[4.6cqw]" />
            <span className="absolute -bottom-[0.4cqw] -right-[0.4cqw] size-[3cqw] rounded-full border-[0.6cqw] border-white bg-up dark:border-ink" />
          </span>
          <Bar className={cn('h-[1.8cqw] w-[16cqw] self-end', BAR)} />
        </div>

        <div className="mt-auto flex flex-col gap-[4.4cqw] px-[4cqw] pb-[8cqw]">
          <Traveller at={0.9}>
            <Bar className={cn('h-[2.2cqw] w-[36cqw]', SAID)} />
            <Bar className={cn('h-[2.2cqw] w-[24cqw]', SAID)} />
          </Traveller>

          <StellaLine at={1.2} scale="phone" className="px-[1cqw]" />

          <div className="animate-pop flex gap-[4%]" style={delay(1.5)}>
            {story.activities.map((activity, i) => {
              const { glyph: ActivityGlyph, crop } = ACTIVITY[i]
              return (
                <div key={activity.name} className="w-[48%] shrink-0 overflow-hidden rounded-[3.5cqw] bg-white/85 shadow-card dark:bg-white/10">
                  <div className="relative aspect-[4/3] w-full">
                    <SafariScene crop={crop} />
                    <span className="absolute left-[2.4cqw] top-[2.4cqw] flex size-[7cqw] items-center justify-center rounded-full bg-white/90 text-ink">
                      <ActivityGlyph className="size-[3.8cqw]" />
                    </span>
                  </div>
                  <div className="flex flex-col gap-[1.8cqw] p-[2.8cqw]">
                    <Bar className={cn('h-[2cqw] w-[72%]', BAR)} />
                    <div className="flex items-center justify-between gap-[1.5cqw]">
                      <Bar className={cn('h-[1.6cqw] w-[38%]', BAR)} />
                      <span className="text-[3.8cqw] font-semibold tabular-nums">{activity.price}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="animate-pop flex max-w-[82%] flex-col gap-[2.2cqw] self-start rounded-[4cqw] rounded-bl-[1.2cqw] bg-white/80 p-[3.6cqw] dark:bg-white/12"
            style={delay(1.8)}
          >
            <Bar className={cn('h-[2.2cqw] w-[44cqw]', BAR)} />
            <span className="flex items-end justify-between gap-[2.4cqw]">
              <Bar className={cn('h-[2.2cqw] w-[30cqw]', BAR)} />
              <Volume2 className="size-[3.4cqw] shrink-0 text-ink/45 dark:text-paper/60" />
            </span>
          </div>

          <Traveller at={2.2}>
            <VoiceNote scale="phone" />
          </Traveller>

          <div
            className="animate-pop flex items-center gap-[1.4cqw] self-start rounded-[4cqw] rounded-bl-[1.2cqw] bg-white/80 px-[3.6cqw] py-[3cqw] dark:bg-white/12"
            style={delay(2.6)}
          >
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="animate-blink size-[2cqw] rounded-full bg-ink/50 dark:bg-paper" style={delay(d)} />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
