import { FAQ } from './components/FAQ'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Integration } from './components/Integration'
import { MatchingSection } from './components/MatchingSection'
import { Nav } from './components/Nav'
import { PilotCTA } from './components/PilotCTA'
import { Problem } from './components/Problem'
import {
  useGlobalClickTracking,
  useScrollDepth,
  useSectionViews,
  useTimeOnPage,
} from './lib/analytics'

export function App() {
  useGlobalClickTracking()
  useScrollDepth()
  useSectionViews()
  useTimeOnPage()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <MatchingSection />
        <Features />
        <Integration />
        <PilotCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
