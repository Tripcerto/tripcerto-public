import { afterEach, describe, expect, it } from 'vitest'
import { mount } from './boot'

afterEach(() => {
  document.getElementById('root')?.remove()
  document.documentElement.classList.remove('loaded')
})

describe('mount', () => {
  it('commits the page before it returns, while the document is still loading', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)
    mount(<p>page</p>)
    expect(root.textContent).toBe('page')
  })

  it('turns smooth scrolling on only after load', async () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)
    mount(<p>page</p>)
    expect(document.documentElement.classList.contains('loaded')).toBe(false)
    window.dispatchEvent(new Event('load'))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(document.documentElement.classList.contains('loaded')).toBe(true)
  })
})
