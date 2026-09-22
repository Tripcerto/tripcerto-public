import { describe, expect, it } from 'vitest'
import {
  buildFlowLines,
  DESKTOP_FLOW,
  flowDrift,
  flowPoint,
  flowSpan,
  MOBILE_FLOW,
  OPACITY_RANGE,
  WIDTH_RANGE,
  type FlowGeometry,
} from './flow-paths-geometry'

const desktop: FlowGeometry = { ...DESKTOP_FLOW, width: 1440, height: 800 }
const mobile: FlowGeometry = { ...MOBILE_FLOW, width: 390, height: 966 }

/* Shortest distance from a point to the offset curve at distance d: a coarse
   sweep of the whole span, then a fine one around the nearest coarse sample. */
function distanceToLine(g: FlowGeometry, d: number, x: number, y: number) {
  const { uMin, uMax } = flowSpan(g)
  const sweep = (from: number, to: number, stride: number) => {
    let best = Infinity
    let at = from
    for (let u = from; u <= to; u += stride) {
      const p = flowPoint(g, d, u)
      const dist = Math.hypot(p.x - x, p.y - y)
      if (dist < best) {
        best = dist
        at = u
      }
    }
    return { best, at }
  }
  const coarse = sweep(uMin, uMax, 2)
  return sweep(coarse.at - 2, coarse.at + 2, 0.01).best
}

/* Projection of the box's farthest corner onto the sweep axis. */
function cornerReach(g: FlowGeometry) {
  const cx = g.width * g.centre[0]
  const cy = g.height * g.centre[1]
  const corners = [
    [0, 0],
    [g.width, 0],
    [0, g.height],
    [g.width, g.height],
  ]
  return Math.max(...corners.map(([x, y]) => Math.abs((x - cx) * Math.cos(g.angle) + (y - cy) * Math.sin(g.angle))))
}

function channels(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

describe('buildFlowLines', () => {
  it.each([
    ['desktop', desktop],
    ['mobile', mobile],
  ])('keeps neighbouring lines exactly one step apart along their length (%s)', (_, g) => {
    const half = g.perGroup - 0.5
    const { uMin, uMax } = flowSpan(g)
    for (const d of [-half * g.step, -g.step / 2, g.step / 2, (half - 1) * g.step]) {
      for (let u = uMin + g.wavelength; u <= uMax; u += g.wavelength / 8) {
        const p = flowPoint(g, d, u)
        expect(distanceToLine(g, d + g.step, p.x, p.y)).toBeCloseTo(g.step, 1)
      }
    }
  })

  it.each([
    ['desktop', desktop],
    ['mobile', mobile],
  ])('draws every line far enough that a whole drift loop never shows an end (%s)', (_, g) => {
    const { uMin, uMax } = flowSpan(g)
    const reach = cornerReach(g)
    expect(uMax).toBeGreaterThan(reach)
    expect(uMin + g.wavelength).toBeLessThan(-reach)
  })

  it('carries the family one wavelength down its own sweep per loop', () => {
    const { dx, dy } = flowDrift(desktop)
    expect(Math.hypot(dx, dy)).toBeCloseTo(desktop.wavelength, 6)
    expect(Math.atan2(dy, dx)).toBeCloseTo(desktop.angle, 6)
  })

  it('mirrors opacity and width from the edges up to the centreline', () => {
    const lines = buildFlowLines(desktop)
    expect(lines).toHaveLength(48)
    expect(lines[0].opacity).toBe(OPACITY_RANGE[0])
    expect(lines[0].width).toBe(WIDTH_RANGE[0])
    expect(lines[23].opacity).toBeGreaterThan(0.8)
    expect(lines[23].width).toBeGreaterThan(1.5)
    for (let j = 0; j < 24; j++) {
      expect(lines[j].opacity).toBe(lines[47 - j].opacity)
      expect(lines[j].width).toBe(lines[47 - j].width)
      if (j > 0) expect(lines[j].opacity).toBeGreaterThan(lines[j - 1].opacity)
    }
    for (const line of lines) {
      expect(line.opacity).toBeGreaterThanOrEqual(OPACITY_RANGE[0])
      expect(line.opacity).toBeLessThanOrEqual(OPACITY_RANGE[1])
      expect(line.width).toBeGreaterThanOrEqual(WIDTH_RANGE[0])
      expect(line.width).toBeLessThanOrEqual(WIDTH_RANGE[1])
    }
  })

  it('ramps pink to peach across the ribbon with neighbours nearly the same', () => {
    const lines = buildFlowLines(desktop)
    expect(lines[0].colour).toBe('#e8437e')
    expect(lines[47].colour).toBe('#ff9b7a')
    for (let j = 1; j < lines.length; j++) {
      const a = channels(lines[j - 1].colour)
      const b = channels(lines[j].colour)
      for (let k = 0; k < 3; k++) expect(Math.abs(a[k] - b[k])).toBeLessThanOrEqual(6)
    }
  })

  it('halves the family on a phone', () => {
    expect(buildFlowLines(mobile)).toHaveLength(24)
  })

  it('emits one cubic chain per line, starting with a move', () => {
    for (const line of buildFlowLines(mobile)) {
      expect(line.d).toMatch(/^M-?\d+\.\d -?\d+\.\d(C(-?\d+\.\d -?\d+\.\d ?){3})+$/)
    }
  })
})
