import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Section({
  id,
  className,
  children,
  tone = 'paper',
}: {
  id?: string
  className?: string
  children: ReactNode
  tone?: 'paper' | 'tint' | 'ink'
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-16 py-20 md:scroll-mt-[72px] md:py-28',
        tone === 'tint' && 'bg-soft',
        tone === 'ink' && 'bg-ink text-paper',
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  )
}

/* A product's name as a small glass pill with its glyph, in place of an
   eyebrow, so the heading under it can say what the product does without
   naming it again. */
export function ProductBadge({ glyph: Glyph, children }: { glyph: LucideIcon; children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[13px] font-semibold">
      <Glyph size={15} aria-hidden className="text-link" />
      {children}
    </p>
  )
}

export function Heading({
  as: Tag = 'h2',
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
}) {
  return (
    <Tag
      className={cn(
        'text-balance font-semibold tracking-[-0.02em]',
        Tag === 'h2' && 'text-[2rem] leading-[1.1] md:text-[2.75rem]',
        Tag === 'h3' && 'text-[1.375rem] leading-[1.2] md:text-2xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-pretty text-[17px] leading-[1.55] text-dim md:text-lg', className)}>{children}</p>
}
