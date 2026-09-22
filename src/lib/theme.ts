import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

const KEY = 'theme'
const query = () => window.matchMedia('(prefers-color-scheme: dark)')

/* The system decides unless <html> carries a choice. index.html applies the
   stored choice before first paint, so this only has to read it. */
export function resolvedTheme(): Theme {
  const root = document.documentElement.classList
  if (root.contains('dark')) return 'dark'
  if (root.contains('light')) return 'light'
  return query().matches ? 'dark' : 'light'
}

function choose(theme: Theme) {
  const root = document.documentElement.classList
  root.remove('dark', 'light')
  root.add(theme)
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
  useEffect(() => {
    const media = query()
    const onChange = () => setTheme(resolvedTheme())
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
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
