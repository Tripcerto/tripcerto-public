import { Check } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { Heading, Lede, Section } from '@/components/site/Section'
import { Stage } from '@/components/site/Stage'
import { BriefCard } from '@/components/site/frames/BriefCard'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { delay } from '@/components/site/frames/motion'
import { engage } from '@/content/engage'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  sales: 'what-reaches-sales',
} as const

/* The Engage page: the opening on the band with the phone, the brief that
   reaches sales beside its frame, and the close. Every section shows the
   product or leads somewhere (23 Sep sync). */
export function EngagePage() {
  usePageAnalytics()
  return (
    <>
      <Nav current={PAGES.engage} />
      <main>
        <PageHero
          title={engage.hero['E-1-A']}
          lede={engage.hero['E-1-B']}
          primary={{ label: engage.hero['E-1-C'], href: DEMO_URL }}
          secondary={{ label: engage.hero['E-1-D'], href: `#${ID.sales}` }}
          visual={
            <div className="animate-float w-[min(60%,280px)]" style={delay(1.6)}>
              <PhoneScreen />
            </div>
          }
        />

        <Section id={ID.sales} tone="tint" className="py-16 md:py-28">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[6fr_5fr] lg:gap-16">
            <div>
              <Heading>{engage.sales['E-4-A']}</Heading>
              <Lede className="mt-5 max-w-[40rem]">{engage.sales['E-4-B']}</Lede>
              <ul role="list" className="mt-8 space-y-3">
                {engage.sales.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base text-body">
                    <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-link" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Stage caption={engage.sales.caption} className="max-lg:mb-8">
              <Reveal className="w-full max-w-[400px]">
                <BriefCard />
              </Reveal>
            </Stage>
          </div>
        </Section>

        <Close
          heading={engage.close['E-9-A']}
          line={engage.close['E-9-B']}
          primary={{ label: engage.close['E-10-B'], href: DEMO_URL }}
          secondary={{ label: engage.close['E-10-C'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
