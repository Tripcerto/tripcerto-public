import { ArrowRight } from 'lucide-react'
import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { Products } from '@/components/site/Products'
import { Audience } from '@/components/site/Audience'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Founders } from '@/components/site/Founders'
import { Section } from '@/components/site/Section'
import { Systems } from '@/components/site/Systems'
import { founders } from '@/content/about'
import { home } from '@/content/home'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

/* The home page: the hero, the two products, how they sit with the systems a
   business already runs, the roles they are built for, the people who build
   them, and the close. The tones alternate page and tint down to the band. */
export function App() {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <Systems tone="tint" />
        <Audience tone="page" />
        <Section
          id={SECTION.founders}
          tone="tint"
          heading={home.founders['H-12-A']}
          action={
            <a href={PAGES.about} className="inline-flex min-h-11 items-center gap-1 text-action text-link">
              {home.founders['H-12-B']}
              <ArrowRight size={16} aria-hidden />
            </a>
          }
        >
          <Founders founders={founders} detail="brief" />
        </Section>
        <Close
          heading={home.close['H-9-A']}
          primary={{ label: home.close['H-9-C'], href: DEMO_URL }}
          secondary={{ label: home.close['H-9-D'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
