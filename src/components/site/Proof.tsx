import { ArrowRight } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

export function Proof() {
  return (
    <Section id={SECTION.proof} className="py-16 md:py-20">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.proof['H-8-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.proof['H-8-B']}</Lede>
        <p className="mt-6">
          <a
            href={PAGES.pilot}
            className="group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-link"
          >
            How a pilot runs
            <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </p>
      </div>
    </Section>
  )
}
