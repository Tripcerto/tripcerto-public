/* Pilot page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours. Strings marked
   `changed` depart from it on the direction in Charlie's Positioning and
   Messaging Guide (22 Sep 2026): nothing reads as an instruction to the
   buyer. The page sells the opportunity to try a pilot, with the proposing
   on us (Guide §12): no preparation list, no workflow for the buyer to
   choose. It carries no price; whether pricing gets pages of its own
   (Guide §11) is open. The design sync (23 Sep 2026) cut it to the
   measures; on 24 Sep, after the review of the site found the pilot's goal
   and what it delivers unclear, it gained what a pilot includes (P-7). The
   pilot's measures are still to be settled by both founders. Reply with
   the reference and the change. */

export const pilot = {
  hero: {
    tag: 'The pilot programme is open', // new (24 Sep)
    'P-1-A': 'A pilot proves what Tripcerto does for your business', // changed
    'P-1-B':
      'Tripcerto works with you to find where it will do the most for your business, then proves it there on one agreed number.', // changed (24 Sep)
    'P-1-C': 'Book a call', // changed
    'P-1-D': 'What a pilot includes', // added
  },
  includes: {
    'P-7-A': 'What a pilot includes', // new (24 Sep)
    columns: [
      { name: 'Found together', line: 'Led by the founders, alongside your team.' },
      { name: 'Built on what you have', line: 'It starts from the content and data you already hold.' },
      { name: 'Measured from today', line: 'One agreed number, its baseline from your own data, and the result against it.' },
      { name: 'A say in what is next', line: 'Direct influence on the roadmap, and early access to what is built.' },
    ], // new (24 Sep)
  },
  measures: {
    'P-3-A': 'Conversion, lead quality, quote time, handling time or completeness',
    rows: [
      {
        name: 'Conversion',
        note: 'Engage',
        line: 'Engaged website visitors who become enquiries, against the rate the site had before.',
      },
      {
        name: 'Lead quality',
        note: 'Engage',
        line: 'How complete each brief is when it reaches sales, and how your salespeople rate it against what the form used to bring.',
      },
      {
        name: 'Quote time',
        note: 'Workspace',
        line: 'Time from the enquiry arriving to the quote going out, for the workflow the pilot covers.',
      },
      {
        name: 'Handling time',
        note: 'Workspace',
        line: 'Expert time spent per enquiry: the searching, rekeying and checking, before and after.',
      },
      {
        name: 'Completeness',
        note: 'Workspace',
        line: 'Quotes that go out with nothing missing, and the corrections that come back afterwards.',
      },
    ], // added: the five measures, each with its product and its definition
  },
  close: {
    'P-6-A': 'A pilot starts with a call', // changed (24 Sep)
    'P-6-B': 'Book a call', // changed
    'P-6-C': 'Questions about pilots', // new (24 Sep)
  },
} as const
