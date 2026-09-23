/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Section 2 went
   in the 23 Sep review, once the hero and the product tiles said it. Sections 3 to 5 are the
   23 Sep 2026 design's. Reply with the reference and the change. */

export const home = {
  hero: {
    audience: 'For tour operators and DMCs', // added (23 Sep sync): who it is for, before the headline
    'H-1-A': 'AI that makes complex travel easier to plan and sell', // changed (23 Sep sync)
    'H-1-B':
      'Tripcerto answers travellers on your website, then turns each enquiry into an itemised trip your team can check and quote.', // changed (23 Sep sync): the products are named on their cards below
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  /* Sections 3, 4 and 5 as one: the two products side by side, each a tile
     that opens its own page, from the 23 Sep 2026 design. H-3-A says where
     each one works, in the order the tiles stand; H-4-A and H-5-A are the
     line under the product's name. */
  products: {
    'H-3-A': 'One for your website. One for your sales team.', // changed (23 Sep review: the design's "Two products. Built for your travel business." said nothing the tiles do not)
    'H-3-B': 'Explore the right solution for your customers and your team.', // changed (23 Sep design)
  },
  engage: {
    'H-4-A': 'Understand every visitor. Before the first call.', // changed (23 Sep design)
  },
  workspace: {
    'H-5-A': 'Turn every enquiry into a sellable trip.', // changed (23 Sep design)
  },
  audience: {
    'H-7-A': 'Built for the people who sell complex travel', // changed
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
  /* No Proof section (Guide §10): the close is the call, with the pilot
     page beside it. Taylor, 22 Sep: nothing stands between the headline
     and the two buttons. */
  close: {
    'H-9-A': 'We find where our AI has the most effect in your business, then prove it there', // changed (Taylor, 22 Sep)
    'H-9-C': 'Book a demo',
    'H-9-D': 'What a pilot delivers',
  },
} as const
