import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Whom something is for, as a label in a pill above its title: the hero's
   audience on the band, a product's on the page. On the band the pill is
   solid paper with ink in it, since white type the label's size would not
   clear the band. */
export function Tag({ children, onBand = false, className }: { children: ReactNode; onBand?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex rounded-full border px-3.5 py-1 text-label',
        onBand ? 'border-transparent bg-paper text-ink' : 'border-line bg-soft text-dim',
        className,
      )}
    >
      {children}
    </p>
  )
}
