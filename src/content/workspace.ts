/* Workspace page strings, keyed by the reference in "Website copy for
   review" (21 Sep 2026). Strings marked `changed` depart from that document
   on the direction in Charlie's Positioning and Messaging Guide (22 Sep
   2026): the software is the subject, no problem section (§3), no sector
   cards (§8). The design sync (23 Sep 2026) kept the sections that show the
   product and cut W-4 to W-6; W-4 is back on 24 Sep, after the review of
   the site found too little said about what the product does. Strings
   marked `corrected` were rewritten on 24 Sep to what Workspace does
   today, checked against the product code: the requirement is typed,
   dictated, pasted or uploaded; lines are priced from the rates set up for
   the business and the supplier documents it uploads; connections to its
   own systems are built as part of its set-up. Reply with the reference
   and the change. */

export const workspace = {
  hero: {
    'W-1-A': 'Workspace builds the itemised trip and shows what is missing', // corrected
    'W-1-B':
      'A brief, an email or a document goes in. Workspace brings the dates, places, travellers and services together as an itemised trip, prices it and flags the pieces that still need an expert. Your expert opens a trip that is already laid out and spends the time on the decisions only they can make.', // corrected: an email is pasted in, a document uploaded
    'W-1-C': 'Book a demo',
    'W-1-D': 'See how it works', // added, as on the home page
  },
  /* W-3 in the document was "How it works": structure, flag the gaps,
     resolve. That is what Workspace does, so it is told as that (§6). */
  trip: {
    'W-3-A': 'The enquiry becomes an itemised trip, with the gaps in view', // corrected
    'W-3-B':
      'Workspace reads the requirement and builds the service list in order: the stays, the transfers, the flights, the activities.', // corrected
    columns: [
      {
        name: 'Structured, in order',
        line: 'Dates, places, travellers and services, laid out as the trip the customer described.', // corrected
      },
      {
        name: 'The gaps, flagged',
        line: 'A missing transfer between two stops, a night nobody has covered, a line still without a price: each shows before anyone quotes.', // corrected
      },
      {
        name: 'Priced, then checked',
        line: 'Lines are priced from the rates set up with you and the supplier documents you upload. Your expert checks every line and decides what reaches the customer.', // corrected
      },
    ], // changed: W-3-C, D, E were the steps Structure, Flag the gaps, Resolve
  },
  /* W-4, "What you get" in the document with W-5 Controls: what goes in,
     what comes out, and how Workspace sits with the business's own tools.
     Back on 24 Sep (see the head of this file). */
  fit: {
    'W-4-A': 'What goes in, what comes out, and how it connects', // changed
    rows: [
      {
        name: 'In',
        note: 'Typed, dictated, pasted or uploaded',
        line: 'The brief, the client’s email, or the itinerary or supplier document it came in.',
      },
      {
        name: 'Out',
        note: 'An itinerary, or data',
        line: 'A printable itinerary for the customer, or structured data for the tools you already use.',
      },
      {
        name: 'Your systems',
        note: 'Connected at set-up',
        line: 'Reservations, rates and itinerary tools stay the record.',
      },
    ], // added (24 Sep)
  },
  /* The close on the band: the product's information pack, requested by
     email, with the demo under it (24 Sep review: Charlie). */
  close: {
    'W-8-A': 'Get the Workspace information pack', // changed (24 Sep review): the close is the pack's form; the pilot has its own page
    'W-9-B': 'Or book a demo', // changed (24 Sep review)
  },
} as const
