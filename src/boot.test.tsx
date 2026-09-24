import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { useLayoutEffect, useRef, type ComponentType } from 'react'
import { Nav } from '@/components/site/Nav'
import { currentPage } from '@/lib/events'
import { mount } from './boot'
import { render } from './prerender'

/* A page as the build ships it: its markup already in #root. */
async function built(page: ComponentType) {
  const root = document.createElement('div')
  root.id = 'root'
  root.innerHTML = await render(page)
  document.body.append(root)
  return root
}

/* A page that marks itself before paint, as the nav measures its tone:
   in a layout effect, which runs when hydration commits. */
function Measured() {
  const ref = useRef<HTMLParagraphElement>(null)
  useLayoutEffect(() => {
    ref.current?.setAttribute('data-measured', '')
  }, [])
  return <p ref={ref}>page</p>
}

afterEach(() => {
  document.getElementById('root')?.remove()
  document.documentElement.classList.remove('loaded', 'dark')
  vi.restoreAllMocks()
})

describe('mount', () => {
  it('keeps the markup the build rendered and takes it over before it returns', async () => {
    const root = await built(Measured)
    const paragraph = root.querySelector('p')
    expect(paragraph?.textContent).toBe('page')
    const error = vi.spyOn(console, 'error')
    mount(Measured, 'home')
    expect(root.querySelector('p')).toBe(paragraph)
    expect(paragraph?.hasAttribute('data-measured')).toBe(true)
    expect(error).not.toHaveBeenCalled()
  })

  it('hydrates a dark page from the light build and names the dark theme before it returns', async () => {
    await built(Nav)
    /* The pre-paint script, for a visitor who chose dark. */
    document.documentElement.classList.add('dark')
    const error = vi.spyOn(console, 'error')
    mount(Nav, 'home')
    expect(screen.getAllByRole('button', { name: /switch to light mode/i })).toHaveLength(2)
    expect(error).not.toHaveBeenCalled()
  })

  it('hands the page back for the entry to export', async () => {
    await built(Measured)
    expect(mount(Measured, 'home')).toBe(Measured)
  })

  it('names the page every event reports before the page takes over', async () => {
    let named: string | null = null
    function Naming() {
      named ??= currentPage()
      return <p>page</p>
    }
    await built(Naming)
    named = null
    mount(Naming, 'trust')
    expect(named).toBe('trust')
  })

  it('turns smooth scrolling on only after load', async () => {
    await built(Measured)
    mount(Measured, 'home')
    expect(document.documentElement.classList.contains('loaded')).toBe(false)
    window.dispatchEvent(new Event('load'))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(document.documentElement.classList.contains('loaded')).toBe(true)
  })
})
