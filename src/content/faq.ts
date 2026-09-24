/* FAQ page strings, new on 24 Sep 2026: the questions buyers have asked
   (Guide §16: Jacada and Wilderness, Travelyst, Cullinan, GNet, and the
   25 Aug review's list), each answered from what the product does today in
   two sentences or fewer. The Trust page stays the full account and is not
   a list of objections (Guide §14); each answer about data says the fact
   and links to the Trust section that holds it. The page's structured data
   (FAQPage) is written from this file. The one page with question marks on
   it, by the founders' ask. Reply with the reference and the change. */

import { PAGES, TRUST_SECTION } from '../lib/links'

export type Answer = { q: string; a: string; link?: { label: string; href: string } }
export type Group = { id: string; heading: string; items: readonly Answer[] }

const trust = (section: string) => `${PAGES.trust}#${section}`

export const faq = {
  hero: {
    'F-1-A': 'Questions travel businesses ask about Tripcerto', // new
    'F-1-B': 'What the two products do, where your data goes, and what a pilot delivers.', // new
    'F-1-C': 'Book a demo', // new
    'F-1-D': 'Pilots and pricing', // new
  },
  groups: [
    {
      id: 'tripcerto',
      heading: 'Tripcerto', // new: F-2
      items: [
        {
          q: 'What does Tripcerto do?',
          a: 'Engage answers travellers on your website and passes your sales team a brief. Workspace builds each enquiry into an itemised, priced trip and shows what is still missing.',
        },
        {
          q: 'Do we need both products?',
          a: 'Each is sold on its own. Engage works before the enquiry, Workspace after it.',
        },
        {
          q: 'Does it replace our travel experts?',
          a: 'Your experts keep the decisions: the recommendation, the price, the exceptions and the relationship. Tripcerto does the reading, structuring and checking around them.',
        },
        {
          q: 'Does it replace our CRM or reservations system?',
          a: 'Your systems stay where they are and stay the record. Tripcerto works alongside them, connected as part of set-up.',
        },
      ],
    },
    {
      id: 'engage',
      heading: 'Engage', // new: F-3
      items: [
        {
          q: 'How does Engage go on our website?',
          a: 'As a single embed tag in your brand, set up with you by the Tripcerto team. Your developers can use the API instead.',
        },
        {
          q: 'What does our sales team receive?',
          a: 'The whole conversation and a brief: who is travelling, when, for how long, the occasion, the budget and the route. It arrives by email the moment a traveller asks to talk.',
        },
        {
          q: 'Do travellers know they are talking to AI?',
          a: 'Yes. The chat window tells every visitor, and the model is told never to claim to be human.',
        },
      ],
    },
    {
      id: 'workspace',
      heading: 'Workspace', // new: F-4
      items: [
        {
          q: 'What goes into Workspace?',
          a: 'The requirement as it arrives: typed, dictated, pasted from an email or uploaded as a document.',
        },
        {
          q: 'How does it find what is missing?',
          a: 'It checks that every stop connects to the next and every night between dated stops has a stay. Gaps and unpriced lines show before anyone quotes.',
        },
        {
          q: 'Who decides what goes to the customer?',
          a: 'Your expert. Workspace sends nothing on its own, and every change is logged with who made it.',
        },
      ],
    },
    {
      id: 'data',
      heading: 'Your data', // new: F-5
      items: [
        {
          q: 'Is our data used to train AI models?',
          a: 'No. None of it is used to train a model, by Tripcerto or by its suppliers.',
          link: { label: 'How information moves', href: trust(TRUST_SECTION.moves) },
        },
        {
          q: 'Which AI models does Tripcerto use?',
          a: 'Anthropic’s model writes each reply and keeps nothing afterwards. A model from OpenAI turns short phrases into the vectors used for matching.',
          link: { label: 'How information moves', href: trust(TRUST_SECTION.moves) },
        },
        {
          q: 'What stops it recommending something we do not sell?',
          a: 'Each recommendation comes from matching against the catalogue set for your account, and each one shown is recorded.',
          link: { label: 'What decides a recommendation', href: trust(TRUST_SECTION.decides) },
        },
        {
          q: 'Where is our data kept, and who can see it?',
          a: 'Enquiries are stored in London and each business is kept apart. Tripcerto staff are given access only against a stated need.',
          link: { label: 'Who can reach what', href: trust(TRUST_SECTION.access) },
        },
        {
          q: 'Is Tripcerto certified?',
          a: 'Tripcerto is working towards ISO/IEC 27001, with Cyber Essentials first. Its security management system is written, approved and operating.',
          link: { label: 'The security programme', href: trust(TRUST_SECTION.programme) },
        },
      ],
    },
    {
      id: 'pilot',
      heading: 'Pilots and pricing', // new: F-6
      items: [
        {
          q: 'What does a pilot involve?',
          a: 'Engage, Workspace or both on one part of your business, set up with the founders and measured on one agreed number.',
          link: { label: 'What a pilot delivers', href: PAGES.pilot },
        },
        {
          q: 'How much data do we need to prepare?',
          a: 'A pilot starts from the content and data you already hold.',
        },
        {
          q: 'How is Tripcerto priced?',
          a: 'A one-off set-up, then a monthly subscription: Engage per business, Workspace per user. AI usage is billed separately, or runs on your own Anthropic account. A pilot’s terms are set out in its proposal.',
        },
        {
          q: 'What happens after a pilot?',
          a: 'The result against the agreed number decides whether to roll out.',
        },
      ],
    },
  ] as readonly Group[],
  close: {
    'F-7-A': 'Anything else is a call away', // new
    'F-7-B': 'Book a demo', // new
    'F-7-C': 'What a pilot delivers', // new
  },
} as const
