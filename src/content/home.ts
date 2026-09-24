/* Home page strings, keyed by the reference in "Website copy for review" (21 Sep 2026).
   Strings marked `changed` depart from that document on the direction in Charlie's
   Positioning and Messaging Guide (22 Sep 2026): the software is the subject, the framing
   is the opportunity, the hero covers both products, section 6 is removed. Section 2 went
   in the 23 Sep review, once the hero and the product tiles said it. Sections 3 to 5 are the
   23 Sep 2026 design's. H-11 and H-12 are new on 24 Sep, after the review
   of the site: how Tripcerto sits with the systems a business already runs
   (the diagram from Charlie's "Built for the changing customer journey",
   kept second to the value, as Charlie asked on 24 Sep), and the founders.
   Reply with the reference and the change. */

export const home = {
  hero: {
    audience: 'For tour operators and DMCs', // added (23 Sep sync): who it is for, before the headline
    'H-1-A': 'AI that makes complex travel easier to plan and sell', // changed (23 Sep sync)
    'H-1-B':
      'Tripcerto answers travellers on your website, turns each enquiry into an itemised trip and shows what is missing before the quote goes out.', // changed (24 Sep): the gaps the demo shows, said in words
    'H-1-C': 'Book a demo',
    'H-1-D': 'See how it works',
  },
  /* Sections 3, 4 and 5 as one: the two products side by side, each a tile
     that opens its own page, from the 23 Sep 2026 design. H-3-A says where
     each one works, in the order the tiles stand; H-4-A and H-5-A are the
     line under the product's name. */
  products: {
    'H-3-A': 'One for your website. One for your sales team.', // changed (23 Sep review: the design's "Two products. Built for your travel business." said nothing the tiles do not)
    'H-3-B': 'Tripcerto sits inside the planning and selling of complex trips and takes the repetitive work out of both.', // changed (24 Sep): Charlie's definition from the 12:20 call, said where the products are introduced; it replaces his 23 Sep line, so it is his to confirm
  },
  engage: {
    'H-4-A': 'Understand every visitor. Before the first call.', // changed (23 Sep design)
  },
  workspace: {
    'H-5-A': 'Turn every enquiry into a sellable trip.', // changed (23 Sep design)
  },
  /* H-11: the tools in the systems a business already runs. The journey
     runs left to right, each step with the product that carries it; the
     systems sit under it and stay where they are. */
  systems: {
    'H-11-A': 'Your systems stay where they are. The work between them gets faster.', // new (24 Sep): Charlie's, from "Built for the changing customer journey"
    steps: [
      { name: 'Research', owner: 'Engage', line: 'Travellers ask on your website.' },
      { name: 'Enquiry', owner: 'Engage', line: 'Sales receives the brief.' },
      { name: 'Quote', owner: 'Workspace', line: 'The trip is itemised, priced and checked for gaps.' },
      { name: 'Proposal', owner: 'Your expert', line: 'Your expert decides what the customer sees.' },
    ],
    'H-11-C': 'Your systems', // new
    systems: ['Content and products', 'CRM', 'Pricing and availability', 'Reservations', 'Itinerary and proposal tools'],
    'H-11-D': 'Connections to your systems are built with you at set-up.', // new
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
  /* H-12: the way on to About, under the team, which is About's own
     section (src/content/about.ts, A-3). */
  team: {
    'H-12-B': 'About Tripcerto', // new (24 Sep)
  },
  /* No Proof section (Guide §10): the close is the call, with the pilot
     page beside it. Taylor, 22 Sep: nothing stands between the headline
     and the two buttons. */
  close: {
    'H-9-A': 'A pilot finds where Tripcerto does the most for your business, then proves it there', // changed (24 Sep): the software is the subject, and "we" no longer reads as an agency (open since the 23 Sep sync)
    'H-9-C': 'Book a demo',
    'H-9-D': 'What a pilot delivers',
  },
} as const
