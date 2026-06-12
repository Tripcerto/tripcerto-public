import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HowItWorksSection } from './HowItWorksSection'

describe('HowItWorksSection', () => {
  it('renders grounded layer copy and scrubs the off-bank aria-label', () => {
    const { container } = render(<HowItWorksSection />)
    expect(container.querySelector('#how')).toBeTruthy()
    expect(container.querySelector('.section-title')).toHaveTextContent('Move fast, sell more.')

    const fig = container.querySelector('figure.dgm-layer')!
    const aria = fig.getAttribute('aria-label') ?? ''
    expect(aria).not.toMatch(/16\.9|38|write directly/i)

    const text = container.textContent ?? ''
    expect(text).toContain('Your branded surface')
    expect(text).toContain('Your Preferred Product')
    expect(text).not.toContain('Partner Inventory')
    expect(text).not.toContain('Outgrow')
    // verticals row
    expect(container.querySelectorAll('.platform-verticals .vchip')).toHaveLength(8)
    // closing line
    expect(text).toContain('maximise every opportunity')
  })
})
