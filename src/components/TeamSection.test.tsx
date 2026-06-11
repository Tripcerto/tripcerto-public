import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamSection } from './TeamSection'

describe('TeamSection', () => {
  it('renders the three verified members with LinkedIn links', () => {
    const { container } = render(<TeamSection />)
    expect(container.querySelector('#company')).toBeTruthy()
    expect(container.querySelectorAll('.team-grid .member')).toHaveLength(3)
    expect(screen.getByText('Charlie Potter')).toBeInTheDocument()
    expect(screen.getByText('Taylor Styles')).toBeInTheDocument()
    expect(screen.getByText('Nigel Clarke')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Taylor Styles on LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/taystyles/',
    )
  })
})
