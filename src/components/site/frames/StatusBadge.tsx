import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BADGE, type FrameScale } from '@/components/site/frames/type'
import { cn } from '@/lib/utils'

/* Every tick, clock and flag in both frames: one size per frame, solid
   fills (so nothing behind shows through), and a heavier stroke than the
   line icons so a tick reads at a glance. */
const TONE = {
  done: 'bg-up-tint text-up dark:bg-up dark:text-paper',
  waiting: 'bg-[color-mix(in_srgb,var(--color-ink)_7%,white)] text-muted dark:bg-[#3a2a41] dark:text-paper/70',
  flag: 'bg-primary text-paper',
} as const

export type BadgeTone = keyof typeof TONE

export function StatusBadge({
  scale,
  tone,
  glyph: Glyph,
  className,
  style,
}: {
  scale: FrameScale
  tone: BadgeTone
  glyph: LucideIcon
  className?: string
  style?: CSSProperties
}) {
  const b = BADGE[scale]
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full', b.size, TONE[tone], className)} style={style}>
      <Glyph className={b.glyph} strokeWidth={3} />
    </span>
  )
}
