import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { Team } from '@/components/site/Team'
import { Timeline } from '@/components/site/Timeline'
import { about } from '@/content/about'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const ID = {
  story: 'why-tripcerto',
  company: 'the-company',
} as const

/* The About page: what Tripcerto is, in Charlie's line, why it was
   started and the years that led to it, the team, and the company's
   registered facts.
   Words and portraits; the frames belong to the product pages. */
export function AboutPage() {
  return (
    <>
      <Nav current={PAGES.about} />
      <main>
        <PageHero
          title={about.hero['A-1-A']}
          lede={about.hero['A-1-B']}
          primary={{ label: about.hero['A-1-C'], href: DEMO_URL }}
          secondary={{ label: about.hero['A-1-D'], href: `#${SECTION.team}` }}
        />

        <Section id={ID.story} heading={about.story['A-2-A']} lede={about.story['A-2-B']}>
          <Timeline moments={about.story.timeline} />
        </Section>

        <Team tone="tint" />

        <Section id={ID.company} heading={about.company['A-4-A']}>
          <Rows rows={about.company.rows} />
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
