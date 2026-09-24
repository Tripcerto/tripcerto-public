/* Pilot page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours. Strings marked
   `changed` depart from it on the direction in Charlie's Positioning and
   Messaging Guide (22 Sep 2026): nothing reads as an instruction to the
   buyer, and the page sells the opportunity to try a pilot. It carries no
   price. The 24 Sep afternoon review turned it round: the headline says how
   quickly a pilot starts, as both founders put it, the way in is the
   pilot's information pack, requested by email at the top and the foot,
   and what a pilot includes is what the founders have told operators on
   their calls, kept short. The five measures are what a pilot can prove, not what it
   includes. Reply with the reference and the change. */

export const pilot = {
  hero: {
    tag: 'The pilot programme is open', // new (24 Sep)
    'P-1-A': 'Pilots go live in one week', // changed (24 Sep review): the founders' line on speed, still to be settled
    'P-1-B': 'An easy-to-install pilot proves the business case before you commit more time or money.', // changed (24 Sep review): Charlie's
    'P-1-E': 'Get the pilot information pack by email', // new (24 Sep review): the form's label
    'P-1-C': 'Or book a call', // changed (24 Sep review): the second way in, under the form
  },
  /* What a pilot includes, as the founders have described it to
     operators: one agreed slice, a light set-up on what the business
     already holds, a baseline and one measure agreed up front, and a hand
     in what is built next. No set-up time or length is given, as none has
     been. */
  includes: {
    'P-7-A': 'What a pilot includes', // new (24 Sep)
    columns: [
      { name: 'One agreed slice', line: 'One journey or one part of your business, chosen with you.' },
      { name: 'Light to set up', line: 'An embed on your website or a login for your team, run on the content and data you already hold. We build the connections.' },
      { name: 'Measured from today', line: 'A baseline from your own numbers, and one measure of success agreed before it starts.' },
      { name: 'A say in what comes next', line: 'What the pilot shows shapes what is built next, and you see it first.' },
    ], // changed (24 Sep review): from the founders' calls, in place of the morning's draft
  },
  measures: {
    'P-3-A': 'What a pilot can measure', // changed (24 Sep review): the list of five read as no title at all, and they are what a pilot proves, not what it includes
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
    'P-6-A': 'Get the pilot information pack', // changed (24 Sep review): the close is the pack's form (Charlie)
    'P-6-B': 'Or book a call', // changed (24 Sep review)
  },
} as const
