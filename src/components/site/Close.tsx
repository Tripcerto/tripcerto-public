import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

/* The close stands on the hero's living band with paper copy: the headline
   and the two ways in, the demo and the pilot page. */
export function Close() {
  return (
    <section id={SECTION.close} data-band className="relative scroll-mt-16 overflow-hidden">
      <Band />
      <div className="shell relative py-24 text-center md:py-32">
        <Heading className="mx-auto max-w-[44rem] text-paper">{home.close['H-9-A']}</Heading>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <a href={DEMO_URL}>
              {home.close['H-9-C']}
              <ArrowRight aria-hidden />
            </a>
          </Button>
          <a
            href={PAGES.pilot}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/50 bg-white/15 px-6 text-base font-semibold text-paper backdrop-blur-md transition-colors hover:bg-white/25"
          >
            {home.close['H-9-D']}
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
