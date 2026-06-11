import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./Threads', () => ({ Threads: () => null }))

import { Hero } from './Hero'

describe('Hero', () => {
  it('shows the cream headline, tagline, strip and both CTAs', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Revenue is lost')
    expect(screen.getByText('Tripcerto helps companies move quickly and win more bookings.')).toBeInTheDocument()
    expect(screen.getByText(/Operators · OTAs · DMCs/)).toBeInTheDocument()

    const book = screen.getByRole('link', { name: /Book a demo/ })
    expect(book).toHaveAttribute('href', 'https://calendar.app.google/kQsnVUt2ABMxFwjw7')
    expect(book).toHaveAttribute('target', '_blank')

    const see = screen.getByRole('link', { name: 'See how it works' })
    expect(see).toHaveAttribute('href', '#how')
  })
})
