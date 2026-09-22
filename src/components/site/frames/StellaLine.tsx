import { Sparkles } from 'lucide-react'
import { BAR } from '@/components/site/frames/glyphs'
import { delay } from '@/components/site/frames/motion'
import { cn } from '@/lib/utils'

export function Bar({ className }: { className: string }) {
  return <span className={cn('block rounded-full', className)} />
}

const STELLA = {
  window: { root: 'gap-[1.4cqw]', mark: 'size-[3.8cqw]', icon: 'size-[2.1cqw]', bar: 'h-[1.3cqw] w-[62%]' },
  phone: { root: 'gap-[2.6cqw]', mark: 'size-[7.5cqw]', icon: 'size-[4.2cqw]', bar: 'h-[2.4cqw] w-[58%]' },
} as const

/* Stella, as one line: her mark and a single bar. The same line sits in
   the Workspace pane and on the phone. */
export function StellaLine({ at, scale, className }: { at: number; scale: keyof typeof STELLA; className?: string }) {
  const t = STELLA[scale]
  return (
    <div className={cn('animate-pop flex items-center', t.root, className)} style={delay(at)}>
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-ink text-paper dark:bg-paper dark:text-ink', t.mark)}>
        <Sparkles className={t.icon} />
      </span>
      <Bar className={cn(t.bar, BAR)} />
    </div>
  )
}
