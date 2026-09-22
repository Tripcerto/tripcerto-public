import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONE = {
  light: {
    shell: 'border-white/60 bg-white/25 text-ink',
    chrome: 'border-white/50',
    dot: 'bg-ink/20',
    title: 'text-ink/70',
    search: 'border-white/70 bg-white/50 text-ink/60',
  },
  dark: {
    shell: 'border-white/15 bg-ink/70 text-paper',
    chrome: 'border-white/10',
    dot: 'bg-white/25',
    title: 'text-paper/70',
    search: 'border-white/15 bg-white/10 text-paper/60',
  },
} as const

/* A glass browser window with a 4:3 body. The body is a size container, so
   what is drawn inside sizes itself in cqw and scales with the window. */
export function WindowShell({
  children,
  className,
  tone = 'light',
  title = 'Workspace',
}: {
  children: ReactNode
  className?: string
  tone?: keyof typeof TONE
  title?: string
}) {
  const t = TONE[tone]
  return (
    <div className={cn('cursor-default select-none overflow-hidden rounded-2xl border shadow-frame backdrop-blur-2xl backdrop-saturate-150', t.shell, className)}>
      <div className={cn('flex h-9 items-center gap-1.5 border-b px-3 sm:h-11 sm:gap-2 sm:px-4', t.chrome)}>
        <span className={cn('size-2 rounded-full sm:size-2.5', t.dot)} aria-hidden />
        <span className={cn('size-2 rounded-full sm:size-2.5', t.dot)} aria-hidden />
        <span className={cn('size-2 rounded-full sm:size-2.5', t.dot)} aria-hidden />
        <span className={cn('ml-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] sm:ml-3 sm:text-[11px]', t.title)}>{title}</span>
        <span className={cn('ml-auto flex h-6 w-28 items-center gap-1.5 rounded-md border px-2 text-[11px] sm:h-7 sm:w-44 sm:text-[12px]', t.search)}>
          <Search className="size-3" aria-hidden />
          Search
        </span>
      </div>
      <div className="@container aspect-[4/3]">{children}</div>
    </div>
  )
}
