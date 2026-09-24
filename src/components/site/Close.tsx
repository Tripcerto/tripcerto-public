import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { SECTION_PAD, SectionHead } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/events'
import { DEMO_URL, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

export type CloseLink = { label: string; href: string }

/* The close stands on the hero's living band with paper copy, in the same
   rhythm as every other section: one short headline, on one line from a
   tablet up and with nothing under it, then the ways in: the two buttons,
   or a form (an information pack) with the secondary way in as a link
   under it. */
export function Close({
  heading,
  primary,
  form,
  secondary,
}: {
  heading: string
  primary?: CloseLink
  form?: ReactNode
  secondary?: CloseLink
}) {
  const demo = (link: CloseLink) => (link.href === DEMO_URL ? () => trackEvent('demo_click', { button: 'close' }) : undefined)
  return (
    <section id={SECTION.close} data-band className="relative overflow-hidden">
      <Band />
      <div className={cn('shell relative', SECTION_PAD)}>
        <SectionHead
          onBand
          heading={heading}
          action={
            form ? (
              <div className="flex w-full flex-col items-center gap-2">
                {form}
                {secondary && (
                  <a href={secondary.href} onClick={demo(secondary)} className="inline-flex min-h-11 items-center gap-1 text-action text-paper">
                    {secondary.label}
                    <ArrowRight size={16} aria-hidden />
                  </a>
                )}
              </div>
            ) : (
              <>
                {primary && (
                  <Button asChild variant="accent" size="lg">
                    <a href={primary.href} onClick={demo(primary)}>
                      {primary.label}
                      <ArrowRight aria-hidden />
                    </a>
                  </Button>
                )}
                {secondary && (
                  <a
                    href={secondary.href}
                    onClick={demo(secondary)}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/50 bg-white/15 px-6 text-action text-paper backdrop-blur-md transition-colors hover:bg-white/25"
                  >
                    {secondary.label}
                    <ArrowRight size={16} aria-hidden />
                  </a>
                )}
              </>
            )
          }
        />
      </div>
    </section>
  )
}
