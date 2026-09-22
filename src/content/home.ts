/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Reply with the
   reference and the change. */

export const home = {
  hero: {
    'H-1-A': 'AI that makes complex travel easier to plan and sell', // changed
    'H-1-B':
      'Engage understands what each website visitor wants and passes the full brief to your sales team. Workspace builds the quote structure from that brief and shows what is still missing.', // changed
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  opportunity: {
    'H-2-A': 'Customer context carries from the first question to the final quote', // changed
    'H-2-B':
      'A traveller explains what they want once. Engage records it, the inquiry arrives with it and Workspace builds from it. Nobody repeats the discovery, and the sale moves sooner.', // changed
    /* Why it is an opportunity (Guide §3), kept apart from the opportunity itself. */
    why: 'Travel sales usually lose momentum at two handoffs: into the sales team, and into the first quote. Those are the two Tripcerto carries.', // new
    /* The connected journey, three dots and a tick. */
    steps: [
      {
        label: 'Research',
        line: 'The traveller asks on your website. Engage answers from your expertise and your products.',
        product: 'engage',
      },
      {
        label: 'Inquiry',
        line: 'The inquiry arrives with the transcript and a structured brief: needs, timing, preferences and the products considered.',
        product: 'engage',
      },
      {
        label: 'Quote',
        line: 'Workspace builds the itemised trip from the brief, shows what is missing and resolves it against your inventory.',
        product: 'workspace',
      },
      {
        label: 'Booked',
        line: 'The expert approves the quote, and it goes into the booking process you already run.',
        product: 'outcome',
      },
    ],
    /* The same journey as three dots, one per product and the outcome. */
    dots: [
      { label: 'Engage', line: 'The traveller asks on your website. The inquiry arrives with the brief.' },
      { label: 'Workspace', line: 'The brief becomes an itemised trip, checked against your inventory.' },
      { label: 'Booked', line: 'The expert approves the quote. It goes into the process you already run.' },
    ],
  },
  engage: {
    'H-4-A': 'Every website visitor, understood before the first call', // changed
    'H-4-B':
      'Travellers research in their own way. Engage answers from your expertise and your products, keeps you in control of what is shown, and hands sales the questions, preferences and products considered.', // changed
    caption: 'Engage on a travel website, typed or spoken.',
    points: [
      'Answers in your voice, from the content and products you approve',
      'Records needs, timing, preferences and concerns as the conversation goes on',
      'Passes the transcript and the structured brief into your sales process',
    ],
  },
  workspace: {
    'H-5-A': 'The customer’s requirements, turned into a sellable trip', // changed
    'H-5-B':
      'Dates, places, travellers and services become an itemised trip, resolved against your inventory, with the missing pieces flagged before the quote goes out.', // changed
    caption: 'A dropped file, a voice note, and the trip itemised.',
    points: [
      'Builds the itemised service list from the inquiry, in order',
      'Shows the stays, transfers and dates that still need attention',
      'Resolves prices and availability through the systems you already run',
    ],
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
  proof: {
    'H-8-A': 'What a pilot measures', // changed
    'H-8-B':
      'One workflow, your own baseline, one primary measure and up to three supporting ones. Nothing is claimed until it has been measured.', // changed
    measures: ['Visitor to inquiry', 'Inquiry quality', 'Inquiry to first quote', 'Handling time', 'Gaps found before send'],
  },
  close: {
    'H-9-A': 'We find where Tripcerto has the most effect in your business, then prove it there', // changed
    'H-9-B':
      'A short call is enough to find the workflow where a pilot would show the most. We define the measure with you.', // changed
    'H-9-C': 'Book a demo',
    'H-9-D': 'How a pilot runs',
  },
} as const
