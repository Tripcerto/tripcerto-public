import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { HeroVisuals } from '@/components/site/frames/HeroVisuals'
import * as A from '@/components/site/frames/designs/DesignA'
import * as B from '@/components/site/frames/designs/DesignB'
import * as C from '@/components/site/frames/designs/DesignC'

/* Review page for the hero frames: ?design=a|b|c. Deleted once one is chosen. */
const DESIGNS = {
  a: { name: 'A · text', ...A },
  b: { name: 'B · glyphs', ...B },
  c: { name: 'C · smoked', ...C },
} as const

const param = new URLSearchParams(window.location.search).get('design')
const key = (param && param in DESIGNS ? param : 'a') as keyof typeof DESIGNS
const design = DESIGNS[key]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav />
    <main>
      <Hero visuals={<HeroVisuals window={<design.Window />} phone={<design.Phone />} />} />
    </main>
    <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink/10 bg-paper/90 p-1 text-[13px] font-medium shadow-card backdrop-blur-xl">
      {(Object.keys(DESIGNS) as Array<keyof typeof DESIGNS>).map((k) => (
        <a
          key={k}
          href={`?design=${k}`}
          className={`rounded-full px-3 py-1.5 ${k === key ? 'bg-ink text-paper' : 'text-ink hover:bg-tint'}`}
        >
          {DESIGNS[k].name}
        </a>
      ))}
      <a href={window.location.href} className="rounded-full px-3 py-1.5 text-primary-deep hover:bg-tint">
        Replay
      </a>
    </nav>
  </StrictMode>,
)
