import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders theme, kpi, gloss and source in the .stat structure', () => {
    const { container, getByText } = render(
      <StatCard theme="Demand" kpi="89%" gloss="Of travellers want AI involved." src="Booking.com" />,
    )
    expect(container.querySelector('.stat .stat-theme')).toHaveTextContent('Demand')
    expect(container.querySelector('.stat .kpi')).toHaveTextContent('89%')
    expect(container.querySelector('.stat .src')).toHaveTextContent('Booking.com')
    expect(getByText('Of travellers want AI involved.')).toBeInTheDocument()
  })
})
