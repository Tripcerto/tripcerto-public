import { Mic, Paperclip } from 'lucide-react'
import { ICON, TYPE, type FrameScale } from '@/components/site/frames/type'
import { delay } from '@/components/site/frames/motion'
import { cn } from '@/lib/utils'

const FIELD = {
  phone: 'h-[10.4cqw] gap-[2.4cqw] pl-[4cqw] pr-[3cqw]',
  window: 'h-[4.6cqw] gap-[1.1cqw] pl-[1.7cqw] pr-[1.3cqw]',
} as const satisfies Partial<Record<FrameScale, string>>

/* A chat's input, drawn as a phone's messaging app draws its own: one white
   field with a hairline edge, its placeholder set at the chat's own size
   and in grey, and its controls inside it at the right. The traveller's
   chat has the mic; Workspace also takes a file (`attach`). */
export function Composer({
  scale,
  placeholder,
  at,
  attach = false,
  className,
}: {
  scale: keyof typeof FIELD
  placeholder: string
  at: number
  attach?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'animate-pop flex shrink-0 items-center rounded-full border border-ink/15 bg-white text-ink/40 dark:border-white/15 dark:bg-white/[0.08] dark:text-paper/45',
        FIELD[scale],
        TYPE[scale].text,
        className,
      )}
      style={delay(at)}
    >
      <span className="min-w-0 truncate">{placeholder}</span>
      <span className="ml-auto flex shrink-0 items-center gap-[inherit] text-ink/50 dark:text-paper/60">
        {attach && <Paperclip className={ICON[scale]} />}
        <Mic className={ICON[scale]} />
      </span>
    </div>
  )
}
