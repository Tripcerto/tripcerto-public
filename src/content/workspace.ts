/* Workspace page strings, keyed by the reference in "Website copy for
   review" (21 Sep 2026). Strings marked `changed` depart from that document
   on the direction in Charlie's Positioning and Messaging Guide (22 Sep
   2026): the software is the subject, no problem section (§3), no sector
   cards (§8). The design sync (23 Sep 2026) kept the sections that show the
   product: W-4 to W-6 are not on the page. Reply with the reference and the
   change. */

export const workspace = {
  hero: {
    'W-1-A': 'Workspace builds the quote-ready trip and shows what is missing', // changed
    'W-1-B':
      'A file, an email or a voice note goes in. Workspace brings the dates, places, travellers and services together as an itemised trip, resolves prices and availability through the systems you already run, and flags the pieces that still need an expert. Your expert opens a trip that is already prepared and spends the time on the decisions only they can make.', // changed
    'W-1-C': 'Book a demo',
    'W-1-D': 'See how it works', // added, as on the home page
  },
  /* W-3 in the document was "How it works": structure, flag the gaps,
     resolve. That is what Workspace does, so it is told as that (§6). */
  trip: {
    'W-3-A': 'Every enquiry becomes an itemised trip, with the gaps in view', // changed
    'W-3-B':
      'Workspace reads the requirement however it arrives and builds the service list in order: the stays, the transfers, the flights, the activities. Anything unresolved shows as its own row before the quote goes out.', // changed
    columns: [
      {
        name: 'Structured, in order',
        line: 'Dates, places, travellers and services from a file, an email or a voice note, laid out as the trip the customer described.',
      },
      {
        name: 'The gaps, flagged',
        line: 'A missing transfer, a stay without dates, a night nobody has covered: each shows as a row that needs attention, before anyone quotes.',
      },
      {
        name: 'Resolved, then approved',
        line: 'Products, rates and availability come from your systems. The expert reviews every line and approves what reaches the customer.',
      },
    ], // changed: W-3-C, D, E were the steps Structure, Flag the gaps, Resolve
  },
  /* W-8 Pilot and W-9 Close, together on the band: the measures and the call. */
  close: {
    'W-8-A': 'A pilot proves it on one number, agreed with you', // changed
    'W-8-B':
      'Time from enquiry to quote, handling time per enquiry, or the completeness of each quote before it goes out.', // changed (23 Sep sync)
    'W-9-B': 'Book a demo',
    'W-9-C': 'What a pilot delivers', // added
  },
} as const
