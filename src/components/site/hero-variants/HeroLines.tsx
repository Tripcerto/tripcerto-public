import { lazy, Suspense } from 'react'
import { Hero } from '@/components/site/Hero'

const FlowPaths = lazy(() => import('@/components/ui/flow-paths').then((m) => ({ default: m.FlowPaths })))

export function HeroLines() {
  return (
    <Hero
      background={
        <Suspense fallback={null}>
          <FlowPaths className="absolute inset-x-0 top-0 bottom-16 mask-b-from-85% md:bottom-28" />
        </Suspense>
      }
    />
  )
}
