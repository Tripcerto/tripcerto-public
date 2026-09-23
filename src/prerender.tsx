import type { ComponentType } from 'react'
import { prerender } from 'react-dom/static'
import { Site } from './Site'

/* The markup the build writes into a page's #root, rendered with no window
   or document. React reports a component that throws inside a Suspense
   boundary to onError and leaves that boundary for the browser to render
   again, with a recoverable error; here it fails the build instead, as does
   a page that renders nothing. */
export async function render(page: ComponentType): Promise<string> {
  const errors: unknown[] = []
  const { prelude } = await prerender(<Site page={page} />, {
    onError: (error) => {
      errors.push(error)
    },
  })
  const markup = await new Response(prelude).text()
  if (errors.length) throw new AggregateError(errors, `The page threw while rendering: ${errors.map(String).join('; ')}`)
  if (!markup.trim()) throw new Error('The page rendered nothing')
  return markup
}
