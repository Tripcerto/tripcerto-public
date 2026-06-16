import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ConnectedJourneySection } from './ConnectedJourneySection'

describe('ConnectedJourneySection', () => {
  it('renders the ecosystem map: title, every actor, the layer and the outcomes', () => {
    const { container } = render(<ConnectedJourneySection />)

    expect(container.querySelector('#ecosystem')).toBeTruthy()
    expect(container.querySelector('.section-title')).toHaveTextContent(
      'Tripcerto orchestrates the connected journey',
    )

    // figure exposes the whole diagram to assistive tech via one label
    const fig = container.querySelector('figure.cj')!
    expect(fig.getAttribute('role')).toBe('img')
    expect(fig.getAttribute('aria-label') ?? '').toContain('Where Tripcerto sits')

    const text = container.textContent ?? ''
    // demand · distribution · supply actors (rendered in both layouts)
    for (const actor of [
      'Travellers', 'OTAs', 'TMCs', 'Travel Agents', 'Tour Operators', 'DMCs',
      'Stays', 'Activities', 'Ground Transport', 'Air', 'Rail', 'Cruise',
    ]) {
      expect(text).toContain(actor)
    }
    // the four intelligences + unified pill
    for (const cap of [
      'Customer Intelligence', 'Product Intelligence', 'Commercial Intelligence', 'Workflow Intelligence',
    ]) {
      expect(text).toContain(cap)
    }
    expect(text).toContain('Unified Travel Intelligence')
    expect(text).toContain('Commercial outcomes')
    expect(text).toContain('Increase conversion and revenue')

    // both responsive layouts are present in the DOM (one is display:none per breakpoint)
    expect(container.querySelector('.cj-map')).toBeTruthy()
    expect(container.querySelector('.cj-stream')).toBeTruthy()
    // every distribution + supply rib alternates side; demand seeds the sequence
    expect(container.querySelectorAll('.cj-rib')).toHaveLength(12)
    expect(container.querySelectorAll('.cj-card')).toHaveLength(12)
  })
})
