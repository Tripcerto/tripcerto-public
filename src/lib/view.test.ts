import { describe, expect, it } from 'vitest'
import { inFullView } from './view'

describe('inFullView', () => {
  it('waits while part of a short frame is off screen', () => {
    expect(inFullView(150, 300, 800)).toBe(false)
  })

  it('is in view once all of a short frame is on screen', () => {
    expect(inFullView(300, 300, 800)).toBe(true)
  })

  it('allows a pixel of rounding', () => {
    expect(inFullView(299.2, 300, 800)).toBe(true)
  })

  it('takes a frame taller than the screen as in view once it fills the screen', () => {
    expect(inFullView(600, 1200, 800)).toBe(false)
    expect(inFullView(800, 1200, 800)).toBe(true)
  })

  it('is never in view with nothing visible, however small the frame', () => {
    expect(inFullView(0, 0, 800)).toBe(false)
  })
})
