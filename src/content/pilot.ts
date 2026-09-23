/* Pilot page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours. Strings marked
   `changed` depart from it on the direction in Charlie's Positioning and
   Messaging Guide (22 Sep 2026): nothing reads as an instruction to the
   buyer. This page sits where a pricing page normally would and carries no
   price. Reply with the reference and the change. */

export const pilot = {
  hero: {
    'P-1-A': 'A pilot proves what Tripcerto does for your business', // changed
    'P-1-B':
      'We work with you to find the workflow where Tripcerto will have the most effect, then prove it there on one number, measured from where you are today. The result decides what happens next.', // changed
    'P-1-C': 'Book a call', // changed
    'P-1-D': 'Our approach', // added
  },
  runs: {
    'P-2-A': 'Agreed before anything is built', // changed: the hero already says one workflow, one measure
    'P-2-B': 'Our team proposes where the pilot runs and how it is measured, and agrees both with you.', // changed
    steps: [
      {
        name: 'The workflow',
        line: 'Together we identify the workflow where Tripcerto will make the most difference, and the one number it is judged on, with the person in your business who owns that number.',
      },
      {
        name: 'The baseline',
        line: 'We record what that number is today, from your own data, before anything changes.',
      },
      {
        name: 'The run',
        line: 'The workflow goes live for an agreed period, with the same number tracked throughout and reported as it stands.',
      },
    ], // changed: P-2-C, D, E were the steps Agree the measure, Set the baseline, Run it
  },
  measures: {
    'P-3-A': 'Conversion, lead quality, quote time, handling time or completeness',
    'P-3-B': 'We propose the one that fits the workflow the pilot covers, and the pilot stands or falls on that number.', // changed
    rows: [
      {
        name: 'Conversion',
        note: 'Engage',
        line: 'Engaged website visitors who become inquiries, against the rate the site had before.',
      },
      {
        name: 'Lead quality',
        note: 'Engage',
        line: 'How complete each brief is when it reaches sales, and how your salespeople rate it against what the form used to bring.',
      },
      {
        name: 'Quote time',
        note: 'Workspace',
        line: 'Time from the inquiry arriving to the quote going out, for the workflow the pilot covers.',
      },
      {
        name: 'Handling time',
        note: 'Workspace',
        line: 'Expert time spent per inquiry: the searching, rekeying and checking, before and after.',
      },
      {
        name: 'Completeness',
        note: 'Workspace',
        line: 'Quotes that go out with nothing missing, and the corrections that come back afterwards.',
      },
    ], // added: the five measures, each with its product and its definition
  },
  needs: {
    'P-4-A': 'We start from the content, product data and systems you already have', // changed
    'P-4-B': 'The pilot runs on the systems its workflow uses today, with a commercial sponsor and a technical owner on your side, working with our team.', // changed
  },
  after: {
    'P-5-A': 'An agreed result triggers the rollout',
    'P-5-B': 'We agree what the pilot has to produce before we start, so the decision afterwards is already made.',
  },
  close: {
    'P-6-A': 'It starts with a conversation with our team about where Tripcerto would do the most for your business', // added: the document had the button alone
    'P-6-B': 'Book a call', // changed
  },
} as const
