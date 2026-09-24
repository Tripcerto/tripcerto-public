import { Fragment } from 'react'
import { cn } from '@/lib/utils'

/* Copy that is a string wraps where it falls; copy that is a list sets its
   own lines, each starting on a new one (a sentence to a line, say). The
   lines are joined by a space, so the text still reads, and is named, as
   one. */
export type Copy = string | readonly string[]

export function Lines({ text, className }: { text: Copy; className?: string }) {
  if (typeof text === 'string') return text
  return text.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && ' '}
      <span className={cn('block', className)}>{line}</span>
    </Fragment>
  ))
}
