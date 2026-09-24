import { ArrowRight } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Rows } from '@/components/site/Rows'
import { Section } from '@/components/site/Section'
import { trust } from '@/content/trust'
import { DEMO_URL, PAGES, STATUS_URL, TRUST_SECTION as ID } from '@/lib/links'

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

        <Section id={ID.moves} heading={trust.moves['T-2-A']} lede={trust.moves['T-2-B']}>
          <Rows rows={trust.moves.rows} />
        </Section>

        <Section id={ID.decides} tone="tint" heading={trust.decides['T-3-A']} lede={trust.decides['T-3-B']}>
          <ul role="list" className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-12">
            {trust.decides.columns.map(({ name, line }) => (
              <li key={name} className="border-t border-line pt-6">
                <h3 className="text-subhead">{name}</h3>
                <p className="mt-3 text-copy text-dim">{line}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id={ID.access} heading={trust.access['T-7-A']} lede={trust.access['T-7-B']}>
          <Rows rows={trust.access.rows} />
        </Section>

        <Section id={ID.programme} tone="tint" heading={trust.programme['T-4-A']} lede={trust.programme['T-4-B']}>
          <Rows rows={trust.programme.rows} />
        </Section>

        <Section id={ID.legal} heading={trust.legal['T-5-A']} lede={trust.legal['T-5-B']}>
          <Rows rows={trust.legal.rows} />
        </Section>

        <Section
          id={ID.status}
          tone="tint"
          heading={trust.status['T-6-A']}
          lede={trust.status['T-6-B']}
          action={
            <a href={STATUS_URL} className="inline-flex min-h-11 items-center gap-1 text-action text-link">
              {trust.status['T-6-C']}
              <ArrowRight size={16} aria-hidden />
            </a>
          }
        />

        <Close
          heading={trust.close['T-8-A']}
          primary={{ label: trust.close['T-8-C'], href: DEMO_URL }}
          secondary={{ label: trust.close['T-8-D'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
