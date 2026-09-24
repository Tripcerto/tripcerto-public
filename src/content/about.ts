/* About page strings, new on 24 Sep 2026: the company, the two founders
   and the advisers. Nothing here comes from the 21 Sep copy document, so
   every string is `new`. The company line is Charlie's, from the 24 Sep
   call. Each person is a name, a role and one line, in the same form as
   Charlie's (Taylor, 24 Sep: cut to match). The founders' facts are the ones
   both founders confirmed on 24 Sep; no ownership and no brand of either
   founder's is named. The advisers' lines come from the Non-Executive
   Directors and Advisers document (July 2026) and, for Gerd Bommer, his own
   public profile; each is called an adviser until both founders confirm
   who is a registered director. Why the opportunity exists is told through
   Charlie's experience, not as the buyer's problem (Guide §3). Reply with
   the reference and the change. */

import { LINKEDIN } from '../lib/links'

export type Person = {
  name: string
  role: string
  /* One line under the name, in the form "More than N years in …". */
  line: string
  linkedin?: string
  /* A portrait in public/team/, at least 800px wide; until it is there the
     card shows the person's initials on the band. */
  photo?: string
}

export const founders: readonly Person[] = [
  {
    name: 'Charlie Potter',
    role: 'Co-founder and CEO',
    line: 'More than ten years in travel sales.', // new
    linkedin: LINKEDIN.charlie,
  },
  {
    name: 'Taylor Styles',
    role: 'Co-founder and CTO',
    line: 'More than ten years in scalable systems, five at Dyson.', // new (24 Sep, Taylor: shorter)
    linkedin: LINKEDIN.taylor,
  },
]

export const advisers: readonly Person[] = [
  {
    name: 'Nigel Clarke',
    role: 'Adviser',
    line: 'More than 20 years in technology sales and growth, with three exits and an IPO.', // new
  },
  {
    name: 'Joanne Dickson',
    role: 'Adviser',
    line: 'More than 30 years leading travel and hospitality businesses.', // new
  },
  {
    name: 'Steve Endacott',
    role: 'Adviser and investor',
    line: 'More than 30 years building and selling travel and leisure businesses.', // new
  },
  {
    name: 'Gerd Bommer',
    role: 'Strategic adviser',
    line: 'More than 25 years building international markets, now investing in early-stage founders.', // new
  },
]

export const about = {
  hero: {
    'A-1-A': 'Tripcerto takes the repetitive work out of planning and selling complex travel', // new: Charlie's line, 24 Sep
    'A-1-B': 'So customers get what they asked for sooner, and more enquiries can become bookings.', // new: the rest of Charlie's line
    'A-1-C': 'Book a demo', // new
    'A-1-D': 'Meet the founders', // new
  },
  story: {
    'A-2-A': 'Started at the sales desk', // new
    'A-2-B':
      'Selling complex trips, Charlie saw how much of each day went on rekeying, searching and checking. Tripcerto was started to give that time back to the expert.', // new: why the opportunity exists, told through the founder's experience (Guide §3)
  },
  founders: {
    'A-3-A': 'The founders', // new
  },
  advisers: {
    'A-6-A': 'The advisers', // new (24 Sep)
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
