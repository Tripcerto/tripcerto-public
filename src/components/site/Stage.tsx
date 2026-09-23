import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Where a product frame stands: no box, a pool of the band's light behind
   it and any caption hung underneath, out of the flow so the frame stays
   centred against the copy beside it. The pool overruns the figure only
   vertically; sideways it would run past the viewport and scroll the page. */
export function Stage({ caption, className, children }: { caption?: string; className?: string; children: ReactNode }) {
  return (
    <figure className={cn('relative isolate flex items-center justify-center', className)}>
      <span aria-hidden className="bg-glow absolute inset-x-0 -inset-y-[15%] -z-10 rounded-full" />
      {children}
      {caption && <figcaption className="absolute inset-x-0 top-full mt-5 text-center text-[13px] text-dim">{caption}</figcaption>}
    </figure>
  )
}
