/* Engage page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026). Strings marked `changed` depart from that document on the
   direction in Charlie's Positioning and Messaging Guide (22 Sep 2026): the
   software is the subject, the framing is the opportunity, the hero ends at
   the booking (§5), what travellers get is told apart from how the business
   uses it (§6), no problem section (§3), no sector cards (§8). The design
   sync (23 Sep 2026) cut E-3 and E-5 to E-7; E-5 is back on 24 Sep, after
   the review of the site found too little said about what the product
   does. Strings marked `corrected` were rewritten on 24 Sep to what
   Engage does today, checked against the product code: the brief and the
   conversation reach the team by email, and the brief's fields are the
   trip's facts, with the traveller's preferences in their own words. Reply
   with the reference and the change. */

export const engage = {
  hero: {
    'E-1-A': 'Engage learns what each visitor wants, so your team can sell it sooner', // changed
    'E-1-B':
      'Travellers ask in their own words on your website. Engage answers from the expertise and products you approve, records what matters to them as they research, and hands your sales team a brief.', // corrected
    'E-1-C': 'Book a demo',
    'E-1-D': 'See how it works', // added, as on the home page
  },
  /* E-4, "What you get" in the document; the label goes (§6). */
  sales: {
    'E-4-A': 'The brief that reaches your sales team', // changed
    'E-4-B':
      'When a traveller is ready for a person, your team receives the conversation and a structured brief with it. The first reply starts from what the traveller has already said.', // changed
    caption: 'The brief as it arrives, with the transcript behind it.',
    points: [
      'Who is travelling, when, for how long, the occasion and the budget, as fields', // corrected
      'The route and the stays considered, and how ready the traveller is to go ahead', // corrected
      'The whole conversation, with every preference and concern in the traveller’s own words', // corrected
    ],
  },
  /* E-5 Controls and E-6 Embed and API, together: how the business uses it
     (§6). Back on 24 Sep (see the head of this file). */
  business: {
    'E-5-A': 'On your site, in your voice, into your sales process', // changed
    'E-5-B': 'The Tripcerto team sets it up with you.', // changed
    rows: [
      {
        name: 'Your website',
        note: 'One embed tag, or the API',
        line: 'In your brand, with no rebuild of the site.', // corrected
      },
      {
        name: 'Your content and products',
        note: 'Approved sources, your catalogue',
        line: 'Answers draw on the sources you enable, and recommendations on the catalogue set for your site.', // corrected
      },
      {
        name: 'Your sales process',
        note: 'The brief, to your team',
        line: 'By email, the moment a traveller asks to talk. A CRM connection is built at set-up.', // corrected
      },
    ], // changed: E-5-B and E-6-A, B, as rows
  },
  /* E-9 Pilot and E-10 Close, together on the band: the measures and the call. */
  close: {
    'E-9-A': 'A pilot proves it on one number, agreed with you', // changed
    'E-9-B':
      'Engaged visitors who become enquiries, or how complete each brief is when it reaches sales.', // changed (24 Sep): the two Engage measures the Pilot page lists
    'E-10-B': 'Book a demo',
    'E-10-C': 'What a pilot delivers', // added
  },
} as const
