import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Advisers, Founders } from '@/components/site/Founders'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { about, advisers, founders } from '@/content/about'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const ID = {
  story: 'why-tripcerto',
  company: 'the-company',
} as const

/* The About page: what Tripcerto is, in Charlie's line, why it was
   started, the two founders, the advisers, and the company's registered facts.
   Words and portraits; the frames belong to the product pages. */
export function AboutPage() {
  usePageAnalytics()
  return (
    <>
      <Nav current={PAGES.about} />
      <main>
        <PageHero
          title={about.hero['A-1-A']}
          lede={about.hero['A-1-B']}
          primary={{ label: about.hero['A-1-C'], href: DEMO_URL }}
          secondary={{ label: about.hero['A-1-D'], href: `#${SECTION.founders}` }}
        />

        <Section id={ID.story} heading={about.story['A-2-A']} lede={about.story['A-2-B']} />

        <Section id={SECTION.founders} tone="tint" heading={about.founders['A-3-A']}>
          <Founders people={founders} />
        </Section>

        <Section id={SECTION.advisers} heading={about.advisers['A-6-A']}>
          <Advisers people={advisers} />
        </Section>

        <Section id={ID.company} tone="tint" heading={about.company['A-4-A']}>
          <div className="mx-auto max-w-[56rem]">
            <Rows rows={about.company.rows} />
          </div>
        </Section>

        <Close
          heading={about.close['A-5-A']}
          primary={{ label: about.close['A-5-B'], href: DEMO_URL }}
          secondary={{ label: about.close['A-5-C'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
