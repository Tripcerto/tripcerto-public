import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { InfoPackForm } from '@/components/site/InfoPackForm'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { pilot } from '@/content/pilot'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  includes: 'what-a-pilot-includes',
  measures: 'the-measures',
} as const

/* The pilot page sells the chance to try one: how quickly it starts, with
   the pilot's information pack to ask for at once and a call under it; what
   a pilot includes as four ruled columns, each centred under the centred
   head; the five measures it can be judged on as ruled rows with the
   product each belongs to; then the pack again in the close. Words
   throughout; the frames belong to the product pages. */
export function PilotPage() {
  return (
    <>
      <Nav current={PAGES.pilot} />
      <main>
        <PageHero
          tag={pilot.hero.tag}
          title={pilot.hero['P-1-A']}
          lede={pilot.hero['P-1-B']}
          form={<InfoPackForm pack="pilot" label={pilot.hero['P-1-E']} />}
          secondary={{ label: pilot.hero['P-1-C'], href: DEMO_URL }}
        />

        <Section id={ID.includes} heading={pilot.includes['P-7-A']}>
          <ul role="list" className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4">
            {pilot.includes.columns.map(({ name, line }) => (
              <li key={name} className="border-t border-line pt-6 text-center">
                <h3 className="text-subhead">{name}</h3>
                <p className="mt-3 text-copy text-dim">{line}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id={ID.measures} tone="tint" heading={pilot.measures['P-3-A']}>
          <Rows rows={pilot.measures.rows} />
        </Section>

        <Close
          heading={pilot.close['P-6-A']}
          form={<InfoPackForm pack="pilot" />}
          secondary={{ label: pilot.close['P-6-B'], href: DEMO_URL }}
        />
      </main>
      <Footer />
    </>
  )
}
