import { CalendarDays, Check, FileText, Heart, MapPin, Sunrise, TriangleAlert, Users } from 'lucide-react'
import type { Glyph } from '@/components/site/frames/glyphs'
import { BAR, BAR_FAINT } from '@/components/site/frames/glyphs'
import { BalloonGlyph } from '@/components/site/frames/SafariScene'
import { Bar } from '@/components/site/frames/StellaLine'
import { delay } from '@/components/site/frames/motion'
import { story } from '@/components/site/frames/story'
import { cn } from '@/lib/utils'

/* The brief as it reaches sales: the fields Engage filled in as the
   traveller researched, the two activities they considered with their
   prices, and the transcript underneath. Bars stand for the words, as in
   every frame; the only characters are the story's numerals. */

const FIELDS = [
  { glyph: CalendarDays, bars: ['w-[34%]', 'w-[18%]'] },
  { glyph: Users, bars: ['w-[24%]'] },
  { glyph: MapPin, bars: ['w-[46%]', 'w-[30%]'] },
  { glyph: Heart, bars: ['w-[58%]', 'w-[40%]', 'w-[26%]'] },
  { glyph: TriangleAlert, bars: ['w-[42%]'] },
] as const satisfies ReadonlyArray<{ glyph: Glyph; bars: ReadonlyArray<string> }>

const CONSIDERED = [BalloonGlyph, Sunrise] as const satisfies ReadonlyArray<Glyph>

export function BriefCard() {
  return (
    <div
      aria-hidden
      className="@container w-full cursor-default select-none overflow-hidden rounded-2xl border border-white/60 bg-white/25 text-ink shadow-frame backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-ink/70 dark:text-paper"
    >
      <div className="flex flex-col gap-[2.6cqw] p-[4.5cqw] text-[3cqw] leading-[1.35]">
        <div className="animate-pop flex items-center justify-between" style={delay(0.9)}>
          <Bar className={cn('h-[2cqw] w-[30cqw]', BAR)} />
          <span className="flex size-[5.2cqw] items-center justify-center rounded-full bg-up/15 text-up dark:bg-up dark:text-paper">
            <Check className="size-[3cqw]" />
          </span>
        </div>

        <div className="flex flex-col gap-[2cqw] border-t border-ink/[0.08] pt-[3cqw] dark:border-white/10">
          {FIELDS.map(({ glyph: FieldGlyph, bars }, i) => (
            <div key={i} className="animate-pop grid grid-cols-[4cqw_minmax(0,1fr)] items-start gap-[2.6cqw]" style={delay(1.05 + i * 0.12)}>
              <FieldGlyph className="mt-[0.4cqw] size-[3.2cqw] text-ink/60 dark:text-paper/70" />
              <div className="flex flex-col gap-[1.2cqw] pt-[0.6cqw]">
                {bars.map((w) => (
                  <Bar key={w} className={cn('h-[1.7cqw]', w, BAR)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[1.6cqw] border-t border-ink/[0.08] pt-[3cqw] dark:border-white/10">
          {story.activities.map((activity, i) => {
            const ConsideredGlyph = CONSIDERED[i]
            return (
              <div
                key={activity.name}
                className="animate-pop flex items-center gap-[2.4cqw] rounded-[2cqw] border border-ink/[0.06] bg-white/85 px-[2.6cqw] py-[2cqw] dark:border-white/10 dark:bg-white/[0.08]"
                style={delay(1.75 + i * 0.14)}
              >
                <span className="flex size-[5.6cqw] shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink/80 dark:bg-white/10 dark:text-paper/80">
                  <ConsideredGlyph className="size-[3.2cqw]" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[1.1cqw]">
                  <Bar className={cn('h-[1.7cqw] w-[56%]', BAR)} />
                  <Bar className={cn('h-[1.3cqw] w-[34%]', BAR_FAINT)} />
                </div>
                <span className="font-semibold tabular-nums">{activity.price}</span>
              </div>
            )
          })}
        </div>

        <div className="animate-pop flex items-center gap-[2.4cqw] border-t border-ink/[0.08] pt-[3cqw] dark:border-white/10" style={delay(2.1)}>
          <FileText className="size-[3.2cqw] text-ink/60 dark:text-paper/70" />
          <Bar className={cn('h-[1.7cqw] w-[44%]', BAR_FAINT)} />
        </div>
      </div>
    </div>
  )
}
