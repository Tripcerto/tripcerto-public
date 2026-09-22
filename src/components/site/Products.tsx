import { ArrowRight } from 'lucide-react'
import { Eyebrow, Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

const CARDS = [
  { name: 'Engage', copy: home.products.engage, href: PAGES.engage },
  { name: 'Workspace', copy: home.products.workspace, href: PAGES.workspace },
] as const

export function Products() {
  return (
    <Section id={SECTION.products} className="pt-4 md:pt-8">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.products['H-3-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.products['H-3-B']}</Lede>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {CARDS.map(({ name, copy, href }) => (
          <div
            key={name}
            className="rounded-lg border border-rule bg-tint/60 p-6 transition-colors hover:border-ink/15 md:p-7"
          >
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <Heading as="h3" className="mt-3">
              {copy.title}
            </Heading>
            <p className="mt-3 text-muted">{copy.line}</p>
            <p className="mt-5">
              <a
                href={href}
                className="group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-primary-deep"
              >
                More about {name}
                <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
