/* About page strings, new on 24 Sep 2026: the company, the two founders
   and the advisers. Nothing here comes from the 21 Sep copy document, so
   every string is `new`. The company line is Charlie's, from the 24 Sep
   call. Each person is a name, a role and a fact or two, a figure and what
   it counts (Taylor, 24 Sep). The founders' facts are the ones
   both founders confirmed on 24 Sep; no ownership and no brand of either
   founder's is named. The advisers' facts and notes come from the
   Non-Executive Directors and Advisers document (July 2026) and, for Gerd
   Bommer, his own public profile (gerdbommer.com); each is called an adviser until both founders confirm
   who is a registered director. Why the opportunity exists is told through
   Charlie's experience, not as the buyer's problem (Guide §3). Reply with
   the reference and the change. */

import { LINKEDIN } from '../lib/links'

export type Fact = { figure: string; label: string }

export type Person = {
  name: string
  role: string
  /* What an adviser brings, in a line under the facts. */
  note?: string
  /* One or two facts, each a figure and what it counts, set one under the
     other (Taylor, 24 Sep: no bullets). */
  facts: readonly Fact[]
  linkedin?: string
  /* A square portrait in public/team/, WebP: 400 by 400 for a founder,
     cropped so the face is the same width in every frame and the eyes sit
     36% down; 160 by 160 for an adviser. Until it is there the card shows the person's
     initials on the band. */
  photo?: string
}

export const founders: readonly Person[] = [
  {
    name: 'Charlie Potter',
    role: 'Co-founder and CEO',
    facts: [
      { figure: '10+', label: 'years in travel sales' },
      { figure: '7,500+', label: 'enquiries handled' },
    ], // new (24 Sep, Taylor): the enquiry figure is the Our Team document's "7,500+ enquiry journeys managed"
    linkedin: LINKEDIN.charlie,
    photo: '/team/charlie-potter.webp',
  },
  {
    name: 'Taylor Styles',
    role: 'Co-founder and CTO',
    facts: [
      { figure: '7+', label: 'years in scalable systems' },
      { figure: '5+', label: 'years at Dyson' },
    ], // new (24 Sep, Taylor)
    linkedin: LINKEDIN.taylor,
    photo: '/team/taylor-styles.webp',
  },
]

export const advisers: readonly Person[] = [
  {
    name: 'Nigel Clarke',
    role: 'Adviser',
    facts: [
      { figure: '20+', label: 'years in technology sales and growth' },
      { figure: '3', label: 'exits and an IPO' },
    ], // new
    note: 'SaaS, travel technology, ground transport and mobility, from capital raising to M&A.', // new
    linkedin: LINKEDIN.nigel,
  },
  {
    name: 'Joanne Dickson',
    role: 'Adviser',
    facts: [{ figure: '30+', label: 'years leading travel and hospitality businesses' }], // new
    note: 'Scaling and modernising established travel businesses.', // new
    linkedin: LINKEDIN.joanne,
  },
  {
    name: 'Steve Endacott',
    role: 'Adviser and investor',
    facts: [{ figure: '30+', label: 'years building and selling travel and leisure businesses' }], // new
    note: 'Portfolio chairman and non-executive across travel, tourism and online businesses.', // new
    linkedin: LINKEDIN.steve,
  },
  {
    name: 'Gerd Bommer',
    role: 'Strategic adviser',
    facts: [{ figure: '25+', label: 'years building international markets' }], // new
    note: 'Founder of Zoenora, investing in and advising early-stage founders.', // new
    linkedin: LINKEDIN.gerd,
  },
]

export const about = {
  hero: {
    'A-1-A': 'Tripcerto takes the repetitive work out of planning and selling complex travel', // new: Charlie's line, 24 Sep
    'A-1-B': 'So customers get what they asked for sooner, and more enquiries can become bookings.', // new: the rest of Charlie's line
    'A-1-C': 'Book a demo', // new
    'A-1-D': 'Meet the team', // new
  },
  story: {
    'A-2-A': 'Started at the sales desk', // new
    'A-2-B':
      'Selling complex trips, Charlie saw how much of each day went on rekeying, searching and checking. Tripcerto was started to give that time back to the expert.', // new: why the opportunity exists, told through the founder's experience (Guide §3)
  },
  /* The team, on the home page and on About (Taylor, 24 Sep): one section,
     the founders then the advisers. */
  team: {
    'A-3-A': 'Meet the team', // new (24 Sep, Taylor)
    'A-3-B': 'Founders', // new
    'A-3-C': 'Advisers', // new
  },
  company: {
    'A-4-A': 'The company', // new
    rows: [
      {
        name: 'Tripcerto Ltd',
        note: 'Registered in England and Wales',
        line: 'Company number 16121124, incorporated in December 2024.',
      },
      {
        name: 'Data protection',
        note: 'Information Commissioner’s Office, ZC233726',
        line: 'Registered with the UK regulator for data protection. How Tripcerto handles your data is set out on the Trust page.',
        href: '/trust',
      },
    ], // new
  },
  close: {
    'A-5-A': 'Every demo is run by one of the founders', // new
    'A-5-B': 'Book a demo', // new
    'A-5-C': 'What a pilot delivers', // new
  },
} as const
