import { StrictMode, type ComponentType } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ConsentBar } from '@/components/site/ConsentBar'

/* The tree every page renders, in the build and in the browser alike: the
   browser can only take over the build's markup if the two are the same. */
export function Site({ page: Page }: { page: ComponentType }) {
  return (
    <StrictMode>
      <Page />
      <ConsentBar />
      <Analytics />
    </StrictMode>
  )
}
