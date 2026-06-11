import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { JourneySection } from './JourneySection'

describe('JourneySection', () => {
  it('renders two lanes of six nodes with grounded impact copy', () => {
    const { container } = render(<JourneySection />)
    expect(container.querySelector('#journey')).toBeTruthy()
    const lanes = container.querySelectorAll('.dgm-relay .relay-lane')
    expect(lanes).toHaveLength(2)
    expect(container.querySelectorAll('.relay-track .dgm-node')).toHaveLength(12)
    const text = container.textContent ?? ''
    expect(text).toContain('Up to 391%')
    expect(text).not.toContain('97%')
    expect(text).toContain('Same demand. Less leakage.')
  })
})
