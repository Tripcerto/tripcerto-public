import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'theme'
const BAR_COLOUR: Record<Theme, string> = { light: '#fff1ea', dark: '#1A0B20' }

/* Light unless <html> carries .dark. index.html applies the stored choice
   before first paint, so this only has to read it. */
export function resolvedTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/* The stored choice, read the way the pre-paint script in index.html reads
   it: dark only when dark was chosen. */
function storedTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return resolvedTheme()
  }
}

function paint(theme: Theme) {
  const root = document.documentElement.classList
  root.remove('dark', 'light')
  root.add(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR_COLOUR[theme])
}

/* The colours change at once and the toggle's icon carries the motion. No
   view transition: while one runs the browser sends every click to <html>,
   so the page would ignore input for the length of the fade. A page the
   back-forward cache restores, or one open in another tab, takes up a
   choice made elsewhere, since neither reruns the pre-paint script. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(resolvedTheme)

  useEffect(() => {
    const sync = () => {
      const stored = storedTheme()
      if (stored === resolvedTheme()) return
      paint(stored)
      setTheme(stored)
    }
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) sync()
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY) sync()
    }
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = resolvedTheme() === 'dark' ? 'light' : 'dark'
    paint(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* Private mode or blocked storage: the choice lasts for the page. */
    }
    setTheme(next)
  }, [])

  return [theme, toggle]
}
