import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A phone bezel, as wide as whatever holds it. The bezel sizes in its own
   width, corners and rim included, and the screen is a size container, so
   what is drawn on it sizes itself in cqw: the whole phone scales like a
   screenshot would, and its corners never cut into the screen at a small
   size. Bezel and island tones are overridden by class. */
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
    <div className="@container w-full">
      <div
        className={cn(
          'relative aspect-[9/18.4] w-full cursor-default select-none overflow-hidden rounded-[14cqw] border-[length:2.2cqw] border-ink bg-paper shadow-frame',
          className,
        )}
      >
        <div
          className={cn('absolute left-1/2 top-[1.6%] z-10 h-[4.6%] w-[30%] -translate-x-1/2 rounded-full bg-ink', islandClassName)}
          aria-hidden
        />
        <div className="@container h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
