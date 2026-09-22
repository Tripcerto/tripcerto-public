import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'

/* Review page for the hero frames: ?scheme=light|dark forces the tone,
   otherwise the system decides. Deleted once the frames are signed off. */
const scheme = new URLSearchParams(window.location.search).get('scheme')
if (scheme === 'dark' || scheme === 'light') document.documentElement.classList.add(scheme)

const pill = (active: boolean) => `rounded-full px-3 py-1.5 ${active ? 'bg-ink text-paper' : 'text-ink hover:bg-tint'}`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav />
    <main>
      <Hero />
    </main>
    <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink/10 bg-paper/90 p-1 text-[13px] font-medium shadow-card backdrop-blur-xl">
      <a href="?" className={pill(scheme === null)}>
        System
      </a>
      <a href="?scheme=light" className={pill(scheme === 'light')}>
        Light
      </a>
      <a href="?scheme=dark" className={pill(scheme === 'dark')}>
        Dark
      </a>
      <a href={window.location.href} className="rounded-full px-3 py-1.5 text-primary-deep hover:bg-tint">
        Replay
      </a>
    </nav>
  </StrictMode>,
)
