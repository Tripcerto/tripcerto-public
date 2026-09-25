import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type Moment = { year: string; line: string }

const NOW = 'ring-4 ring-link/20'

/* A story's years on one rail, a pink dot at each. From lg the years sit
   in turn above and below the rail, so each line has two columns to read
   in rather than one. Every year stands beside its dot, the years above
   the rail in one row and the years below it in another, and each line
   runs away from the rail, centred on its dot, at one measure: the lines
   are written to fill two lines of it (about.ts, held by site.test.tsx),
   so every entry stands the same height on both sides of the rail. The
   rail fades in before the first year and out after the last, whose dot
   is ringed: that year is now. Below lg the rail runs down the left, the
   year over its line. */
export function Timeline({ moments }: { moments: readonly Moment[] }) {
  const last = moments.length - 1
  const at = (i: number) => `${((i + 1) / (last + 2)) * 100}%`
  return (
    <ol
      role="list"
      style={{ '--n': moments.length + 1, '--in': at(0), '--out': at(last) } as CSSProperties}
      className="mx-auto grid max-w-[56rem] grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:grid-rows-[auto_0.75rem_auto] lg:gap-0"
    >
      {moments.map(({ year, line }, i) => {
        const above = i % 2 === 0
        return (
          <li
            key={`${year} ${line}`}
            style={{ '--c': i + 1, '--r': above ? 1 : 3 } as CSSProperties}
            className={cn(
              'relative pl-8 lg:pl-0 lg:text-center lg:[grid-column:var(--c)/span_2] lg:[grid-row:var(--r)]',
              above ? 'lg:self-end lg:pb-4' : 'lg:self-start lg:pt-4',
            )}
          >
            <span aria-hidden className={cn('absolute left-0 top-1.5 z-10 size-3 rounded-full bg-link lg:hidden', i === last && NOW)} />
            {i < last && <span aria-hidden className="absolute -bottom-8 left-[5.5px] top-6 w-px bg-line lg:hidden" />}
            <div className={cn('lg:flex lg:gap-1', above ? 'lg:flex-col-reverse' : 'lg:flex-col')}>
              <h3 className="text-subhead tabular-nums">{year}</h3>
              <p className="mt-1 text-copy text-dim text-pretty lg:mx-auto lg:mt-0 lg:max-w-[15.5rem] lg:text-balance">{line}</p>
            </div>
          </li>
        )
      })}
      <li aria-hidden className="relative hidden lg:col-span-full lg:row-start-2 lg:block">
        <span className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(to_right,transparent,var(--color-line)_var(--in),var(--color-line)_var(--out),transparent)]" />
        {moments.map(({ year, line }, i) => (
          <span
            key={`${year} ${line}`}
            style={{ left: at(i) }}
            className={cn('absolute top-0 z-10 size-3 -translate-x-1/2 rounded-full bg-link', i === last && NOW)}
          />
        ))}
      </li>
    </ol>
  )
}
