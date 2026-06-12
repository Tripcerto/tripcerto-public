import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./Threads', () => ({ Threads: () => null }))

import { PilotCTA } from './PilotCTA'

describe('PilotCTA', () => {
  it('renders the cream pilot copy and the single demo CTA without the unbuilt "wired to your stack" claim', () => {
    const { container } = render(<PilotCTA />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Move information faster. Win more bookings.',
    )
    expect((container.textContent ?? '').toLowerCase()).not.toContain('wired to your stack')

    const book = screen.getByRole('link', { name: /Book a demo/ })
    expect(book).toHaveAttribute('href', 'https://calendar.app.google/kQsnVUt2ABMxFwjw7')
    // "Contact us" was removed; only the centred demo CTA remains.
    expect(screen.queryByRole('link', { name: 'Contact us' })).toBeNull()
  })
})
