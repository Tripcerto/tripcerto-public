import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Whom the page is for, as a label in a pill above the hero's title: solid
   paper with ink in it, since white type the label's size would not clear
   the band. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('inline-flex rounded-full bg-paper px-3.5 py-1 text-label text-ink', className)}>{children}</p>
}
