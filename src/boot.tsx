import { StrictMode, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

/* Every page of the site boots the same way: one entry file per page
   (main.tsx, engage.tsx, ...) hands its page component here. The first
   render commits before the entry script returns, so the page has its full
   height while the document is still loading: that is the only window in
   which the browser restores the scroll position on reload or jumps to the
   #section a link names. Smooth scrolling (index.css, html.loaded) waits
   for the frame after load, so that restore and that jump are not
   animated from the top. */
export function mount(page: ReactNode) {
  const root = createRoot(document.getElementById('root')!)
  flushSync(() =>
    root.render(
      <StrictMode>
        {page}
        <Analytics />
      </StrictMode>,
    ),
  )
  addEventListener('load', () => requestAnimationFrame(() => document.documentElement.classList.add('loaded')), { once: true })
}
