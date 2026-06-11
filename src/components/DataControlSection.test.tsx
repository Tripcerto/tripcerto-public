import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DataControlSection } from './DataControlSection'

describe('DataControlSection', () => {
  it('renders the boundary stack with matching/inbox-delivery (not routing/CRM-sync)', () => {
    const { container } = render(<DataControlSection />)
    expect(container.querySelector('#data-control')).toBeTruthy()
    expect(container.querySelectorAll('.boundary-stack .dgm-node')).toHaveLength(4)
    const text = container.textContent ?? ''
    expect(text).toContain('scoring · matching')
    expect(text).toContain('inbox delivery')
    expect(text).not.toContain('CRM sync')
    // D7: the own-behaviour no-pooling architecture claim STAYS
    expect(text).toContain('not used to train shared models')
  })
})
