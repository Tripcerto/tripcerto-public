/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Reply with the
   reference and the change. */

export const home = {
  hero: {
    'H-1-A': 'AI makes complex travel arrangements easy', // changed
    'H-1-B':
      'Engage understands what each website visitor wants and passes the full brief to your sales team. Workspace builds the quote structure from that brief and shows what is still missing.', // changed
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  opportunity: {
    'H-2-A': 'Customer context carries from the first question to the final quote', // changed
    'H-2-B':
      'A traveller explains what they want once. Engage records it, the inquiry arrives with it and Workspace builds from it. Nobody repeats the discovery, and the sale moves sooner.', // changed
  },
  engage: {
    'H-4-A': 'Every website visitor, understood before the first call', // changed
    'H-4-B':
      'Travellers research in their own way. Engage answers from your expertise and your products, keeps you in control of what is shown, and hands sales the questions, preferences and products considered.', // changed
    caption: 'Engage running on a travel website.',
    points: [
      'Answers in your voice, from the content and products you approve',
      'Records needs, timing, preferences and concerns as the conversation goes on',
      'Passes the transcript and the structured brief into your sales process',
    ],
  },
  workspace: {
    'H-5-A': 'Workspace turns the customer’s requirements into a sellable trip', // changed
    'H-5-B':
      'Dates, places, travellers and services become an itemised trip, resolved against your inventory, with the missing pieces flagged before the quote goes out.', // changed
    caption: 'The trip, itemised.',
    points: [
      'Builds the itemised service list from the inquiry, in order',
      'Shows the stays, transfers and dates that still need attention',
      'Resolves prices and availability through the systems you already run',
    ],
  },
  audience: {
    'H-7-A': 'Built for complex travel sales',
    'H-7-B':
      'Tripcerto makes complex, multi-day travel faster and easier to sell, across bespoke tour operations, DMC quoting and digitally connected ground transportation.', // changed
    cards: [
      { role: 'Revenue', line: 'More of the pipeline converts, with a faster and better-informed first response.' },
      { role: 'Marketing', line: 'More return from the traffic you already pay for, and a record of what each visitor wanted.' },
      { role: 'Operations', line: 'Quotes prepared completely, with the gaps visible before send and fewer corrections after.' },
      { role: 'Technology', line: 'Works with the systems you already run. Customer data stays separated by tenant.' },
    ], // changed: roles, not sectors
  },
  proof: {
    'H-8-A': 'Measure the point that matters',
    'H-8-B':
      'A controlled pilot measures conversion, lead quality, quote time, handling time or completeness against your own baseline.', // changed
  },
  close: {
    'H-9-A': 'We find where Tripcerto has the most effect in your business, then prove it there', // changed
    'H-9-B':
      'A short call is enough to find the workflow where a pilot would show the most. We define the measure with you.', // changed
    'H-9-C': 'Book a demo',
  },
} as const
