import { ArrowRight } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Heading, Lede, Section } from '@/components/site/Section'
import { trust } from '@/content/trust'
import { DEMO_URL, PAGES, STATUS_URL } from '@/lib/links'

const ID = {
  moves: 'how-information-moves',
  decides: 'what-decides',
  access: 'who-can-reach-what',
  programme: 'security-programme',
  legal: 'terms-and-rights',
  status: 'live-status',
} as const

/* The trust page, for the technical buyer: how information moves as ruled
   rows, what decides a recommendation as three columns, who can reach what,
   the security programme with no certificate claimed, the legal position,
   the live status link, and the close. Words throughout. */
export function TrustPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          title={trust.hero['T-1-A']}
          lede={trust.hero['T-1-B']}
          primary={{ label: trust.hero['T-1-C'], href: DEMO_URL }}
          secondary={{ label: trust.hero['T-1-D'], href: `#${ID.moves}` }}
        />

        <Section id={ID.moves}>
          <div className="max-w-[44rem]">
            <Heading>{trust.moves['T-2-A']}</Heading>
            <Lede className="mt-5">{trust.moves['T-2-B']}</Lede>
          </div>
          <Rows rows={trust.moves.rows} />
        </Section>

        <Section id={ID.decides} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{trust.decides['T-3-A']}</Heading>
            <Lede className="mt-5">{trust.decides['T-3-B']}</Lede>
          </div>
          <ul role="list" className="mt-14 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-10 xl:gap-x-14">
            {trust.decides.columns.map(({ name, line }) => (
              <li key={name} className="border-t border-line pt-6">
                <h3 className="text-[19px] font-semibold">{name}</h3>
                <p className="mt-3 text-[16px] leading-[1.55] text-body/80">{line}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id={ID.access}>
          <div className="max-w-[44rem]">
            <Heading>{trust.access['T-7-A']}</Heading>
            <Lede className="mt-5">{trust.access['T-7-B']}</Lede>
          </div>
          <Rows rows={trust.access.rows} />
        </Section>

        <Section id={ID.programme} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{trust.programme['T-4-A']}</Heading>
            <Lede className="mt-5">{trust.programme['T-4-B']}</Lede>
          </div>
          <Rows rows={trust.programme.rows} />
        </Section>

        <Section id={ID.legal}>
          <div className="max-w-[44rem]">
            <Heading>{trust.legal['T-5-A']}</Heading>
            <Lede className="mt-5">{trust.legal['T-5-B']}</Lede>
          </div>
          <Rows rows={trust.legal.rows} />
        </Section>

        <Section id={ID.status} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{trust.status['T-6-A']}</Heading>
            <Lede className="mt-5">{trust.status['T-6-B']}</Lede>
            <a href={STATUS_URL} className="mt-8 inline-flex min-h-11 items-center gap-1 font-semibold text-link">
              {trust.status['T-6-C']}
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </Section>

        <Close
          heading={trust.close['T-8-A']}
          line={trust.close['T-8-B']}
          primary={{ label: trust.close['T-8-C'], href: DEMO_URL }}
          secondary={{ label: trust.close['T-8-D'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
