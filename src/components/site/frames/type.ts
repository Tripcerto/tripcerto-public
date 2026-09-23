/* One scale for both frames. Each frame sizes in its own cqw, and in the
   hero the phone is 0.43 of the window's width, so each phone size is 2.33
   times its window partner and every pair below lands at the same pixel
   size on screen. The itinerary is a size container of its own, so it can
   also stand alone at any size: inside the window it is 62% of the
   window's width, so its sizes are the window's divided by 0.62. Headers,
   titles, chat, names and prices are one size and one weight (semibold);
   every round badge (the assistant, a status, a step, a card's kind) is
   one size; every line icon is one size. The itinerary's small size is
   for its tags and buttons. The phone's header is a step up (`HEADER`), as
   a phone's chat app sets it, clear of the island. */
export const TYPE = {
  phone: {
    text: 'text-[length:4.4cqw]',
    detail: 'text-[length:4cqw]',
  },
  window: {
    text: 'text-[length:1.9cqw]',
    detail: 'text-[length:1.7cqw]',
  },
  itinerary: {
    text: 'text-[length:3.06cqw]',
    detail: 'text-[length:2.74cqw]',
    kind: 'text-[length:2.1cqw]',
    total: 'text-[length:3.87cqw]',
  },
} as const

export const BADGE = {
  phone: { size: 'size-[7.5cqw]', glyph: 'size-[4.2cqw]' },
  window: { size: 'size-[3.2cqw]', glyph: 'size-[1.8cqw]' },
  itinerary: { size: 'size-[5.16cqw]', glyph: 'size-[2.9cqw]' },
} as const

export type FrameScale = keyof typeof BADGE

export const HEADER = {
  phone: { text: 'text-[length:4.9cqw]', mark: 'size-[8.6cqw]', icon: 'size-[6cqw]' },
} as const

export const ICON = {
  phone: 'size-[5.6cqw]',
  window: 'size-[2.4cqw]',
  itinerary: 'size-[3.87cqw]',
} as const

/* What a frame's screen is painted with: the band's frosted light where the
   frames stand on the band (the hero, a product page's opening), the page
   itself where they stand on the page, so it is cream by day and ink by
   night like everything around it. Painted, not glass, so whichever frame
   is in front hides the other cleanly. */
export const SURFACE = {
  band: 'bg-band-frosted dark:bg-band-smoked',
  page: 'bg-page',
} as const

export type Surface = keyof typeof SURFACE
