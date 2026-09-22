import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'

export function Audience() {
  return (
    <Section id={SECTION.audience} tone="tint">
      <div className="mx-auto max-w-[44rem] text-center">
        <Heading>{home.audience['H-7-A']}</Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem]">{home.audience['H-7-B']}</Lede>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {home.audience.cards.map(({ role, line }) => (
          <div
            key={role}
            className="rounded-lg border border-rule bg-paper p-6 transition-colors hover:border-ink/15 md:p-7"
          >
            <h3 className="text-[17px] font-semibold leading-snug">{role}</h3>
            <p className="mt-2 text-[15px] text-muted">{line}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
