/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Section 2 went
   in the 23 Sep review, once the hero and the product tiles said it. Sections 3 to 5 are the
   23 Sep 2026 design's. H-11 and H-12 are new on 24 Sep: the journey
   the two products carry (Charlie's diagram from "The Changing Customer
   Journey", redrawn after the 24 Sep afternoon review), and the founders.
   Reply with the reference and the change. */

export const home = {
  hero: {
    audience: 'For tour operators and DMCs', // added (23 Sep sync): who it is for, before the headline
    'H-1-A': 'AI that makes complex travel easier to plan and sell', // changed (23 Sep sync)
    'H-1-B':
      'Tripcerto answers travellers on your website, profiles each customer and turns their enquiry into an itemised trip.', // changed (24 Sep review): Charlie's, so the line says what Engage learns about each customer; the gaps are said under Workspace
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  /* Sections 3, 4 and 5 as one: the two products side by side, each a tile
     that opens its own page, from the 23 Sep 2026 design. H-3-A says where
     each one works, in the order the tiles stand; H-4-A and H-5-A are the
     short paragraph under the product's name (24 Sep review: the one-line
     slogans went for a paragraph that says what the product is). */
  products: {
    'H-3-A': 'One for your website. One for your sales team.', // changed (23 Sep review: the design's "Two products. Built for your travel business." said nothing the tiles do not)
    'H-3-B': 'Tripcerto takes the repetitive manual tasks out of planning and selling complex trips.', // changed (24 Sep review): Charlie's, word for word
  },
  engage: {
    'H-4-A':
      'Engage is designed to give every visitor to your website value sooner than a conventional website can, so more of them become high-insight leads for your sales team.', // changed (24 Sep review): Charlie's, tidied
  },
  workspace: {
    'H-5-A':
      'Workspace is the travel expert’s tool for building complex multi-day, multi-service trips quickly. It takes out the repetitive manual tasks and checks every trip for gaps before the quote goes out.', // changed (24 Sep review): drafted from Charlie's, which asked for speed, many trips at once and the gap checking; "ultimate" left out
  },
  /* H-11: the journey the two products carry, from Charlie's diagram in
     "The Changing Customer Journey": before the enquiry on Engage, the
     enquiry and the expert who takes it, after the enquiry on Workspace,
     then the sale. Each product names the data of the business's own it
     draws on, and no more: how a business runs its systems is not drawn
     (Charlie, 24 Sep), and "systems" is not in the heading. */
  journey: {
    'H-11-A': ['Tripcerto is the intelligence layer', 'between your customers and your experts'], // changed (24 Sep review): agreed by both founders; "your systems stay where they are" went, as it says nothing changes
    engage: {
      when: 'Before the enquiry',
      steps: ['Website traffic', 'Personalised research', 'Greater insight'],
      data: 'Your content and products',
      'H-11-B': 'More insight in every enquiry', // new: the diagram's "More visitors enquire" is a result no pilot has measured
    },
    handoff: {
      enquiry: 'Web enquiry',
      expert: 'Your expert',
      'H-11-C': 'Your expert begins with context', // new: the diagram's
    },
    workspace: {
      when: 'After the enquiry',
      steps: ['Customer profile', 'Quote creation', 'Proposal'],
      data: 'Your CRM, pricing, availability and itineraries',
      'H-11-D': 'Less manual work, faster options', // new: the diagram's
    },
    sale: 'Sale',
  },
  audience: {
    'H-7-A': 'Built for the people who make travel possible', // changed (24 Sep review, Charlie): selling is one of the five roles, not all of them
    /* Buying roles and what they are measured on (Guide §8; the Foundation's
       stakeholder map). Each role is its name and its measures, nothing more,
       under the heading alone (23 Sep sync: the travel expert is sales). */
    roles: [
      { role: 'Sales', measures: ['Conversion', 'Response time', 'Booking value'] },
      { role: 'Marketing', measures: ['Enquiry rate', 'Cost per qualified enquiry'] },
      { role: 'Operations', measures: ['Quote time', 'Completeness', 'Handling time'] },
      { role: 'Technology', measures: ['Security', 'Data ownership', 'Integration'] },
      { role: 'Finance', measures: ['Total cost', 'Payback', 'Contract exposure'] },
    ], // changed: roles, not sectors; the measures as a list and the sentences dropped (23 Sep)
  },
  /* H-12: the way on to About, under the team, which is About's own
     section (src/content/about.ts, A-3). */
  team: {
    'H-12-B': 'About Tripcerto', // new (24 Sep)
  },
  /* No Proof section (Guide §10): the close is the call, with the pilot
     page beside it. Taylor, 22 Sep: nothing stands between the headline
     and the two buttons. */
  close: {
    'H-9-A': 'See how it works for you with a pilot', // changed (24 Sep review): Charlie's call to action, with "it" for "Tripcerto" so it stands on one line
    'H-9-C': 'Book a demo',
    'H-9-D': 'What a pilot delivers',
  },
} as const
