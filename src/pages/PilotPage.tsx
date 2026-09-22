import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Heading, Lede, Section } from '@/components/site/Section'
import { pilot } from '@/content/pilot'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL } from '@/lib/links'

const ID = {
  runs: 'how-it-runs',
  measures: 'what-we-measure',
  needs: 'what-we-need',
  after: 'what-happens-after',
} as const

/* The pilot page, where a pricing page would normally sit: how a pilot
   runs as three numbered columns, the five measures as ruled rows with the
   product each one belongs to, what we need, what happens after, and the
   close. Words throughout; the frames belong to the product pages. */
export function PilotPage() {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main>
        <PageHero
          title={pilot.hero['P-1-A']}
          lede={pilot.hero['P-1-B']}
          primary={{ label: pilot.hero['P-1-C'], href: DEMO_URL }}
          secondary={{ label: pilot.hero['P-1-D'], href: `#${ID.runs}` }}
        />

        <Section id={ID.runs}>
          <div className="max-w-[44rem]">
            <Heading>{pilot.runs['P-2-A']}</Heading>
            <Lede className="mt-5">{pilot.runs['P-2-B']}</Lede>
          </div>
          <ol role="list" className="mt-14 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-10 xl:gap-x-14">
            {pilot.runs.steps.map(({ name, line }, i) => (
              <li key={name} className="border-t border-line pt-6">
                <p className="text-[13px] font-semibold text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-[19px] font-semibold">{name}</h3>
                <p className="mt-3 text-[16px] leading-[1.55] text-body/80">{line}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id={ID.measures} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{pilot.measures['P-3-A']}</Heading>
            <Lede className="mt-5">{pilot.measures['P-3-B']}</Lede>
          </div>
          <ul role="list" className="mt-12 divide-y divide-line md:mt-14">
            {pilot.measures.rows.map(({ name, product, line }) => (
              <li key={name} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12 md:gap-y-0">
                <div>
                  <h3 className="text-[17px] leading-[1.4] font-semibold">{name}</h3>
                  <p className="mt-1 text-[14px] leading-[1.5] text-dim">{product}</p>
                </div>
                <p className="text-[16px] leading-[1.55] text-body/80">{line}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id={ID.needs}>
          <div className="max-w-[44rem]">
            <Heading>{pilot.needs['P-4-A']}</Heading>
            <Lede className="mt-5">{pilot.needs['P-4-B']}</Lede>
          </div>
        </Section>

        <Section id={ID.after} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{pilot.after['P-5-A']}</Heading>
            <Lede className="mt-5">{pilot.after['P-5-B']}</Lede>
          </div>
        </Section>

        <Close heading={pilot.close['P-6-A']} primary={{ label: pilot.close['P-6-B'], href: DEMO_URL }} />
      </main>
      <Footer />
    </>
  )
}
