import { Mic, Plus } from 'lucide-react'
import { ICON, TYPE, type FrameScale } from '@/components/site/frames/type'
import { delay } from '@/components/site/frames/motion'
import { cn } from '@/lib/utils'

const SIZE = {
  phone: { gap: 'gap-[2.2cqw]', add: 'size-[8.6cqw]', plus: 'size-[5cqw]', field: 'h-[8.6cqw] pl-[3.4cqw] pr-[2.4cqw]' },
  window: { gap: 'gap-[0.9cqw]', add: 'size-[3.7cqw]', plus: 'size-[2.1cqw]', field: 'h-[3.7cqw] pl-[1.5cqw] pr-[1.1cqw]' },
} as const satisfies Partial<Record<FrameScale, Record<string, string>>>

/* A chat's input, drawn as a phone's messaging app draws its own: a round
   add button, then a white field with a hairline edge, its placeholder in
   grey and the mic inside it at the right. The phone and the Workspace
   pane draw the same input, each at its own scale. */
export function Composer({
  scale,
  placeholder,
  at,
  className,
}: {
  scale: keyof typeof SIZE
  placeholder: string
  at: number
  className?: string
}) {
  const S = SIZE[scale]
  return (
    <div className={cn('animate-pop flex shrink-0 items-center', S.gap, TYPE[scale].detail, className)} style={delay(at)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-ink/60 dark:bg-white/10 dark:text-paper/70',
          S.add,
        )}
      >
        <Plus className={S.plus} strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          'flex min-w-0 flex-1 items-center rounded-full border border-ink/15 bg-white text-ink/40 dark:border-white/15 dark:bg-white/[0.08] dark:text-paper/45',
          S.field,
        )}
      >
        <span className="truncate">{placeholder}</span>
        <Mic className={cn('ml-auto shrink-0 text-ink/45 dark:text-paper/55', ICON[scale])} />
      </span>
    </div>
  )
}
