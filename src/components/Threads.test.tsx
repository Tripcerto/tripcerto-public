import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Threads } from './Threads'

describe('Threads', () => {
  // jsdom has no WebGL, so ogl's `new Renderer()` throws when it can't get a GL
  // context — the same failure real users hit with WebGL disabled/blocklisted.
  // The component must degrade gracefully instead of crashing the tree.
  it('renders the container and does not crash when WebGL is unavailable', () => {
    const { container } = render(<Threads />)
    expect(container.querySelector('.threads-container')).not.toBeNull()
    // graceful degradation: no GL canvas is appended, the surface just shows
    // the page background (matching the reduced-motion fallback).
    expect(container.querySelector('canvas')).toBeNull()
  })
})
