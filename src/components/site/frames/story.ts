/* One trip, told twice: Stella's recommendations on the phone and the same
   trip itemised in Workspace. Words are drawn as bars; only the numerals
   are printed. */

export type Status = 'confirmed' | 'held' | 'pending' | 'gap'
export type Kind = 'stay' | 'transfer' | 'activity' | 'flight' | 'gap'

export const story = {
  activities: [
    { name: 'Balloon safari', price: '£520' },
    { name: 'Sunrise game drive', price: '£180' },
  ],
  header: { quote: '£11,240', ready: '86%', delta: '+12%' },
  rows: [
    { kind: 'stay', price: '£4,320', status: 'confirmed' },
    { kind: 'transfer', price: '£180', status: 'confirmed' },
    { kind: 'gap', price: '', status: 'gap' },
    { kind: 'stay', price: '£5,120', status: 'pending' },
    { kind: 'activity', price: '£1,040', status: 'confirmed' },
    { kind: 'flight', price: '£580', status: 'held' },
  ] satisfies ReadonlyArray<{ kind: Kind; price: string; status: Status }>,
} as const
