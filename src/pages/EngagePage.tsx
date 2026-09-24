import { Check } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { InfoPackForm } from '@/components/site/InfoPackForm'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { Stage } from '@/components/site/Stage'
import { BriefCard } from '@/components/site/frames/BriefCard'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { delay } from '@/components/site/frames/motion'
import { engage } from '@/content/engage'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  sales: 'what-reaches-sales',
  business: 'on-your-site',
} as const

/* The Engage page: the opening on the band with the phone, the brief that
   reaches sales beside its frame, how it sits on the business's site as
   ruled rows, and the close. Every section shows the product or leads
   somewhere (23 Sep sync). */
export function EngagePage() {
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
              <PhoneScreen surface="band" sends />
            </div>
          }
        />

        <Section id={ID.sales} tone="tint" heading={engage.sales['E-4-A']} lede={engage.sales['E-4-B']}>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[26rem_400px] lg:justify-center lg:gap-16">
            <ul role="list" className="mx-auto max-w-[26rem] space-y-3 lg:mx-0">
              {engage.sales.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-copy text-dim">
                  <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-link" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Stage caption={engage.sales.caption} className="max-lg:mb-8">
              <Reveal className="w-full max-w-[400px]">
                <BriefCard />
              </Reveal>
            </Stage>
          </div>
        </Section>

        <Section id={ID.business} heading={engage.business['E-5-A']} lede={engage.business['E-5-B']}>
          <Rows rows={engage.business.rows} />
        </Section>

        <Close
          heading={engage.close['E-9-A']}
          form={<InfoPackForm pack="engage" />}
          secondary={{ label: engage.close['E-10-B'], href: DEMO_URL }}
        />
      </main>
      <Footer />
    </>
  )
}
