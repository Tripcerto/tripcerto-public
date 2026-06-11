import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the three columns with real legal hrefs and the registration line', () => {
    const { container } = render(<Footer />)
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/legal/privacy/')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/legal/terms/')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', 'mailto:hello@tripcerto.com')
    expect(container.textContent).toContain('company no. 16121124')
    // the demo's ambiguous LinkedIn → #company link is dropped
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).toBeNull()
  })
})
