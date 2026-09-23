/* Workspace page strings, keyed by the reference in "Website copy for
   review" (21 Sep 2026). Strings marked `changed` depart from that document
   on the direction in Charlie's Positioning and Messaging Guide (22 Sep
   2026): the software is the subject, what it does is told apart from how
   it sits in the business's systems (§6), no problem section (§3), no
   sector cards (§8). Reply with the reference and the change. */

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
    'W-3-A': 'Every inquiry becomes an itemised trip, with the gaps in view', // changed
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
  /* W-4, "What you get" in the document, with W-5 Controls: how Workspace
     sits in the business's systems (§6). */
  systems: {
    'W-4-A': 'Connected to the systems between inquiry and quote', // changed
    'W-4-B':
      'Workspace sits beside the systems your team already runs, reads from them and writes to them, and replaces none of them. Your product, price and availability data stay where they are and stay authoritative.', // changed
    rows: [
      {
        name: 'Your inventory and suppliers',
        detail: 'Product, rates, availability',
        line: 'Stays, transfers and activities are matched against your own catalogue and supplier feeds, and priced from the rates those systems hold.',
      },
      {
        name: 'Your CRM and inquiry channels',
        detail: 'Email, forms, Engage',
        line: 'The inquiry opens with the customer’s context intact, from a form, a forwarded email or the brief Engage captured on your website.',
      },
      {
        name: 'Your proposal and booking process',
        detail: 'Structured data out',
        line: 'The approved quote goes out as structured data into the proposal and booking tools you already use, with the dates, travellers and prices carried across.',
      },
      {
        name: 'Your experts, in control',
        detail: 'Review, approval, revision',
        line: 'The expert decides what goes to the customer, changes any line, and revises one part of the trip without restarting the rest.',
      },
    ], // changed: W-4-B and W-5-A, B, as rows
  },
  /* W-6 Boundaries, said as what stays yours rather than what Workspace does not do. */
  boundaries: {
    'W-6-A': 'What stays where it is', // changed
    'W-6-B':
      'Your reservation platform, itinerary builder and booking process stay where they are. Rates and availability stay in the systems that own them, and complex rate combinations and exceptions stay with your rules and your expert. Nothing reaches a customer without an expert approving it.', // changed
  },
  /* W-8 Pilot and W-9 Close, together on the band: the measures and the call. */
  close: {
    'W-8-A': 'A pilot proves it on one number, agreed with you', // changed
    'W-8-B':
      'Time from inquiry to quote, handling time per inquiry, or the completeness of each quote before it goes out. We agree the baseline first, then measure the change.', // changed
    'W-9-B': 'Book a demo',
    'W-9-C': 'What a pilot delivers', // added
  },
} as const
