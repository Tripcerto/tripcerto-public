import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A browser window. Children fill the viewport; swap the placeholder for a real Workspace capture later. */
export function WindowFrame({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <div className={cn('cursor-default select-none overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-frame', className)}>
      <div className="flex h-9 items-center gap-2 border-b border-ink/10 bg-tint/60 px-3">
        <span className="size-2.5 rounded-full bg-ink/15" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink/15" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink/15" aria-hidden />
        {title ? <span className="ml-3 font-mono text-[11px] text-muted">{title}</span> : null}
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
