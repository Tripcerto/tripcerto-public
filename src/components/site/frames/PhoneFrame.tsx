import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A phone bezel. The screen is a size container, so what is drawn on it
   sizes itself in cqw and scales with the phone like a screenshot would.
   Bezel and island tones are overridden by class. */
export function PhoneFrame({
  children,
  className,
  islandClassName,
}: {
  children: ReactNode
  className?: string
  islandClassName?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-[9/18.4] w-[260px] cursor-default select-none overflow-hidden rounded-[2.4rem] border-[6px] border-ink bg-paper shadow-frame max-sm:rounded-[1.8rem]',
        className,
      )}
    >
      <div
        className={cn('absolute left-1/2 top-[1.6%] z-10 h-[4.6%] w-[30%] -translate-x-1/2 rounded-full bg-ink', islandClassName)}
        aria-hidden
      />
      <div className="@container h-full w-full overflow-hidden">{children}</div>
    </div>
  )
}
