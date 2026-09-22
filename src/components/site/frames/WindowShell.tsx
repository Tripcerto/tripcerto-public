import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/* A glass browser window with a 4:3 body. Frosted by day, smoked in dark
   mode. The body is a size container, so what is drawn inside sizes itself
   in cqw and scales with the window. */
export function WindowShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'cursor-default select-none overflow-hidden rounded-2xl border border-white/60 bg-white/25 text-ink shadow-frame backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-ink/70 dark:text-paper',
        className,
      )}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-white/50 px-3 sm:h-11 sm:gap-2 sm:px-4 dark:border-white/10">
        <span className="size-2 rounded-full bg-ink/20 sm:size-2.5 dark:bg-white/25" aria-hidden />
        <span className="size-2 rounded-full bg-ink/20 sm:size-2.5 dark:bg-white/25" aria-hidden />
        <span className="size-2 rounded-full bg-ink/20 sm:size-2.5 dark:bg-white/25" aria-hidden />
        <span className="ml-auto flex h-6 w-28 items-center gap-1.5 rounded-md border border-white/70 bg-white/50 px-2 text-[11px] text-ink/60 sm:h-7 sm:w-44 sm:text-[12px] dark:border-white/15 dark:bg-white/10 dark:text-paper/60">
          <Search className="size-3" aria-hidden />
          Search
        </span>
      </div>
      <div className="@container aspect-[4/3]">{children}</div>
    </div>
  )
}
