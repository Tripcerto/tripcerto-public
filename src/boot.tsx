import type { ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { hydrateRoot } from 'react-dom/client'
import { enterPage, type PageKey } from '@/lib/events'
import { Site } from './Site'
import './index.css'

/* Every page of the site boots the same way: one entry file per page
   (main.tsx, engage.tsx, ...) hands its page here and exports what comes
   back. The build imports that entry, renders its default export into the
   page's #root (prerender in vite.config.ts) and takes the page from nowhere
   else, so the markup a page ships and the tree that hydrates it cannot
   differ. On the server mount only hands the page back. The key is the
   build's name for the page, which every event the page sends reports.

   In the browser the markup is already there, so the page has its full
   height while the document is still loading: that is the only window in
   which the browser restores the scroll position on reload or jumps to the
   #section a link names. Hydration takes the markup over before the entry
   script returns, so the first frame painted after it already has the
   nav's measured tone and the stored theme. Smooth scrolling (index.css,
   html.loaded) waits for the frame after load, so that restore and that
   jump are not animated from the top. */
export function mount(page: ComponentType, key: PageKey): ComponentType {
  if (import.meta.env.SSR) return page
  enterPage(key)
  flushSync(() => {
    hydrateRoot(document.getElementById('root')!, <Site page={page} />)
  })
  addEventListener('load', () => requestAnimationFrame(() => document.documentElement.classList.add('loaded')), { once: true })
  return page
}
