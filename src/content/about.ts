/* About page strings, new on 24 Sep 2026: the company and the two founders.
   Nothing here comes from the 21 Sep copy document, so every string is
   `new`. The company line is Charlie's, from the 24 Sep call: Tripcerto sits
   inside the planning and selling of complex trips and takes the friction
   and the repetitive work out of it, so value reaches customers sooner and
   more sales convert. The founders' facts are the ones both founders
   confirmed for the site on 24 Sep: Charlie's ten years and more in travel
   sales; Taylor's ten years and more in scalable systems and IoT, five of
   them at Dyson. No board, no ownership and no brand of either founder's is
   named. Why the opportunity exists is told through Charlie's experience,
   not as the buyer's problem (Guide §3). Reply with the reference and the
   change. */

import { LINKEDIN } from '../lib/links'

export type Founder = {
  name: string
  role: string
  /* One line under the name on the home page. */
  line: string
  /* The fuller bio on the About page. */
  bio: string
  linkedin: string
  /* A portrait in public/team/, square, at least 640px; until it is there
     the card shows the founder's initials on the band. */
  photo?: string
}

export const founders: readonly Founder[] = [
  {
    name: 'Charlie Potter',
    role: 'Co-founder and CEO',
    line: 'More than ten years in travel sales.', // new
    bio: 'More than ten years in travel sales. Charlie leads sales and partnerships.', // new
    linkedin: LINKEDIN.charlie,
  },
  {
    name: 'Taylor Styles',
    role: 'Co-founder and CTO',
    line: 'More than ten years in scalable systems and IoT, five of them at Dyson.', // new
    bio: 'More than ten years in scalable infrastructure and IoT, five of them as a senior software engineer at Dyson. Taylor designed and built the Tripcerto platform.', // new
    linkedin: LINKEDIN.taylor,
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
