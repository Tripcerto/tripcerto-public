import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type Moment = { year: string; line: string }

/* A story's years on a hairline rail, a pink dot at each: the year, then
   one line on what happened. Below lg the rail runs down the left, as the
   home page's journey steps once did; from lg it runs across, each year
   centred on its dot, the rail stopping at the first and last. */
export function Timeline({ moments }: { moments: readonly Moment[] }) {
  const last = moments.length - 1
  return (
    <ol
      role="list"
      style={{ '--n': moments.length } as CSSProperties}
      className="mx-auto grid max-w-[56rem] grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-0"
    >
      {moments.map(({ year, line }, i) => (
        <li key={`${year} ${line}`} className="relative pl-8 lg:px-3 lg:pl-3 lg:pt-8 lg:text-center">
          <span aria-hidden className="absolute left-0 top-1.5 z-10 size-3 rounded-full bg-link lg:left-1/2 lg:top-0 lg:-translate-x-1/2" />
          {i < last && <span aria-hidden className="absolute -bottom-8 left-[5.5px] top-6 w-px bg-line lg:hidden" />}
          <span
            aria-hidden
            className={cn(
              'absolute top-[5.5px] hidden h-px bg-line lg:block',
              i === 0 ? 'left-1/2 right-0' : i === last ? 'left-0 right-1/2' : 'inset-x-0',
            )}
          />
          <h3 className="text-subhead tabular-nums">{year}</h3>
          <p className="mt-1 text-copy text-dim text-pretty">{line}</p>
        </li>
      ))}
    </ol>
  )
}
