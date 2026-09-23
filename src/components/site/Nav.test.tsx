import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Nav } from './Nav'

const root = document.documentElement

function restoredFromCache(persisted: boolean) {
  act(() => {
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted }))
  })
}

/* The theme button renders in the desktop group and the phone group, so
   it is found by its label and the first one is used. */
function themeButton(label: RegExp) {
  return screen.getAllByRole('button', { name: label })[0]
}

beforeEach(() => {
  root.classList.remove('dark', 'light')
  localStorage.clear()
})

afterEach(() => {
  root.classList.remove('dark', 'light')
  localStorage.clear()
})

describe('theme button', () => {
  it('switches the page, stores the choice and says what the next press does', () => {
    render(<Nav />)
    fireEvent.click(themeButton(/switch to dark mode/i))
    expect(root.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    const next = themeButton(/switch to light mode/i)
    expect(next.hasAttribute('aria-pressed')).toBe(false)
    fireEvent.click(next)
    expect(root.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('takes up a choice made on another page when the back-forward cache restores this one', () => {
    render(<Nav />)
    localStorage.setItem('theme', 'dark')
    restoredFromCache(true)
    expect(root.classList.contains('dark')).toBe(true)
    expect(themeButton(/switch to light mode/i)).toBeTruthy()
  })

  it('leaves a fresh load to the pre-paint script', () => {
    render(<Nav />)
    localStorage.setItem('theme', 'dark')
    restoredFromCache(false)
    expect(root.classList.contains('dark')).toBe(false)
  })

  it('follows a choice made in another tab', () => {
    root.classList.add('dark')
    render(<Nav />)
    localStorage.setItem('theme', 'light')
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }))
    })
    expect(root.classList.contains('dark')).toBe(false)
    expect(themeButton(/switch to dark mode/i)).toBeTruthy()
  })
})

describe('mobile menu', () => {
  it('is closed when the back-forward cache restores the page', () => {
    render(<Nav />)
    const button = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    restoredFromCache(true)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('tone over the band', () => {
  /* The page and the band, placed as the browser would report them: `pulled`
     is how far the page has been dragged down past its top, `scrolled` how
     far it has been scrolled. The band is the first 900px of a 3000px page. */
  function place({ pulled = 0, scrolled = 0 }) {
    const top = pulled - scrolled
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this === document.documentElement) return DOMRect.fromRect({ x: 0, y: top, width: 1440, height: 3000 })
      if (this.hasAttribute('data-band')) return DOMRect.fromRect({ x: 0, y: top, width: 1440, height: 900 })
      return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
    })
  }
  const header = () => document.querySelector('header') as HTMLElement

  afterEach(() => vi.restoreAllMocks())

  it('stays paper while the page is pulled down past its top', () => {
    place({ pulled: 160 })
    render(
      <>
        <Nav />
        <section data-band />
      </>,
    )
    expect(header().className).toContain('border-white/40')
  })

  it('measures from the bar row, not the header the open menu makes taller', () => {
    place({ scrolled: 800 })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (this.tagName === 'HEADER') return 600
      return this.parentElement?.tagName === 'HEADER' ? 64 : 0
    })
    render(
      <>
        <Nav />
        <section data-band />
      </>,
    )
    expect(header().className).toContain('border-white/40')
  })

  /* The bar row is 64px and the open menu 224px under it. */
  function openMenuOver(scrolled: number) {
    place({ scrolled })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (this.parentElement?.tagName === 'HEADER') return 64
      return this.parentElement?.id === 'site-menu' ? 224 : 0
    })
    render(
      <>
        <Nav />
        <section data-band />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    return document.querySelector('#site-menu a') as HTMLElement
  }

  it('gives the menu the band tone when the band runs under all of it', () => {
    const row = openMenuOver(0)
    expect(row.className).toContain('text-paper')
    expect(row.className).toContain('border-white/25')
  })

  it('keeps the menu in the page tone when it reaches past the band', () => {
    const row = openMenuOver(800)
    expect(header().className).toContain('border-white/40')
    expect(row.className).toContain('text-body')
    expect(row.className).not.toContain('text-paper')
  })

  it('turns to the page once the band has scrolled out from under it', () => {
    place({ scrolled: 2000 })
    render(
      <>
        <Nav />
        <section data-band />
      </>,
    )
    expect(header().className).not.toContain('border-white/40')
  })
})
