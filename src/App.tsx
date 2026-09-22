import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { EngageSection } from '@/components/site/EngageSection'
import { WorkspaceSection } from '@/components/site/WorkspaceSection'
import { LowerA } from '@/components/site/lower/LowerA'
import { LowerB } from '@/components/site/lower/LowerB'
import { LowerC } from '@/components/site/lower/LowerC'
import { Footer } from '@/components/site/Footer'
import { useGlobalClickTracking, useScrollDepth, useSectionViews, useTimeOnPage } from '@/lib/analytics'
import { pickLower } from '@/lib/pick'

const LOWER = { a: LowerA, b: LowerB, c: LowerC } as const

export function App() {
  useScrollDepth()
  useSectionViews()
  useGlobalClickTracking()
  useTimeOnPage()
  const Lower = LOWER[pickLower()]
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <EngageSection />
        <WorkspaceSection />
        <Lower />
      </main>
      <Footer />
    </>
  )
}
