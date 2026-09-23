/* The words on the social cards.

   A card is read at thumbnail size in a feed, so it carries fewer words than
   the page it links to. Every line here either IS a signed-off string from
   src/content/*.ts (marked `signed`) or is cut down from one (marked `from`),
   and all of them obey the positioning rule: name the work, the problem or
   the outcome, never the category. "The intelligence layer for travel" and
   its relatives are the thing this file exists to keep off the cards.

   `variants` are the five designs. `pages` is each page's copy for the
   preview sheet; the site serves one card, the home entry of variant a. */

export const brand = {
  site: 'tripcerto.com',
  name: 'Tripcerto',
}

export const variants = {
  a: {
    name: 'Band',
    note: 'The hero itself: the Ember band under the signed-off headline.',
    theme: 'band',
    head: 'AI that makes complex travel easier to plan and sell',
    // signed: home.hero['H-1-A']. The headline stands alone; no sub.
  },
  b: {
    name: 'Paper',
    note: 'The light page, typographic, the band held to a strip at the foot.',
    theme: 'paper',
    eyebrow: 'Before the enquiry, and after it',
    head: 'The traveller explains it once. Nobody retypes it.',
    // from: home.opportunity['H-2-B']
    sub: 'Engage records what each website visitor wants. Workspace builds the quote structure from it.',
    // from: home.hero['H-1-B']
  },
  c: {
    name: 'Ink',
    note: 'Dark mode: smoked glass on ink under a wash of the band.',
    theme: 'ink',
    eyebrow: 'Engage · Workspace',
    head: 'Every enquiry arrives with the whole conversation behind it',
    // from: home.opportunity['H-2-B']
    sub: 'Your experts still decide what goes to the customer.',
    // from: workspace.trip, Resolved, then approved
  },
  d: {
    name: 'Product',
    note: 'The software itself, in the frames the site draws it with.',
    theme: 'product',
    eyebrow: 'Tripcerto',
    head: 'AI that makes complex travel easier to plan and sell',
    // from: home.hero['H-1-A']
    sub: 'Engage records what the visitor wants. Workspace turns it into an itemised trip with the gaps showing.',
    // from: home.hero['H-1-B']
  },
  e: {
    name: 'Split',
    note: 'The positioning as the whole card: two products, two jobs.',
    theme: 'split',
    head: 'Two products. Two jobs.',
    // signed: AGENTS.md § Positioning
    columns: [
      {
        name: 'Engage',
        when: 'Before the enquiry',
        line: 'Learns what each visitor wants, so your team can sell it sooner.',
      },
      {
        name: 'Workspace',
        when: 'After the enquiry',
        line: 'Builds the quote-ready trip and shows what is missing.',
      },
    ],
  },
}

/* Per-page copy for the preview sheet. Each entry's `head` is that page's own
   hero string; `sub` is cut to card length. Only `home` ships, as
   public/og-image.png, and it carries the headline alone. */
export const pages = {
  home: {
    eyebrow: 'Engage · Workspace',
    head: 'AI that makes complex travel easier to plan and sell',
  },
  engage: {
    eyebrow: 'Engage',
    head: 'Engage learns what each visitor wants, so your team can sell it sooner',
    // signed: engage hero
    sub: 'Answers from your expertise and your products, and hands sales the questions, preferences and products considered.',
  },
  workspace: {
    eyebrow: 'Workspace',
    head: 'Workspace builds the quote-ready trip and shows what is missing',
    // signed: workspace hero
    sub: 'The dates, places, travellers and services in an enquiry, itemised against your inventory, with the gaps flagged.',
  },
  pilot: {
    eyebrow: 'Pilot',
    head: 'A pilot proves what Tripcerto does for your business',
    sub: 'We find where our AI has the most effect in your business, then prove it there.',
    // signed: home.close['H-9-A']
  },
  trust: {
    eyebrow: 'Trust',
    head: 'Your data, Your expertise, You’re in control.',
    sub: 'How information moves, what decides a recommendation, and who can reach what.',
  },
}
