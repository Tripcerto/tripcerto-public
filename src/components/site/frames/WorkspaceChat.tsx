import { Check, FileText, Mic, Paperclip, Volume2 } from 'lucide-react'
import { BAR, BAR_FAINT } from '@/components/site/frames/glyphs'
import { Bar, StellaLine } from '@/components/site/frames/StellaLine'
import { VoiceNote } from '@/components/site/frames/Voice'
import { delay } from '@/components/site/frames/motion'
import { cn } from '@/lib/utils'

/* Stella's pane with the conversation showing: the consultant drops the
   enquiry in as a file and a voice note, Stella reads them back and can
   be heard as well as read, and her next line is on its way. The
   composer at the foot carries the clip and the mic. Bars stand for the
   words. */

const MINE = 'self-end rounded-[1.8cqw] rounded-br-[0.6cqw] bg-ink/85 dark:bg-white/90'
const HERS = 'self-start rounded-[1.8cqw] rounded-bl-[0.6cqw] bg-white/80 dark:bg-white/12'
const SAID = 'bg-paper/35 dark:bg-ink/25'

export function WorkspaceChat() {
  return (
    <div className="flex flex-1 flex-col gap-[1.6cqw]">
      <StellaLine at={0.9} scale="window" />

      <div
        className={cn(
          'animate-pop mt-auto flex w-full items-center gap-[1.2cqw] border border-dashed border-paper/30 p-[1.3cqw] dark:border-ink/30',
          MINE,
        )}
        style={delay(1.1)}
      >
        <span className="flex size-[4cqw] shrink-0 items-center justify-center rounded-[0.9cqw] bg-paper/15 text-paper dark:bg-ink/10 dark:text-ink">
          <FileText className="size-[2.2cqw]" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[0.8cqw]">
          <Bar className={cn('h-[1.1cqw] w-[72%]', SAID)} />
          <Bar className="h-[0.9cqw] w-[40%] bg-paper/20 dark:bg-ink/15" />
        </span>
        <Check className="size-[1.8cqw] shrink-0 text-up" />
      </div>

      <div className={cn('animate-pop flex max-w-[92%] flex-col gap-[1cqw] p-[1.6cqw]', HERS)} style={delay(1.4)}>
        <Bar className={cn('h-[1.1cqw] w-[20cqw]', BAR)} />
        <Bar className={cn('h-[1.1cqw] w-[17cqw]', BAR)} />
        <span className="flex items-end justify-between gap-[1.2cqw]">
          <Bar className={cn('h-[1.1cqw] w-[12cqw]', BAR)} />
          <Volume2 className="size-[1.8cqw] shrink-0 text-ink/45 dark:text-paper/60" />
        </span>
      </div>

      <div className={cn('animate-pop px-[1.6cqw] py-[1.2cqw]', MINE)} style={delay(1.7)}>
        <VoiceNote scale="window" />
      </div>

      <div className={cn('animate-pop flex items-center gap-[0.7cqw] px-[1.6cqw] py-[1.4cqw]', HERS)} style={delay(2.1)}>
        {[0, 0.2, 0.4].map((d) => (
          <span key={d} className="animate-blink size-[0.9cqw] rounded-full bg-ink/50 dark:bg-paper" style={delay(d)} />
        ))}
      </div>

      <div
        className="animate-pop flex h-[4.4cqw] items-center rounded-full border border-ink/10 bg-white/70 pl-[1.8cqw] pr-[1.4cqw] dark:border-white/10 dark:bg-white/[0.06]"
        style={delay(0.9)}
      >
        <Bar className={cn('h-[1cqw] w-[38%]', BAR_FAINT)} />
        <span className="ml-auto flex items-center gap-[1cqw] text-ink/60 dark:text-paper/70">
          <Paperclip className="size-[2cqw]" />
          <Mic className="size-[2cqw]" />
        </span>
      </div>
    </div>
  )
}
