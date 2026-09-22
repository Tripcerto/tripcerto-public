import { ArrowRight, Check } from 'lucide-react'
import { Eyebrow, Heading, Lede, Section } from '@/components/site/Section'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

export function EngageSection() {
  return (
    <Section id={SECTION.engage} className="pt-4 md:pt-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Engage</Eyebrow>
          <Heading className="mt-3">{home.engage['H-4-A']}</Heading>
          <Lede className="mt-5 max-w-[40rem]">{home.engage['H-4-B']}</Lede>
          <ul role="list" className="mt-8 space-y-3">
            {home.engage.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base text-body">
                <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-link" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href={PAGES.engage}
              className="group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-link"
            >
              More about Engage
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </p>
        </div>
        <figure className="lg:order-first">
          <div className="flex justify-center rounded-xl bg-soft p-8 md:p-12">
            <div className="w-[240px]">
              <PhoneScreen />
            </div>
          </div>
          <figcaption className="mt-4 text-center text-[13px] text-dim">{home.engage.caption}</figcaption>
        </figure>
      </div>
    </Section>
  )
}
