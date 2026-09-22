import { lazy, Suspense } from 'react'
import { Hero } from '@/components/site/Hero'

const Threads = lazy(() => import('@/components/ui/threads').then((m) => ({ default: m.Threads })))

/* Module-level so the effect builds its shader once: it re-runs on any new
   reference. Stops run pink to peach from the first thread to the last. */
const THREAD_COLOURS = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

export function HeroThreads() {
  return (
    <Hero
      background={
        <Suspense fallback={null}>
          <Threads
            className="absolute inset-x-0 top-0 bottom-16 mask-b-from-85% md:bottom-28"
            linesGradient={THREAD_COLOURS}
            lineCount={36}
            mobileLineCount={18}
            amplitude={1}
            distance={0}
            center={0.5}
            mobileCenter={0.46}
            interactive
            lineWidth={1.75}
            lineWidthEnd={1.25}
            lineOpacity={0.85}
            lineOpacityEnd={0.6}
          />
        </Suspense>
      }
    />
  )
}
