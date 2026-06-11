import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// WebGL + motion are irrelevant to copy; mock so jsdom can render the full tree.
vi.mock('./components/Threads', () => ({ Threads: () => null }))
vi.mock('./components/ShinyText', () => ({
  ShinyText: ({ text }: { text: string }) => <span>{text}</span>,
}))

import { App } from './App'

const BANNED = [
  '16.9',
  'Outgrow',
  '38 different',
  '38 web',
  '3,500',
  'Accenture',
  'Amadeus',
  'Adobe',
  'Your Branded AI',
  'Partner Inventory',
  'Write directly',
  'wired to your stack',
  'live in days',
  'no-training',
  'routed brief',
  'read-only API',
  'CRM sync',
  'Salesforce',
  'PMS',
]

const REQUIRED = ['Booking.com', 'Contentsquare', 'Deloitte', 'up to 391%', 'cart and checkout']

const SECTION_IDS = [
  'problem',
  'journey',
  'how',
  'data-control',
  'why-now',
  'company',
  'faq',
  'pilot',
]

function allText(root: HTMLElement): string {
  const body = root.textContent ?? ''
  const arias = Array.from(root.querySelectorAll('[aria-label]'))
    .map((el) => el.getAttribute('aria-label') ?? '')
    .join(' | ')
  return `${body} | ${arias}`
}

describe('homepage grounding regression', () => {
  it('contains no off-bank string in visible text or aria-labels (case-insensitive)', () => {
    const { container } = render(<App />)
    const haystack = allText(container).toLowerCase()
    for (const banned of BANNED) {
      expect(haystack, `banned string leaked: "${banned}"`).not.toContain(banned.toLowerCase())
    }
  })

  it('contains the required vetted strings', () => {
    const { container } = render(<App />)
    const haystack = allText(container).toLowerCase()
    for (const need of REQUIRED) {
      expect(haystack, `required string missing: "${need}"`).toContain(need.toLowerCase())
    }
  })

  it('renders the Hero plus all eight anchored sections', () => {
    const { container } = render(<App />)
    expect(container.querySelector('section.hero')).toBeTruthy()
    for (const id of SECTION_IDS) {
      expect(container.querySelector(`#${id}`), `missing section #${id}`).toBeTruthy()
    }
  })
})
