import { useCallback, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

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

/* The theme is the class on <html>, and everything that changes it goes
   through paint, which tells the components reading it. */
const listeners = new Set<() => void>()

function paint(theme: Theme) {
  const root = document.documentElement.classList
  root.remove('dark', 'light')
  root.add(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR_COLOUR[theme])
  for (const listener of listeners) listener()
}

/* A page the back-forward cache restores, or one open in another tab, takes
   up a choice made elsewhere, since neither reruns the pre-paint script. */
function subscribe(listener: () => void) {
  const sync = () => {
    const stored = storedTheme()
    if (stored !== resolvedTheme()) paint(stored)
  }
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) sync()
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) sync()
  }
  listeners.add(listener)
  window.addEventListener('pageshow', onPageShow)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('pageshow', onPageShow)
    window.removeEventListener('storage', onStorage)
  }
}

/* The build renders every page light, having no <html> to read. A dark page
   hydrates as light and takes up its class in the same task, before the
   browser paints (boot.tsx hydrates synchronously). */
function serverTheme(): Theme {
  return 'light'
}

/* Switching cross-fades the whole page where the browser can snapshot it
   for a view transition; otherwise the colours simply change. While the fade
   runs the browser sends every click to <html>, so the page ignores input
   for its half second (accepted, 23 Sep). */
export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, resolvedTheme, serverTheme)

  const toggle = useCallback(() => {
    /* The theme to switch to is read when the update runs, not when the
       button is pressed: a second press can land before the first fade has
       run its update, and both updates then run in turn. */
    const apply = () => {
      const next: Theme = resolvedTheme() === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        /* Private mode or blocked storage: the choice lasts for the page. */
      }
      flushSync(() => paint(next))
    }
    if (typeof document.startViewTransition !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply()
      return
    }
    /* A press while the last fade is still waiting to start skips that fade:
       the browser runs its update anyway, without the animation, and rejects
       its `ready` with an AbortError. `ready` only says whether the fade
       ran, so the rejection is expected; an update that fails still rejects
       `finished`, which is left to surface. */
    document.startViewTransition(apply).ready.catch(() => {})
  }, [])

  return [theme, toggle]
}
