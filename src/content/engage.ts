/* Engage page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026). Strings marked `changed` depart from that document on the
   direction in Charlie's Positioning and Messaging Guide (22 Sep 2026): the
   software is the subject, the framing is the opportunity, the hero ends at
   the booking (§5), what travellers get is told apart from how the business
   uses it (§6), no problem section (§3), no sector cards (§8). Reply with
   the reference and the change. */

export const engage = {
  hero: {
    'E-1-A': 'Engage learns what each visitor wants, so your team can sell it sooner', // changed
    'E-1-B':
      'Travellers ask in their own words on your website. Engage answers from the expertise and products you approve, records what matters to them as they research, and hands your sales team a brief in place of a form.', // changed
    'E-1-C': 'Book a demo',
    'E-1-D': 'See how it works', // added, as on the home page
  },
  /* E-3 in the document was "How it works": ask, answer, capture. That is
     the traveller's experience, so it is told as what travellers get (§6). */
  travellers: {
    'E-3-A': 'Travellers research in their own way, and you decide what is shown', // changed
    'E-3-B':
      'A question, a rough idea or a whole requirement, typed or spoken, at any point in the research. Engage answers from what you approve and builds the picture of the trip as the conversation goes on.', // changed
    columns: [
      {
        name: 'In their own words',
        line: 'Destinations, dates, who is travelling, what matters and what to avoid, in whatever order the traveller says them.',
      },
      {
        name: 'From your expertise',
        line: 'Answers come from the content you approve, and recommendations only from the products you sell, with why each one fits.',
      },
      {
        name: 'A person when they want one',
        line: 'Nobody has to leave contact details to keep researching. A traveller can ask for your team at any point, and the conversation goes with them.',
      },
    ], // changed: E-3-C, D, E were the steps Ask, Answer, Capture
  },
  /* E-4, "What you get" in the document; the label goes (§6). */
  sales: {
    'E-4-A': 'The brief that reaches your sales team', // changed
    'E-4-B':
      'When a traveller is ready for a person, your team receives the conversation and a structured brief with it. The first reply starts from what the traveller has already said, not from a form.', // changed
    caption: 'The brief as it arrives, with the transcript behind it.',
    points: [
      'Needs, timing, preferences, concerns and exclusions, as fields',
      'The products considered, and how ready the traveller is to talk',
      'The transcript, with the approved sources behind each answer',
    ],
  },
  /* E-5 Controls and E-6 Embed and API, together: how the business uses it (§6). */
  business: {
    'E-5-A': 'On your site, in your voice, into your sales process', // changed
    'E-5-B':
      'Engage runs on the content and products you approve, sits on the site you already have and hands off into the systems your team already works in. The Tripcerto team sets it up with you.', // changed
    rows: [
      {
        name: 'Your content and products',
        detail: 'Approved sources, enabled products',
        line: 'Answers draw only on the sources you enable. Recommendations come only from the products switched on for that site, ranked by your commercial rules, with the source recorded for every reply.',
      },
      {
        name: 'Your website',
        detail: 'The managed embed, or the API',
        line: 'The managed embed is the quickest route live and needs no rebuild of your site. The API is there for the day you want to build the surface yourself.',
      },
      {
        name: 'Your sales process',
        detail: 'CRM, live chat, email, WhatsApp',
        line: 'The brief and the transcript arrive in the CRM or channel your team already uses. Contact details are captured, or the traveller is handed to the channel they choose.',
      },
      {
        name: 'Your controls',
        detail: 'What is shown, and when',
        line: 'You decide which sources are enabled, what can be shown, and the point at which a traveller is handed to a person. Brand, placement and voice are set up with you.',
      },
    ], // changed: E-5-B and E-6-A, B, as rows
  },
  /* E-7 Boundaries, said as what you keep rather than what Engage does not do. */
  boundaries: {
    'E-7-A': 'What stays where it is', // changed
    'E-7-B':
      'Your CRM, reservations and booking systems stay where they are and stay authoritative. Nothing is answered without approved content behind it, and nothing is recommended that you cannot sell. Your experts keep the recommendations, the prices and the relationship.', // changed
  },
  /* E-9 Pilot and E-10 Close, together on the band: the measures and the call. */
  close: {
    'E-9-A': 'A pilot proves it on the number you choose', // changed
    'E-9-B':
      'Engaged visitors who become inquiries, the quality of each inquiry, time to a useful answer, or the completeness of the brief. We agree the baseline first, then measure the change.', // changed
    'E-10-B': 'Book a demo',
    'E-10-C': 'How a pilot runs', // added
  },
} as const
