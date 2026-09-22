import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { Heading, Lede, ProductBadge, Section } from '@/components/site/Section'
import { Reveal } from '@/components/site/Reveal'
import { Stage } from '@/components/site/Stage'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

export function EngageSection() {
  return (
    <Section id={SECTION.engage} className="py-16 md:py-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:order-last">
          <ProductBadge glyph={MessageCircle}>Engage</ProductBadge>
          <Heading className="mt-5">{home.engage['H-4-A']}</Heading>
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
        <Stage caption={home.engage.caption} className="max-lg:mb-8">
          <Reveal className="w-[min(64%,320px)]">
            <PhoneScreen />
          </Reveal>
        </Stage>
      </div>
    </Section>
  )
}
