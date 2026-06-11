import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useReveal } from './useReveal'

function Harness() {
  useReveal()
  return <div className="reveal" data-testid="r">x</div>
}

describe('useReveal', () => {
  it('adds the `in` class once observed (mock IO fires intersecting)', () => {
    const { getByTestId } = render(<Harness />)
    expect(getByTestId('r')).toHaveClass('in')
  })
})
