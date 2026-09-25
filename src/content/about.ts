/* About page strings, new on 24 Sep 2026: the company, the two founders
   and the board of advisers. Nothing here comes from the 21 Sep copy
   document, so every string is `new`. The company line is Charlie's, from
   the 24 Sep call. A founder is a name, a role and a fact or two, a figure
   and what it counts (Taylor, 24 Sep); the founders' facts are the ones
   both founders confirmed on 24 Sep, and no ownership and no brand of
   either founder's is named. An adviser is a portrait, a name and a
   LinkedIn, and nothing else: no title, no years, no line on what they
   bring (both founders, 24 Sep afternoon review). Why the opportunity
   exists is told through Charlie's experience, not as the buyer's problem
   (Guide §3). Reply with the reference and the change. */

import { LINKEDIN } from '../lib/links'

export type Fact = { figure: string; label: string }

export type Person = {
  name: string
  role: string
  /* What the person leads or brings, in a line under the facts. */
  note: string
  /* One or two facts, each a figure and what it counts, set one under the
     other (Taylor, 24 Sep: no bullets). */
  facts: readonly Fact[]
  linkedin?: string
  /* A square portrait in public/team/, WebP: 400 by 400 for a founder,
     cropped so the face is the same width in every frame and the eyes sit
     36% down; 192 by 192 for an adviser, cropped the same way (the face 45%
     of the width, the eyes 40% down; Steve Endacott's inside his photo's
     ring). Until it is there the card shows the person's
     initials on the band. */
  photo?: string
}

/* An adviser: the portrait, the name and the LinkedIn, as a Person's are. */
export type Adviser = Pick<Person, 'name' | 'linkedin' | 'photo'>

export const founders: readonly Person[] = [
  {
    name: 'Charlie Potter',
    role: 'Co-founder and CEO',
    facts: [
      { figure: '10+', label: 'years in travel sales' },
      { figure: '7,500+', label: 'enquiries handled' },
    ], // new (24 Sep, Taylor): the enquiry figure is the Our Team document's "7,500+ enquiry journeys managed"
    note: 'Leads the company: strategy, operations and sales.', // new (24 Sep): the Our Team document's "day-to-day operations" and "business development lead"
    linkedin: LINKEDIN.charlie,
    photo: '/team/charlie-potter.webp',
  },
  {
    name: 'Taylor Styles',
    role: 'Co-founder and CTO',
    facts: [
      { figure: '7+', label: 'years in scalable systems' },
      { figure: '5+', label: 'apps and platforms shipped' },
    ], // new (24 Sep, Taylor: no employer named; one line)
    note: 'Leads the platform: product, architecture and engineering.', // new (24 Sep): the Our Team document's "all technical development and architecture"
    linkedin: LINKEDIN.taylor,
    photo: '/team/taylor-styles.webp',
  },
]

export const advisers: readonly Adviser[] = [
  { name: 'Nigel Clarke', linkedin: LINKEDIN.nigel, photo: '/team/nigel-clarke.webp' },
  { name: 'Joanne Dickson', linkedin: LINKEDIN.joanne, photo: '/team/joanne-dickson.webp' },
  { name: 'Steve Endacott', linkedin: LINKEDIN.steve, photo: '/team/steve-endacott.webp' },
  { name: 'Gerd Bommer', linkedin: LINKEDIN.gerd, photo: '/team/gerd-bommer.webp' },
] // changed (24 Sep review): the titles, the years and the notes went

export const about = {
  hero: {
    'A-1-A': 'Tripcerto takes the repetitive work out of planning and selling complex travel', // new: Charlie's line, 24 Sep
    'A-1-B': 'Customers get what they asked for sooner, and more enquiries can become bookings.', // new: the rest of Charlie's line, without its "So" (24 Sep review)
    'A-1-C': 'Book a demo', // new
    'A-1-D': 'Meet the team', // new
  },
  /* A-2: the founding story, then the timeline under it (24 Sep review:
     Charlie, agreed by both founders): the founders did the work Tripcerto
     is built for long before they built it, which is what no one else can
     copy. Each entry is a year and one line, and each year is one a
     founder gave. Each line fills two lines of the timeline's measure,
     between 40 and 64 characters, so the entries stand level. */
  story: {
    'A-2-A': 'Started at the sales desk', // new
    'A-2-B': [
      'Selling complex trips, Charlie dealt first-hand with how fragmented the work behind each one is: the rekeying, the searching and the checking.',
      'Taylor spent the same years building systems that scale.',
      'Tripcerto was started to give that time back to the expert.',
    ], // changed (24 Sep review): the fragmentation Charlie saw and the systems Taylor built, then the line both founders keep
    timeline: [
      { year: '2009', line: 'Charlie takes a first tailor-made trip, then travels the world.' },
      { year: '2016', line: 'Charlie starts in travel sales, Taylor in building platforms.' }, // changed (25 Sep): two lines, as long as the others
      { year: '2017', line: 'Charlie sees how fragmented the work behind every trip is.' },
      { year: '2022', line: 'Taylor leaves New Zealand and meets Charlie in Bristol, UK.' }, // changed (25 Sep): the move from New Zealand, and where the founders met
      { year: '2023', line: 'They start planning the foundations of Tripcerto.' },
      { year: '2024', line: 'Tripcerto Ltd is incorporated in December.' }, // changed (25 Sep): two lines, as long as the others; the month from the company's rows
      { year: '2026', line: 'Both founders go full time, and the pilot programme opens.' }, // changed (25 Sep): both founders full time from the start of 2026, in two lines
    ], // new (24 Sep review): Charlie's years from the call and Taylor's after it (Bristol 2022, planning from 2023); Taylor's early years kept general, by Taylor's ask
  },
  /* The team, on the home page and on About (Taylor, 24 Sep): one section,
     the founders then the advisers. */
  team: {
    'A-3-A': 'Meet the team', // new (24 Sep, Taylor)
    'A-3-B': 'Founders', // new
    'A-3-C': 'Board of advisers', // changed (24 Sep review, Charlie)
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
    'A-5-A': 'Your experts get their time back', // changed (24 Sep, Taylor): what the reader gains, where "Every demo is run by one of the founders" said nothing they gain; one line
    'A-5-B': 'Book a demo', // new
    'A-5-C': 'What a pilot delivers', // new
  },
} as const
