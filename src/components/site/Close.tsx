import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { SECTION } from '@/lib/links'

export type CloseLink = { label: string; href: string }

/* The close stands on the hero's living band with paper copy: the headline,
   a line under it where the page has one, and the ways in. */
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
      <div className="shell relative py-24 text-center md:py-32">
        <Heading className="mx-auto max-w-[44rem] text-paper">{heading}</Heading>
        {line && <p className="mx-auto mt-6 max-w-[40rem] text-lg leading-[1.55] text-paper/85">{line}</p>}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <a href={primary.href}>
              {primary.label}
              <ArrowRight aria-hidden />
            </a>
          </Button>
          {secondary && (
            <a
              href={secondary.href}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/50 bg-white/15 px-6 text-base font-semibold text-paper backdrop-blur-md transition-colors hover:bg-white/25"
            >
              {secondary.label}
              <ArrowRight size={16} aria-hidden />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
