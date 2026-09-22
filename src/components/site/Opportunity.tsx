import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'

export function Opportunity() {
  return (
    <Section id={SECTION.opportunity} tone="tint">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.opportunity['H-2-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.opportunity['H-2-B']}</Lede>
      </div>
    </Section>
  )
}
