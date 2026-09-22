export const DEMO_URL = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
export const LOGIN_URL = 'https://workspace.tripcerto.com'
export const STATUS_URL = 'https://status.tripcerto.com'
export const CONTACT_EMAIL = 'hello@tripcerto.com'

/* The five pages of the site, each a Vite entry on the same primitives; Trust is still to come. */
export const PAGES = {
  home: '/',
  engage: '/engage',
  workspace: '/workspace',
  pilot: '/pilot',
  trust: '/trust',
} as const

/* The pages in the bar. Trust lives in the footer beside Privacy and Terms
   (Taylor, 22 Sep evening; it may become its own section later). */
export const NAV_LINKS = [
  { href: PAGES.engage, label: 'Engage' },
  { href: PAGES.workspace, label: 'Workspace' },
  { href: PAGES.pilot, label: 'Pilot' },
] as const

export const SECTION = {
  opportunity: 'opportunity',
  engage: 'engage',
  workspace: 'workspace',
  audience: 'is-this-for-me',
  close: 'close',
} as const
