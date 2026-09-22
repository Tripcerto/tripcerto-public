export const DEMO_URL = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
export const LOGIN_URL = 'https://workspace.tripcerto.com'
export const STATUS_URL = 'https://status.tripcerto.com'
export const CONTACT_EMAIL = 'hello@tripcerto.com'

/* The five pages of the site. Home is built; the other four follow on the same primitives. */
export const PAGES = {
  home: '/',
  engage: '/engage',
  workspace: '/workspace',
  pilot: '/pilot',
  trust: '/trust',
} as const

/* The pages in the bar. Pilot is not a page to browse to but the way in,
   so it sits beside Login as a button. */
export const NAV_LINKS = [
  { href: PAGES.engage, label: 'Engage' },
  { href: PAGES.workspace, label: 'Workspace' },
  { href: PAGES.trust, label: 'Trust' },
] as const

export const SECTION = {
  opportunity: 'opportunity',
  engage: 'engage',
  workspace: 'workspace',
  audience: 'is-this-for-me',
  proof: 'proof',
  close: 'close',
} as const
