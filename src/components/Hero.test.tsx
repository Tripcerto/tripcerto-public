import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const threadsProps: Record<string, unknown>[] = []
vi.mock('./Threads', () => ({
  Threads: (props: Record<string, unknown>) => {
    threadsProps.push(props)
    return null
  },
}))

import { Hero } from './Hero'

describe('Hero', () => {
  it('shows the cream headline, tagline, strip and the single demo CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Revenue is lost')
    expect(screen.getByText('Tripcerto helps companies move quickly and win more bookings.')).toBeInTheDocument()
    expect(screen.getByText(/Operators · OTAs · DMCs/)).toBeInTheDocument()

    const book = screen.getByRole('link', { name: /Book a demo/ })
    expect(book).toHaveAttribute('href', 'https://calendar.app.google/kQsnVUt2ABMxFwjw7')
    expect(book).toHaveAttribute('target', '_blank')

    // "See how it works" was removed site-wide; only the demo CTA remains.
    expect(screen.queryByRole('link', { name: 'See how it works' })).toBeNull()
  })

  it('lifts the waveform toward centre so its visible band is not sunk low', () => {
    // The Threads shader fades its high-perc lines to nothing, so the visible
    // band defaults to ~0.38 up the canvas — noticeably low. The hero centres it
    // with a positive uv-space yOffset (lift inside the shader, not a CSS
    // canvas translate, so the downward swells are never clipped flat).
    threadsProps.length = 0
    render(<Hero />)
    const props = threadsProps.at(-1)
    expect(props).toBeDefined()
    expect(typeof props!.yOffset).toBe('number')
    expect(props!.yOffset as number).toBeGreaterThan(0)
  })
})
