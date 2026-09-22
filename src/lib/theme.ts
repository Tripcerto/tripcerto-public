import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

const KEY = 'theme'
const BAR_COLOUR: Record<Theme, string> = { light: '#fff1ea', dark: '#1c0c15' }

/* Light unless <html> carries .dark. index.html applies the stored choice
   before first paint, so this only has to read it. */
export function resolvedTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function choose(theme: Theme) {
  const root = document.documentElement.classList
  root.remove('dark', 'light')
  root.add(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR_COLOUR[theme])
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* Private mode or blocked storage: the choice lasts for the page. */
  }
}

/* Switching cross-fades the whole page where the browser can snapshot it
   for a view transition; otherwise the colours simply change. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(resolvedTheme)
  const toggle = useCallback(() => {
    const next: Theme = resolvedTheme() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      choose(next)
      flushSync(() => setTheme(next))
    }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || typeof document.startViewTransition !== 'function') apply()
    else document.startViewTransition(apply)
  }, [])
  return [theme, toggle]
}
