import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemberCard } from './MemberCard'

describe('MemberCard', () => {
  it('renders the member and an accessible, new-tab LinkedIn link', () => {
    const { getByRole, container } = render(
      <MemberCard
        initials="TS"
        name="Taylor Styles"
        role="Chief Technology Officer"
        bio="Builds the matching layer."
        linkedin="https://www.linkedin.com/in/taystyles/"
      />,
    )
    expect(container.querySelector('.member .avatar')).toHaveTextContent('TS')
    const link = getByRole('link', { name: 'Taylor Styles on LinkedIn' })
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/taystyles/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener')
  })
})
