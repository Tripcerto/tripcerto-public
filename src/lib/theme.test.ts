import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from './theme'

const root = document.documentElement

/* View transitions as Chrome runs them: a transition's update waits for the
   next frame, and starting another before then skips the waiting one, whose
   update runs at once and whose `ready` rejects with an AbortError. */
function chromeViewTransitions() {
  let waiting: { update: () => void; settle: (skipped: boolean) => void } | null = null
  const run = (skipped: boolean) => {
    const transition = waiting
    waiting = null
    transition?.update()
    transition?.settle(skipped)
  }
  const start = (update: () => void) => {
    run(true)
    const ready = new Promise<void>((resolve, reject) => {
      waiting = {
        update,
        settle: (skipped) => (skipped ? reject(new DOMException('Transition was skipped', 'AbortError')) : resolve()),
      }
    })
    return { ready }
  }
  Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start })
  return { nextFrame: () => run(false) }
}

/* jsdom raises no unhandledrejection event, so the check listens on the
   Node process the tests run in. */
const node: { on(event: string, listener: (reason: unknown) => void): void; off(event: string, listener: (reason: unknown) => void): void } =
  Reflect.get(globalThis, 'process')

beforeEach(() => {
  root.classList.remove('dark', 'light')
  localStorage.clear()
})

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition')
  root.classList.remove('dark', 'light')
  localStorage.clear()
})

describe('useTheme', () => {
  it('ends where it started after two presses before the first fade runs, and rejects nothing unhandled', async () => {
    const unhandled = vi.fn()
    node.on('unhandledRejection', unhandled)
    try {
      const transitions = chromeViewTransitions()
      const { result } = renderHook(() => useTheme())
      act(() => {
        result.current[1]()
        result.current[1]()
      })
      act(() => transitions.nextFrame())
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(root.classList.contains('dark')).toBe(false)
      expect(localStorage.getItem('theme')).toBe('light')
      expect(result.current[0]).toBe('light')
      expect(unhandled).not.toHaveBeenCalled()
    } finally {
      node.off('unhandledRejection', unhandled)
    }
  })

  it('switches once a single press has its fade', () => {
    const transitions = chromeViewTransitions()
    const { result } = renderHook(() => useTheme())
    act(() => result.current[1]())
    expect(root.classList.contains('dark')).toBe(false)
    act(() => transitions.nextFrame())
    expect(root.classList.contains('dark')).toBe(true)
    expect(result.current[0]).toBe('dark')
  })
})
