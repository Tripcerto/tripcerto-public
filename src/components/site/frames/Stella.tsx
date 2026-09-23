import { Sparkles } from 'lucide-react'
import { BADGE, type FrameScale } from '@/components/site/frames/type'
import { cn } from '@/lib/utils'

/* The assistant's mark, at the one badge size of its frame. */
export function StellaMark({ scale, className }: { scale: FrameScale; className?: string }) {
  const b = BADGE[scale]
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink', b.size, className)}>
      <Sparkles className={b.glyph} />
    </span>
  )
}
