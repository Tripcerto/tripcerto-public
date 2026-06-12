import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the five section links and a calendar CTA', () => {
    render(<Nav />)
    for (const label of ['Problem', 'Journey', 'How it works', 'Data control', 'Why now']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
    }
    // The Team section was removed, so its nav link is gone too.
    expect(screen.queryAllByRole('link', { name: 'Team' })).toHaveLength(0)
    const cta = screen.getAllByRole('link', { name: 'Book a demo' })[0]
    expect(cta).toHaveAttribute('href', 'https://calendar.app.google/kQsnVUt2ABMxFwjw7')
    expect(cta).toHaveAttribute('target', '_blank')
  })

  it('closed mobile panel is inert; opening toggles it and Escape closes', () => {
    render(<Nav />)
    const panel = document.getElementById('nav-mobile-panel')!
    expect(panel).toHaveAttribute('inert')
    const burger = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(burger)
    expect(panel).not.toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(panel).toHaveAttribute('inert')
  })
})
