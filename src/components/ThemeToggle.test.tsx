import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { setTheme } from '../lib/theme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    setTheme('light')
  })

  it('reflects the current theme and toggles <html data-theme> on click', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: 'Switch to dark mode' })
    expect(document.documentElement.dataset.theme).toBe('light')

    fireEvent.click(btn)
    expect(document.documentElement.dataset.theme).toBe('dark')
    // label flips so it always describes the next action
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('keeps the browser theme-color meta in sync with the active theme', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)

    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(meta.getAttribute('content')).toBe('#14110c')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(meta.getAttribute('content')).toBe('#f4ecdf')
    meta.remove()
  })
})
