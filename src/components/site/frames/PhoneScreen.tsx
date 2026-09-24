import type { ReactNode } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { Composer } from '@/components/site/frames/Composer'
import { KIND_ICON } from '@/components/site/frames/kinds'
import { OperatorMark } from '@/components/site/frames/OperatorMark'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { SafariScene } from '@/components/site/frames/SafariScene'
import { StatusBadge } from '@/components/site/frames/StatusBadge'
import { Step } from '@/components/site/frames/Step'
import { BADGE, HEADER, SURFACE, TYPE, type Surface } from '@/components/site/frames/type'
import { delay } from '@/components/site/frames/motion'
import { PHONE_BEAT as AT, trip } from '@/components/site/frames/trip'
import { cn } from '@/lib/utils'

/* Engage on the phone, in the operator's own chat: a parent asks where to
   take the family on safari, the assistant answers with the Masai Mara and
   why, and two picks for it (a stay and an experience, each a picture with
   its kind as a badge), then offers to pass the trip to the operator's
   team. The parent says yes and names both, and the hand-off runs as the
   assistant's steps do in Workspace (`Step`): a spinner and a lit line
   that settle into a tick; Workspace takes it from there. Where the phone
   stands without the window (`sends` false) it stops at the parent's
   picks. Sized from the frames' one scale; timed from the story's clock;
   painted with the surface it stands on. */

const T = TYPE.phone
const B = BADGE.phone

function Traveller({ children, at }: { children: ReactNode; at: number }) {
  return (
    <div
      className="animate-pop max-w-[82%] self-end rounded-[4.2cqw] rounded-br-[1.4cqw] bg-ink/85 px-[3.6cqw] py-[2.6cqw] text-paper dark:bg-white/90 dark:text-ink"
      style={delay(at)}
    >
      {children}
    </div>
  )
}

export function PhoneScreen({ surface, sends }: { surface: Surface; sends: boolean }) {
  return (
    <PhoneFrame
      className={cn(
        'border-white/80 shadow-[0_2px_4px_rgb(40_17_49/0.08),0_24px_48px_-12px_rgb(40_17_49/0.35),0_60px_120px_-30px_rgb(40_17_49/0.4)] dark:border-ink/85',
        SURFACE[surface],
      )}
      islandClassName="bg-ink/80 dark:bg-ink"
    >
      <div aria-hidden className={cn('flex h-full w-full flex-col leading-[1.35] text-ink dark:text-paper', SURFACE[surface], T.text)}>
        <div
          className={cn(
            'animate-pop flex shrink-0 items-center gap-[3cqw] border-b border-ink/[0.06] px-[4cqw] pb-[3.4cqw] pt-[20cqw] dark:border-white/10',
            HEADER.phone.text,
          )}
          style={delay(AT.header)}
        >
          <ChevronLeft className={cn('text-ink/70 dark:text-paper/70', HEADER.phone.icon)} />
          <span className="relative">
            <OperatorMark className={HEADER.phone.mark} />
            <span className="absolute -bottom-[0.4cqw] -right-[0.4cqw] size-[3cqw] rounded-full border-[0.6cqw] border-white bg-up dark:border-ink" />
          </span>
          <span className="font-semibold">{trip.operator}</span>
        </div>

        <div className="mt-auto flex flex-col gap-[3.4cqw] px-[4cqw] pb-[5cqw]">
          <Traveller at={AT.ask}>{trip.ask}</Traveller>

          <p className="animate-pop px-[1cqw]" style={delay(AT.reply)}>
            {trip.reply}
          </p>

          <div className="grid grid-cols-2 gap-[3cqw]">
            {trip.picks.map((pick, i) => {
              const Icon = KIND_ICON[pick.kind]
              return (
                <div
                  key={pick.name}
                  className="animate-pop overflow-hidden rounded-[3.5cqw] bg-white/90 shadow-card dark:bg-white/10"
                  style={delay(AT.cards + i * AT.cardGap)}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <SafariScene crop={pick.crop} />
                    <span className={cn('absolute left-[2cqw] top-[2cqw] flex items-center justify-center rounded-full bg-white/90 text-ink', B.size)}>
                      <Icon className={B.glyph} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-[0.8cqw] p-[2.8cqw] leading-tight">
                    <span className="line-clamp-2 min-h-[11cqw] font-semibold">{pick.name}</span>
                    <span className="flex items-baseline justify-between gap-[1cqw]">
                      <span className={cn('truncate text-ink/55 dark:text-paper/60', T.detail)}>{pick.detail}</span>
                      {pick.price && <span className="font-semibold tabular-nums">{pick.price}</span>}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="animate-pop px-[1cqw]" style={delay(AT.offer)}>
            {trip.offer}
          </p>

          <Traveller at={AT.confirm}>{trip.confirm}</Traveller>

          {sends && (
            <div className={cn('animate-pop px-[1cqw]', T.detail)} style={delay(AT.sending)}>
              <Step
                scale="phone"
                start={AT.sending}
                end={AT.sent}
                text={trip.phoneWorking}
                done={<span className="truncate text-ink/80 dark:text-paper/80">{trip.phoneSent}</span>}
                badge={<StatusBadge scale="phone" tone="done" glyph={Check} />}
              />
            </div>
          )}

          <Composer scale="phone" placeholder={trip.composer} at={AT.header} />
        </div>
      </div>
    </PhoneFrame>
  )
}
