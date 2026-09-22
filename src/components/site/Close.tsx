import { Fragment } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import { Heading, Lede } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

/* The hero's pill, on the same band. */
const PILL =
  'inline-flex h-9 items-center gap-2 rounded-full border border-white/50 bg-white/15 pl-4 pr-3 text-[14px] font-medium text-paper backdrop-blur-md transition-colors hover:bg-white/25'

/* The close stands on the hero's living band with paper copy, opens with
   the Pilot pill, and carries the pilot's measures as one line: proof that
   cannot yet be backed with numbers becomes the call. */
export function Close() {
  return (
    <section id={SECTION.close} className="relative scroll-mt-16 overflow-hidden">
      <Band />
      <div className="shell relative py-20 text-center md:py-28">
        <a href={PAGES.pilot} className={PILL}>
          Pilot
          <span className="text-paper/50" aria-hidden>
            ·
          </span>
          {home.close['H-9-D']}
          <ChevronRight size={14} aria-hidden />
        </a>
        <Heading className="mx-auto mt-8 max-w-[40rem] text-paper">{home.close['H-9-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem] text-paper/85">{home.close['H-9-B']}</Lede>
        <p className="mx-auto mt-8 max-w-[44rem] text-[14px] text-paper/75">
          {home.proof['H-8-A']}:{' '}
          {home.proof.measures.map((measure, i) => (
            <Fragment key={measure}>
              {i > 0 && ' · '}
              <span className="whitespace-nowrap">{measure}</span>
            </Fragment>
          ))}
        </p>
        <Button asChild variant="accent" size="lg" className="mt-10">
          <a href={DEMO_URL}>
            {home.close['H-9-C']}
            <ArrowRight aria-hidden />
          </a>
        </Button>
      </div>
    </section>
  )
}
