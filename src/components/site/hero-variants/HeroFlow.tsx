import { lazy, Suspense } from 'react'
import { Hero } from '@/components/site/Hero'

const FlowField = lazy(() => import('@/components/ui/flow-field').then((m) => ({ default: m.FlowField })))

/* Module-level so the effect is built once: it re-runs on any new reference. */
const FLOW_COLOURS = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']
const FLOW_OPACITY: readonly [number, number] = [0.85, 0.6]

export function HeroFlow() {
  return (
    <Hero
      background={
        <Suspense fallback={null}>
          <FlowField
            className="absolute inset-x-0 top-0 bottom-16 mask-b-from-85% md:bottom-28"
            colours={FLOW_COLOURS}
            opacity={FLOW_OPACITY}
            lineWidth={1.5}
            glow={6}
            glowOpacity={0.7}
            lineCount={120}
            mobileLineCount={56}
            parallax={8}
          />
        </Suspense>
      }
    />
  )
}
