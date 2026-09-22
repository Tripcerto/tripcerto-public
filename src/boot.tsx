import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

/* Every page of the site boots the same way: one entry file per page
   (main.tsx, engage.tsx, ...) hands its page component here. */
export function mount(page: ReactNode) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {page}
      <Analytics />
    </StrictMode>,
  )
}
