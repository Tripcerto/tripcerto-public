import { ArrowRight } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { SECTION_PAD } from '@/components/site/Section'
import { faq } from '@/content/faq'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

const PILOT = faq.groups.find((group) => group.id === 'pilot')!

/* The page's questions as schema.org FAQPage data, written from the same
   copy file as the page, so what a search engine reads is what a reader
   sees. `<` is escaped so no answer can close the script. */
const STRUCTURED = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.groups.flatMap((group) =>
    group.items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  ),
}).replace(/</g, '\\u003c')

/* The FAQ page: every answer is a sentence or two, so every answer shows.
   One section: the topics down the left from lg, held in view as the page
   scrolls, and a row of pills above the questions below lg; each topic is
   a label over ruled rows, the question on the left and the answer on the
   right, as the site's other rows are set. */
export function FaqPage() {
  usePageAnalytics()
  return (
    <>
      <Nav current={PAGES.faq} />
      <main>
        <PageHero
          title={faq.hero['F-1-A']}
          lede={faq.hero['F-1-B']}
          primary={{ label: faq.hero['F-1-C'], href: DEMO_URL }}
          secondary={{ label: faq.hero['F-1-D'], href: `#${PILOT.id}` }}
        />

        <section className={SECTION_PAD}>
          <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="Topics" className="lg:sticky lg:top-28 lg:self-start">
              <ul role="list" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
                {faq.groups.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-line bg-soft px-4 text-nav text-body/75 transition-colors hover:text-link lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0"
                    >
                      {group.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-16">
              {faq.groups.map((group) => (
                <section
                  key={group.id}
                  id={group.id}
                  aria-labelledby={`${group.id}-heading`}
                  /* A topic's link lands its label 40px under the bar, level
                     with the topics, which stick at the same line from lg. */
                  className="scroll-mt-10"
                >
                  <h2 id={`${group.id}-heading`} className="text-label text-link">
                    {group.heading}
                  </h2>
                  <ul role="list" className="mt-4 divide-y divide-line border-t border-line">
                    {group.items.map(({ q, a, link }) => (
                      <li key={q} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12">
                        <h3 className="text-subhead">{q}</h3>
                        <div>
                          <p className="text-copy text-dim">{a}</p>
                          {link && (
                            <a href={link.href} className="mt-1 inline-flex min-h-11 items-center gap-1 text-small text-link">
                              {link.label}
                              <ArrowRight size={14} aria-hidden />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <Close
          heading={faq.close['F-7-A']}
          primary={{ label: faq.close['F-7-B'], href: DEMO_URL }}
          secondary={{ label: faq.close['F-7-C'], href: PAGES.pilot }}
        />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED }} />
      <Footer />
    </>
  )
}
