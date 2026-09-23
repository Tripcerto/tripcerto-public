/* The frames' trip in words: a family of four after a safari, helped on an
   operator's website chat and built into a quote in Workspace. The row
   prices add up to the quote. Frame chrome, aria-hidden; no real business
   is named. */

export type RowStatus = 'confirmed' | 'request' | 'held' | 'gap'
export type RowKind = 'stay' | 'activity' | 'flight' | 'gap'

/* The story's clock, in seconds, paced for what a visitor wants to see:
   the traveller's chat moves briskly, the hand-off slows down (sending,
   sent, the window coming forward, the quote request arriving), and the
   build picks the pace back up. The phone runs from the page's start. At
   HANDOFF the window comes forward, and every Workspace time below counts
   from then (the hero holds the window's entrances back by HANDOFF; where
   the window stands alone they run from its own start). */
export const PHONE_BEAT = {
  header: 0.2,
  ask: 0.5,
  reply: 1.2,
  cards: 1.6,
  cardGap: 0.15,
  offer: 2.5,
  confirm: 3.2,
  sending: 3.7,
  sent: 5,
} as const
export const HANDOFF = 5.8

/* How long each of the itinerary's entrances runs, as its utility in
   src/index.css sets it (a test holds the two together). */
export const RUN = { pop: 0.55, flow: 0.5, slide: 0.5 } as const

/* The itinerary's items, in the trip's order. */
const ROWS = [
  { kind: 'flight', name: 'Flight to the Mara', price: '£780', status: 'confirmed', picked: false, action: '' },
  { kind: 'gap', name: 'No transfer to camp', price: '', status: 'gap', picked: false, action: 'Select transfer' },
  { kind: 'stay', name: 'Mara family camp', price: '£5,480', status: 'confirmed', picked: true, action: '' },
  { kind: 'activity', name: 'Balloon safari', price: '£2,080', status: 'confirmed', picked: true, action: '' },
  { kind: 'flight', name: 'Flight to Diani', price: '£920', status: 'held', picked: false, action: '' },
  { kind: 'gap', name: 'No stay in Diani', price: '', status: 'gap', picked: false, action: 'Select stay' },
  { kind: 'flight', name: 'Flight to Nairobi', price: '£560', status: 'held', picked: false, action: '' },
] as const satisfies ReadonlyArray<{
  kind: RowKind
  name: string
  price: string
  status: RowStatus
  picked: boolean
  action: string
}>

/* Each of the assistant's steps does one thing to the itinerary while it
   runs, and ticks the moment that thing has finished arriving: reading the
   request names the trip; generating lays the rows in, top to bottom in
   one flow; pricing slides every price and the total in from the right at
   once; detecting flags both gaps together the moment it starts, and ticks
   as they land, with the trip's readiness, while their pulse carries on.
   Each step opens as the last one ticks. */
const extract = 1.1
const named = extract + 0.4
const generate = named + RUN.pop
const rows = generate + 0.15
const rowGap = 0.06
const price = rows + (ROWS.length - 1) * rowGap + RUN.flow
const prices = price + 0.15
const detect = prices + RUN.slide
const gaps = detect + 0.1
const found = gaps + RUN.pop
const next = found + 0.6

export const BEAT = {
  request: 0.4,
  extract,
  named,
  generate,
  rows,
  rowGap,
  price,
  prices,
  detect,
  gaps,
  found,
  next,
  replay: next + 1,
} as const

export const trip = {
  operator: 'Safari Expert',
  ask: 'Safari in August with our two kids, 8 and 11. Where’s best?',
  reply: 'The Masai Mara: the migration’s there in August, and these two are made for kids.',
  picks: [
    { kind: 'Stay', name: 'Mara family camp', detail: '4 nights', price: '£5,480', crop: 'camp' },
    { kind: 'Experience', name: 'Balloon safari', detail: 'per person', price: '£520', crop: 'balloon' },
  ],
  offer: 'Shall I ask Safari Expert to quote this for you?',
  confirm: 'Yes please, with the camp and the balloon.',
  composer: 'Ask me about your trip',
  phoneWorking: 'Sending to Safari Expert',
  phoneSent: 'Sent to Safari Expert',

  title: 'Kenya family safari',
  meta: '2 adults, 2 children · 3–12 Aug · 9 nights',
  quote: '£9,820',
  ready: '72% ready',
  rows: ROWS,
  picked: 'Picked in chat',

  enquiry: { from: 'New quote request', line: 'Family of 4 · Masai Mara' },
  steps: [
    { text: 'Extracting the request', result: '4 guests', start: BEAT.extract, end: BEAT.generate },
    { text: 'Generating itinerary', result: '7 items', start: BEAT.generate, end: BEAT.price },
    { text: 'Pricing the trip', result: '£9,820', start: BEAT.price, end: BEAT.detect },
  ],
  detect: { text: 'Detecting gaps', found: '2 gaps found', start: BEAT.detect, end: BEAT.found },
  next: 'What would you like to do next? Book the transfer, or explore stays in Diani?',
  paneComposer: 'Ask me about this trip',
} as const
