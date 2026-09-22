/* Pilot page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026); every string on that page was ours. Strings marked
   `changed` depart from it on the direction in Charlie's Positioning and
   Messaging Guide (22 Sep 2026): nothing reads as an instruction to the
   buyer. This page sits where a pricing page normally would and carries no
   price. Reply with the reference and the change. */

export const pilot = {
  hero: {
    'P-1-A': 'One workflow, one measure, and the result decides the rollout', // changed
    'P-1-B':
      'A pilot starts where customers drop off or where your team loses time. We agree what we are measuring and what it is today, build for that one workflow, and the number decides what happens next.', // changed
    'P-1-C': 'Book a demo',
    'P-1-D': 'How it runs', // added
  },
  runs: {
    'P-2-A': 'Agreed before anything is built', // changed: the hero already says one workflow, one measure
    'P-2-B': 'One workflow, one baseline, one measure. We agree what we are measuring, and what it is today, and only then build.', // changed
    steps: [
      {
        name: 'The measure',
        line: 'We agree the one number the pilot is judged on, with the person in your business who owns it.',
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
    'P-3-B': 'You choose the one that matters. We do not measure all five and report the flattering one.',
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
    'P-4-A': 'Your content, your product data and a named owner',
    'P-4-B': 'A commercial sponsor and a technical owner, and access to the systems the chosen workflow touches.',
  },
  after: {
    'P-5-A': 'An agreed result triggers the rollout',
    'P-5-B': 'We agree what the pilot has to produce before we start, so the decision afterwards is already made.',
  },
  close: {
    'P-6-A': 'It starts with a conversation about where your sales time goes', // added: the document had the button alone
    'P-6-B': 'Book a demo',
  },
} as const
