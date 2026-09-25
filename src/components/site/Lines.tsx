import { Fragment } from 'react'
import { cn } from '@/lib/utils'

/* Copy that is a string wraps where it falls; copy that is a list sets its
   own lines, each starting on a new one (a sentence to a line, say), and an
   empty entry leaves a blank line between two. The lines are joined by a
   space, so the text still reads, and is named, as one. */
export type Copy = string | readonly string[]

export function Lines({ text, className }: { text: Copy; className?: string }) {
  if (typeof text === 'string') return text
  return text.map((line, i) =>
    line === '' ? (
      <span key={i} aria-hidden className="block h-[1lh]" />
    ) : (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span className={cn('block', className)}>{line}</span>
      </Fragment>
    ),
  )
}
