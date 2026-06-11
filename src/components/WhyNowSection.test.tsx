import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { WhyNowSection } from './WhyNowSection'

describe('WhyNowSection', () => {
  it('renders exactly three vetted cards and no off-bank sources', () => {
    const { container } = render(<WhyNowSection />)
    expect(container.querySelector('#why-now')).toBeTruthy()
    expect(container.querySelectorAll('.stats .stat')).toHaveLength(3)
    const text = container.textContent ?? ''
    for (const ok of ['Booking.com', 'Contentsquare', 'Deloitte']) expect(text).toContain(ok)
    for (const bad of ['Accenture', 'Amadeus', 'Adobe', '3,500']) expect(text).not.toContain(bad)
    expect(text).not.toContain('investing fast')
  })
})
