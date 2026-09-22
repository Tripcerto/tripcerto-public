/* One trip, told twice: the Engage conversation on the phone and the same
   trip itemised in Workspace. Every design draws from this; a design that
   shows no prose still keeps the roles, the order and the numbers. */

export type Status = 'confirmed' | 'held' | 'pending' | 'gap'
export type Kind = 'stay' | 'transfer' | 'activity' | 'flight' | 'gap'

export const story = {
  partner: 'Safari Expert',
  trip: { name: 'Mara & Serengeti', nights: 9, party: '2 adults', month: 'September' },

  chat: [
    { from: 'traveller', text: 'Honeymoon in September, 9 nights. We want the migration and a balloon flight.' },
    { from: 'stella', text: 'September is river-crossing season in the Mara. This pairing works:' },
    { from: 'card' },
    { from: 'traveller', text: 'Love it. Can we do 3 nights at Angama?' },
    { from: 'typing' },
  ] as const,
  card: { title: 'Mara & Serengeti', nights: '9 nights', line: 'Balloon safari on day 7', price: 'from £5,600pp', action: 'See the trip' },
  activities: [
    { name: 'Balloon safari', price: '£520' },
    { name: 'Sunrise game drive', price: '£180' },
  ],
  composer: 'Message…',
  handoff: 'Brief sent to your consultant',

  stella: {
    line: 'Built from the Engage conversation. The balloon safari is on day 7. Two nights between the Mara and the Serengeti are still unplanned.',
    chip: 'From the Engage brief',
  },
  header: { quote: '£11,240', readyLabel: 'Ready', ready: '86%', delta: '+12%' },
  rows: [
    { days: '1–3', kind: 'stay', place: 'Angama Mara', detail: '3 nights', price: '£4,320', status: 'confirmed' },
    { days: '3', kind: 'transfer', place: 'Mara airstrip → Angama', detail: 'Private 4x4', price: '£180', status: 'confirmed' },
    { days: '4–5', kind: 'gap', place: 'Nothing planned between the Mara and the Serengeti', detail: 'Add a stay', price: '', status: 'gap' },
    { days: '6–9', kind: 'stay', place: 'Namiri Plains', detail: '4 nights', price: '£5,120', status: 'pending' },
    { days: '7', kind: 'activity', place: 'Balloon safari, Seronera', detail: 'Sunrise · 2 guests', price: '£1,040', status: 'confirmed' },
    { days: '9', kind: 'flight', place: 'Seronera → Nairobi', detail: 'Coastal Aviation', price: '£580', status: 'held' },
  ] satisfies ReadonlyArray<{ days: string; kind: Kind; place: string; detail: string; price: string; status: Status }>,
  statusLabel: { confirmed: 'Confirmed', held: 'Availability held', pending: 'Price pending', gap: 'Gap' } satisfies Record<Status, string>,
} as const
