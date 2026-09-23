/* Engage page strings, keyed by the reference in "Website copy for review"
   (21 Sep 2026). Strings marked `changed` depart from that document on the
   direction in Charlie's Positioning and Messaging Guide (22 Sep 2026): the
   software is the subject, the framing is the opportunity, the hero ends at
   the booking (§5), no problem section (§3), no sector cards (§8). The
   design sync (23 Sep 2026) kept the sections that show the product: E-3,
   E-5 to E-7 are not on the page. Reply with the reference and the change. */

export const engage = {
  hero: {
    'E-1-A': 'Engage learns what each visitor wants, so your team can sell it sooner', // changed
    'E-1-B':
      'Travellers ask in their own words on your website. Engage answers from the expertise and products you approve, records what matters to them as they research, and hands your sales team a brief in place of a form.', // changed
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
      'Needs, timing, preferences, concerns and exclusions, as fields',
      'The products considered, and how ready the traveller is to talk',
      'The transcript, with the approved sources behind each answer',
    ],
  },
  /* E-9 Pilot and E-10 Close, together on the band: the measures and the call. */
  close: {
    'E-9-A': 'A pilot proves it on one number, agreed with you', // changed
    'E-9-B':
      'Engaged visitors who become inquiries, the quality of each inquiry, time to a useful answer, or the completeness of the brief.', // changed (23 Sep sync)
    'E-10-B': 'Book a demo',
    'E-10-C': 'What a pilot delivers', // added
  },
} as const
