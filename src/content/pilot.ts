/* Pilot page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours. Strings marked
   `changed` depart from it on the direction in Charlie's Positioning and
   Messaging Guide (22 Sep 2026): nothing reads as an instruction to the
   buyer. This page sits where a pricing page normally would and carries no
   price. The design sync (23 Sep 2026) cut it to the measures: P-1-D, P-2, P-3-B,
   P-4 and P-5 are not on the page. Reply with the reference and the change. */

export const pilot = {
  hero: {
    'P-1-A': 'A pilot proves what Tripcerto does for your business', // changed
    'P-1-B':
      'We work with you to find the workflow where Tripcerto will have the most effect, then prove it there on one number, measured from where you are today. The result decides what happens next.', // changed
    'P-1-C': 'Book a call', // changed
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
    'P-6-A': 'It starts with a conversation with our team about where Tripcerto would do the most for your business', // added: the document had the button alone
    'P-6-B': 'Book a call', // changed
  },
} as const
