import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  id,
  className,
  children,
  tone = 'page',
  wide = false,
}: {
  id?: string
  className?: string
  children: ReactNode
  tone?: 'page' | 'tint'
  /* The hero's width from xl, past the shell. */
  wide?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-16 py-20 md:scroll-mt-[72px] md:py-28',
        tone === 'tint' && 'bg-soft',
        className,
      )}
    >
      <div className={cn('shell', wide && 'xl:max-w-[1480px]')}>{children}</div>
    </section>
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
