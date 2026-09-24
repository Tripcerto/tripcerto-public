import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { SECTION_PAD, SectionHead } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/events'
import { DEMO_URL, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

export type CloseLink = { label: string; href: string }

/* The close stands on the hero's living band with paper copy, in the same
   rhythm as every other section: the headline, a line under it where the
   page has one, and the ways in. */
export function Close({
  heading,
  line,
  primary,
  secondary,
}: {
  heading: string
  line?: string
  primary: CloseLink
  secondary?: CloseLink
}) {
  return (
    <section id={SECTION.close} data-band className="relative overflow-hidden">
      <Band />
      <div className={cn('shell relative', SECTION_PAD)}>
        <SectionHead
          onBand
          heading={heading}
          lede={line}
          action={
            <>
              <Button asChild variant="accent" size="lg">
                <a href={primary.href} onClick={primary.href === DEMO_URL ? () => trackEvent('demo_click', { button: 'close' }) : undefined}>
                  {primary.label}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              {secondary && (
                <a
                  href={secondary.href}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/50 bg-white/15 px-6 text-action text-paper backdrop-blur-md transition-colors hover:bg-white/25"
                >
                  {secondary.label}
                  <ArrowRight size={16} aria-hidden />
                </a>
              )}
            </>
          }
        />
      </div>
    </section>
  )
}
