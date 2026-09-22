import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { EngageSection } from '@/components/site/EngageSection'
import { WorkspaceSection } from '@/components/site/WorkspaceSection'
import { Opportunity } from '@/components/site/Opportunity'
import { Audience } from '@/components/site/Audience'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { useGlobalClickTracking, useScrollDepth, useSectionViews, useTimeOnPage } from '@/lib/analytics'

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
        <Close />
      </main>
      <Footer />
    </>
  )
}
