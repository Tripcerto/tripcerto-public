import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A phone bezel. Children fill the screen; swap the placeholder for a real Engage capture later. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[9/19] w-[260px] overflow-hidden rounded-[2.4rem] border-[6px] border-ink bg-paper shadow-frame',
        className,
      )}
    >
      <div className="absolute left-1/2 top-2.5 z-10 h-[5%] max-h-5 w-[30%] -translate-x-1/2 rounded-full bg-ink" aria-hidden />
      <div className="h-full w-full overflow-hidden">{children}</div>
    </div>
  )
}
