import { DataControlSection } from './components/DataControlSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorksSection } from './components/HowItWorksSection'
import { JourneySection } from './components/JourneySection'
import { Nav } from './components/Nav'
import { PilotCTA } from './components/PilotCTA'
import { Problem } from './components/Problem'
import { WhyNowSection } from './components/WhyNowSection'
import { useReveal } from './hooks/useReveal'
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
  useReveal()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <JourneySection />
        <HowItWorksSection />
        <DataControlSection />
        <WhyNowSection />
        <FAQ />
        <PilotCTA />
      </main>
      <Footer />
    </>
  )
}
