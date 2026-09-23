import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { pilot } from '@/content/pilot'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

const MEASURES_ID = 'the-measures'

/* The pilot page, where a pricing page would normally sit: the five
   measures a pilot is judged on as ruled rows with the product each one
   belongs to, then the close (23 Sep sync). Words throughout; the frames
   belong to the product pages. */
export function PilotPage() {
  usePageAnalytics()
  return (
    <>
      <Nav current={PAGES.pilot} />
      <main>
        <PageHero
          title={pilot.hero['P-1-A']}
          lede={pilot.hero['P-1-B']}
          primary={{ label: pilot.hero['P-1-C'], href: DEMO_URL }}
        />

        <Section id={MEASURES_ID} tone="tint" heading={pilot.measures['P-3-A']}>
          <Rows rows={pilot.measures.rows} />
        </Section>

        <Close heading={pilot.close['P-6-A']} primary={{ label: pilot.close['P-6-B'], href: DEMO_URL }} />
      </main>
      <Footer />
    </>
  )
}
