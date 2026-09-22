import { Nav } from '@/components/site/Nav'
import { pickHero } from '@/components/site/hero-variants/pick'
import { Opportunity } from '@/components/site/Opportunity'
import { EngageSection } from '@/components/site/EngageSection'
import { WorkspaceSection } from '@/components/site/WorkspaceSection'
import { Audience } from '@/components/site/Audience'
import { Proof } from '@/components/site/Proof'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { useGlobalClickTracking, useScrollDepth, useSectionViews, useTimeOnPage } from '@/lib/analytics'

const Hero = pickHero(window.location.search)

export function App() {
  useScrollDepth()
  useSectionViews()
  useGlobalClickTracking()
  useTimeOnPage()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <EngageSection />
        <WorkspaceSection />
        <Opportunity />
        <Audience />
        <Proof />
        <Close />
      </main>
      <Footer />
    </>
  )
}
