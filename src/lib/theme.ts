import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'tripcerto-theme'
// Kept in sync with the cream/espresso --bg tokens in index.css so the browser
// chrome (address bar / PWA splash) matches the active theme.
const THEME_COLOR: Record<Theme, string> = { light: '#f4ecdf', dark: '#14110c' }

function readInitial(): Theme {
  // The pre-paint script in index.html has already resolved + stamped the theme
  // onto <html data-theme>, so trust that first (it ran before React mounted).
  if (typeof document !== 'undefined') {
    const stamped = document.documentElement.dataset.theme
    if (stamped === 'dark' || stamped === 'light') return stamped
  }
  return 'light'
}

let current: Theme = readInitial()
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

export function setTheme(next: Theme): void {
  current = next
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = next
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_COLOR[next])
  }
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // private mode / storage disabled — theme still applies for this session
  }
  emit()
}

export function toggleTheme(): void {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): Theme {
  return current
}

export function useTheme(): { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light' as Theme)
  return { theme, toggle: toggleTheme, setTheme }
}
