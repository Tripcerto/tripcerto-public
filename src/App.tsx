import { ArrowRight } from 'lucide-react'
import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { Products } from '@/components/site/Products'
import { Audience } from '@/components/site/Audience'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Systems } from '@/components/site/Systems'
import { Team } from '@/components/site/Team'
import { home } from '@/content/home'
import { DEMO_URL, PAGES } from '@/lib/links'

/* The home page: the hero, the two products, how they sit with the systems a
   business already runs, the roles they are built for, the team with the
   way on to About under it, and the close. The tones alternate page and
   tint down to the band. */
export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <Systems tone="tint" />
        <Audience tone="page" />
        <Team tone="tint">
          <div className="mt-10 flex justify-center">
            <a href={PAGES.about} className="inline-flex min-h-11 items-center gap-1 text-action text-link">
              {home.team['H-12-B']}
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </Team>
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
