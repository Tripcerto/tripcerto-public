export const DEMO_URL = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
export const LOGIN_URL = 'https://workspace.tripcerto.com'
export const STATUS_URL = 'https://status.tripcerto.com'
export const CONTACT_EMAIL = 'hello@tripcerto.com'

/* The seven pages of the site, each a Vite entry on the same primitives. */
export const PAGES = {
  home: '/',
  engage: '/engage',
  workspace: '/workspace',
  pilot: '/pilot',
  faq: '/faq',
  about: '/about',
  trust: '/trust',
} as const

/* The team's public profiles, linked from the home page and About. */
export const LINKEDIN = {
  charlie: 'https://www.linkedin.com/in/charlie-p-94383329',
  taylor: 'https://www.linkedin.com/in/taystyles',
  nigel: 'https://www.linkedin.com/in/nigelclarke100',
  joanne: 'https://www.linkedin.com/in/joannedickson1968',
  steve: 'https://www.linkedin.com/in/steveendacott',
  gerd: 'https://www.linkedin.com/in/gerdbommer',
} as const

/* The pages in the bar: the two products, the pilot, then the questions
   and the company (24 Sep). Trust lives in the footer beside Privacy and
   Terms (Taylor, 22 Sep evening). */
export const NAV_LINKS = [
  { href: PAGES.engage, label: 'Engage' },
  { href: PAGES.workspace, label: 'Workspace' },
  { href: PAGES.pilot, label: 'Pilot' },
  { href: PAGES.faq, label: 'FAQ' },
  { href: PAGES.about, label: 'About' },
] as const

/* The Trust page's sections, which the FAQ's answers about data link to,
   so an answer and the fuller account it points at stay one address. */
export const TRUST_SECTION = {
  moves: 'how-information-moves',
  decides: 'what-decides',
  access: 'who-can-reach-what',
  programme: 'security-programme',
  legal: 'terms-and-rights',
  status: 'live-status',
} as const

export const SECTION = {
  products: 'products',
  systems: 'how-it-fits',
  audience: 'is-this-for-me',
  team: 'team',
  close: 'close',
} as const
