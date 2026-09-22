import { Binoculars, Sunrise } from 'lucide-react'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { SafariScene, BalloonGlyph } from '@/components/site/frames/SafariScene'
import { BAR, KIND_GLYPH, STATUS_GLYPH, STATUS_TONE } from '@/components/site/frames/glyphs'
import { Bar, StellaLine } from '@/components/site/frames/StellaLine'
import { delay } from '@/components/site/frames/motion'
import { story } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* The same trip, loaded on the phone: Stella's line, the trip card and the
   list. No conversation is drawn; the phone laps the Workspace pane where
   it would be. The screen is painted, not glass, so the window behind it
   does not show through. */

const CARD_PRICE = story.card.price.match(/£[\d,]+/)?.[0] ?? ''
const PHONE_BARS = ['w-[70%]', 'w-[58%]', 'w-[84%]', 'w-[64%]', 'w-[76%]', 'w-[62%]'] as const

export function PhoneScreen() {
  return (
    <PhoneFrame
      className="w-full border-white/60 bg-white/20 shadow-[0_2px_4px_rgb(43_18_32/0.08),0_24px_48px_-12px_rgb(43_18_32/0.35),0_60px_120px_-30px_rgb(43_18_32/0.4)] backdrop-blur-3xl backdrop-saturate-150 dark:border-ink/90 dark:bg-ink/70"
      islandClassName="bg-ink/80 dark:bg-ink"
    >
      <div aria-hidden className="flex h-full w-full flex-col bg-band-frosted text-[4.4cqw] leading-[1.35] text-ink dark:bg-band-smoked dark:text-paper">
        <div className="animate-pop flex items-center justify-end gap-[1.8cqw] px-[5cqw] pb-[2cqw] pt-[14cqw]" style={delay(0.8)}>
          <span className="size-[2.4cqw] rounded-full bg-up" />
          <Bar className={cn('h-[1.8cqw] w-[9cqw]', BAR)} />
        </div>

        <div className="flex flex-col gap-[3cqw] px-[4cqw]">
          <StellaLine at={1.0} scale="phone" className="px-[1cqw]" />

          <div className="animate-pop overflow-hidden rounded-[4cqw] bg-white/85 shadow-card dark:bg-white/10" style={delay(1.5)}>
            <div className="aspect-[16/10] w-full">
              <SafariScene />
            </div>
            <div className="p-[3.5cqw]">
              <div className="flex items-center justify-between gap-[2cqw]">
                <Bar className={cn('h-[2.2cqw] w-[30cqw]', BAR)} />
                <span className="font-semibold tabular-nums">{CARD_PRICE}</span>
              </div>
              <div className="mt-[2.8cqw] flex gap-[1.5cqw]">
                {[BalloonGlyph, Sunrise, Binoculars].map((Glyph, i) => (
                  <span key={i} className="flex size-[8cqw] items-center justify-center rounded-full bg-tint text-ink dark:bg-white/15 dark:text-paper">
                    <Glyph className="size-[4.2cqw]" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[2cqw]">
            {story.rows.map((row, i) => {
              const KindGlyph = KIND_GLYPH[row.kind]
              const StatusGlyph = STATUS_GLYPH[row.status]
              const gap = row.status === 'gap'
              const at = 2.1 + i * 0.16
              return (
                <div key={i} className="animate-pop" style={delay(at)}>
                  <div
                    className={cn(
                      'grid h-[12cqw] grid-cols-[8cqw_5.5cqw_minmax(0,1fr)_6cqw] items-center gap-[2.4cqw] rounded-[2.8cqw] border px-[3.2cqw]',
                      gap
                        ? 'animate-flag border-primary/40 bg-primary/10 dark:border-primary/60 dark:bg-primary/25'
                        : 'border-ink/[0.06] bg-white/85 dark:border-white/10 dark:bg-white/[0.08]',
                    )}
                    style={gap ? delay(at + 0.6) : undefined}
                  >
                    <span className="font-mono text-[3.2cqw] text-muted dark:text-paper/50">{row.days}</span>
                    <KindGlyph className={cn('size-[4.4cqw]', gap ? 'text-primary-deep dark:text-primary' : 'text-ink/70 dark:text-paper/80')} />
                    <Bar className={cn('h-[2cqw]', PHONE_BARS[i], gap ? 'bg-primary/40' : BAR)} />
                    <span className={cn('flex size-[6cqw] items-center justify-center rounded-full', STATUS_TONE[row.status])}>
                      <StatusGlyph className="size-[3.4cqw]" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
