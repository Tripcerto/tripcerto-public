import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Problem } from './Problem'

describe('Problem', () => {
  it('renders the grounded copy and avoids off-bank wording', () => {
    const { container } = render(<Problem />)
    const text = container.textContent ?? ''
    expect(text).toContain('You aren’t delivering value')
    expect(text).toContain('cart and checkout')
    expect(text).toContain('up to 391%')
    expect(text).toContain('Leads360 / HubSpot')
    // six asset chips
    expect(container.querySelectorAll('.frag .asset')).toHaveLength(6)
    // three stat cards
    expect(container.querySelectorAll('.stats .stat')).toHaveLength(3)
    // no off-bank "online customer journeys" Baymard overstatement
    expect(text.toLowerCase()).not.toContain('online customer journeys')
  })
})
