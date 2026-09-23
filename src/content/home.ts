/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Sections 3 to 5
   are the 23 Sep 2026 design's, word for word. Reply with the reference
   and the change. */

export const home = {
  hero: {
    'H-1-A': 'We make complex travel easier to plan and sell', // changed
    'H-1-B':
      'Engage understands what each website visitor wants and passes the full brief to your sales team. Workspace builds the quote structure from that brief and shows what is still missing.', // changed
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  opportunity: {
    'H-2-A': 'Customer context carries from the first question to the final quote', // changed
    /* The opportunity and why it is one, in one breath (Guide §3, §4). */
    'H-2-B':
      'A traveller explains what they want once. Engage records it, the inquiry arrives with it and Workspace builds from it. The two handoffs where travel sales lose momentum are the two Tripcerto carries.', // changed
    /* The journey in three stages: the product before the inquiry, the
       product after it, and the outcome (the Foundation's framing). */
    stages: [
      {
        when: 'Before the inquiry',
        name: 'Engage',
        line: 'Engage answers the traveller from your expertise and your products, and records what they want as they research.',
      },
      {
        when: 'After the inquiry',
        name: 'Workspace',
        line: 'Workspace opens the inquiry with that context intact, builds the itemised trip and shows what is still missing.',
      },
      {
        when: 'The outcome',
        name: 'Booked',
        line: 'The expert approves the quote, and it goes into the booking process you already run.',
      },
    ],
  },
  /* Sections 3, 4 and 5 as one: the two products side by side, a card
     each, word for word from the 23 Sep 2026 design. The label, the name
     and the link sit on the card; H-4-A and H-5-A are the line under the
     product's name, H-4-B and H-5-B the sentence under that. */
  products: {
    eyebrow: 'Our solutions', // changed (23 Sep design)
    'H-3-A': 'Two products. Built for your travel business.', // changed (23 Sep design)
    'H-3-B': 'Explore the right solution for your customers and your team.', // changed (23 Sep design)
  },
  engage: {
    label: 'Customer conversations', // changed (23 Sep design)
    'H-4-A': 'Understand every visitor. Before the first call.', // changed (23 Sep design)
    'H-4-B': 'Answer from your expertise and turn conversations into sales-ready briefs.', // changed (23 Sep design)
    link: 'Explore Engage', // changed (23 Sep design)
  },
  workspace: {
    label: 'Trip planning & sales', // changed (23 Sep design)
    'H-5-A': 'Turn every enquiry into a sellable trip.', // changed (23 Sep design)
    'H-5-B': 'Build itemised trips from customer needs, with gaps flagged before you quote.', // changed (23 Sep design)
    link: 'Explore Workspace', // changed (23 Sep design)
  },
  audience: {
    'H-7-A': 'Built for the people who sell complex travel', // changed
    'H-7-B':
      'Tripcerto takes the manual steps out of selling multi-day, multi-supplier trips at bespoke tour operators, DMCs and digitally connected ground transportation. Each role sees it in the number it is measured on.', // changed
    /* Buying roles and what they are measured on (Guide §8; the Foundation's
       stakeholder map). Sectors support the explanation, they do not lead it. */
    roles: [
      {
        role: 'Sales',
        measure: 'Conversion, response time, booking value',
        line: 'Every inquiry arrives with the questions asked, the preferences given and the products considered, so the first reply is faster and better informed.',
      },
      {
        role: 'Marketing',
        measure: 'Inquiry rate, cost per qualified inquiry',
        line: 'More of the visitors you already pay for reach a useful conversation, and each inquiry carries a record of what the visitor wanted.',
      },
      {
        role: 'Operations',
        measure: 'Quote time, completeness, handling time',
        line: 'Quotes are itemised and checked before they go out, with the gaps visible before send rather than corrected after.',
      },
      {
        role: 'Technology',
        measure: 'Security, data ownership, integration',
        line: 'Works with the systems you already run. Customer data stays separated by tenant, your approved sources stay authoritative and every recommendation is governed.',
      },
      {
        role: 'Finance',
        measure: 'Total cost, payback, contract exposure',
        line: 'Subscription, usage and implementation are priced separately, and the pilot measures are agreed before anything expands.',
      },
      {
        role: 'The travel expert',
        measure: 'Time on expert work, fewer corrections',
        line: 'Tripcerto prepares the work and shows what is missing. The expert decides what goes to the customer.',
      },
    ], // changed: roles, not sectors
  },
  /* No Proof section (Guide §10): the close is the call, with the pilot
     page beside it. Taylor, 22 Sep: nothing stands between the headline
     and the two buttons. */
  close: {
    'H-9-A': 'We find where our AI has the most effect in your business, then prove it there', // changed (Taylor, 22 Sep)
    'H-9-C': 'Book a demo',
    'H-9-D': 'How a pilot runs',
  },
} as const
