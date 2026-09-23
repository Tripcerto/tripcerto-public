import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { Products } from '@/components/site/Products'
import { Audience } from '@/components/site/Audience'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { home } from '@/content/home'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

export function App() {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <Audience />
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
