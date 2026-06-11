import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FAQ } from './FAQ'

describe('FAQ', () => {
  it('opens one row at a time and starts with the first open', () => {
    render(<FAQ />)
    const triggers = screen.getAllByRole('button')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(triggers[1])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
    // clicking the open row collapses it
    fireEvent.click(triggers[1])
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')
  })

  it('drops the vendor no-training sentence and PMS/Salesforce claims (D7 + grounding)', () => {
    const { container } = render(<FAQ />)
    const text = (container.textContent ?? '').toLowerCase()
    expect(text).toContain('how does tripcerto differ from a chatbot?')
    expect(text).not.toContain('no-training')
    expect(text).not.toContain('salesforce')
    expect(text).not.toContain('read-only api')
    expect(text).not.toContain('live in days')
  })

  it('expands the open panel to its measured content height and re-measures on resize', () => {
    // jsdom reports scrollHeight as 0; stub it so the measured-height path is
    // exercised (a fixed `maxHeight: 240` impl would NOT produce 321/540px).
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 321 })
    try {
      const { container } = render(<FAQ />)
      const panels = Array.from(container.querySelectorAll<HTMLElement>('.faq-body'))
      // First row open → measured height; the rest collapsed to 0.
      expect(panels[0].style.maxHeight).toBe('321px')
      expect(panels[1].style.maxHeight).toBe('0px')

      // Open row 2 → it measures, row 1 collapses.
      fireEvent.click(screen.getAllByRole('button')[1])
      expect(panels[1].style.maxHeight).toBe('321px')
      expect(panels[0].style.maxHeight).toBe('0px')

      // A viewport change re-measures the open panel (e.g. a reflow grew the answer).
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 540 })
      fireEvent(window, new Event('resize'))
      expect(panels[1].style.maxHeight).toBe('540px')
    } finally {
      if (original) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original)
      else Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
    }
  })
})
