/* Geometry for FlowPaths: one master curve, a family of true parallel offsets,
   and the ramps that colour them. Pure, so the component stays a thin shell. */

export interface FlowPreset {
  /* Where the ribbon's centreline crosses the box, as fractions of its size. */
  centre: readonly [number, number]
  /* Sweep below the horizontal, radians; positive descends to the right. */
  angle: number
  /* The master curve's single gentle bend, CSS px along and across the sweep. */
  wavelength: number
  amplitude: number
  /* Perpendicular distance between neighbouring lines, CSS px. */
  step: number
  /* Lines on each side of the centreline. */
  perGroup: number
}

export interface FlowGeometry extends FlowPreset {
  width: number
  height: number
}

export interface FlowLine {
  d: string
  colour: string
  opacity: number
  width: number
}

export const DESKTOP_FLOW: FlowPreset = {
  centre: [0.54, 0.44],
  angle: (22 * Math.PI) / 180,
  wavelength: 2000,
  amplitude: 80,
  step: 10,
  perGroup: 24,
}

export const MOBILE_FLOW: FlowPreset = {
  centre: [0.5, 0.66],
  angle: (30 * Math.PI) / 180,
  wavelength: 1100,
  amplitude: 30,
  step: 10,
  perGroup: 12,
}

/* Outermost line to centreline. */
export const OPACITY_RANGE = [0.35, 0.85] as const
export const WIDTH_RANGE = [1, 1.6] as const

/* Ember, first line to last: pink, primary, accent, peach. */
const RAMP: ReadonlyArray<readonly [number, number, number]> = [
  [0xe8, 0x43, 0x7e],
  [0xff, 0x5c, 0x6c],
  [0xff, 0x7a, 0x5c],
  [0xff, 0x9b, 0x7a],
]

const SEGMENTS_PER_WAVE = 16
/* Covers the offset's shift along the sweep at the steepest slope plus the parallax. */
const REACH_MARGIN = 80

export function rampColour(t: number): string {
  const last = RAMP.length - 1
  const scaled = Math.min(Math.max(t, 0), 1) * last
  const i = Math.min(Math.floor(scaled), last - 1)
  const f = scaled - i
  const a = RAMP[i]
  const b = RAMP[i + 1]
  const channel = (k: 0 | 1 | 2) =>
    Math.round(a[k] + (b[k] - a[k]) * f)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(0)}${channel(1)}${channel(2)}`
}

function lerp(range: readonly [number, number], t: number) {
  return range[0] + (range[1] - range[0]) * t
}

/* How far along the sweep each line must be drawn. The box's farthest corner
   sets the reach; the drift shifts the family one wavelength down the sweep
   over its loop, so the drawn curve starts a wavelength further back. */
export function flowSpan(g: FlowGeometry) {
  const cos = Math.abs(Math.cos(g.angle))
  const sin = Math.abs(Math.sin(g.angle))
  const cx = g.width * g.centre[0]
  const cy = g.height * g.centre[1]
  const reach = Math.max(cx, g.width - cx) * cos + Math.max(cy, g.height - cy) * sin + REACH_MARGIN
  return { uMin: -reach - g.wavelength, uMax: reach, du: g.wavelength / SEGMENTS_PER_WAVE }
}

/* The offset curve at signed distance d from the master, at parameter u along
   the sweep: the screen point and its tangent per unit of u. The master is
   f(u) = A sin(ku); its left normal is (-f', 1)/s and its curvature f''/s^3,
   so the offset's tangent is the master's scaled by (1 - d * curvature). */
export function flowPoint(g: FlowGeometry, d: number, u: number) {
  const k = (2 * Math.PI) / g.wavelength
  const phase = k * u
  const f = g.amplitude * Math.sin(phase)
  const f1 = g.amplitude * k * Math.cos(phase)
  const f2 = -g.amplitude * k * k * Math.sin(phase)
  const s = Math.hypot(1, f1)
  const ru = u - (d * f1) / s
  const rv = f + d / s
  const stretch = 1 - (d * f2) / (s * s * s)
  const tv = f1 * stretch
  const cos = Math.cos(g.angle)
  const sin = Math.sin(g.angle)
  return {
    x: g.width * g.centre[0] + ru * cos - rv * sin,
    y: g.height * g.centre[1] + ru * sin + rv * cos,
    mx: stretch * cos - tv * sin,
    my: stretch * sin + tv * cos,
  }
}

/* The translation that carries the family one wavelength down its own sweep.
   The offsets of a periodic master are periodic with it, so the picture at
   the end of the drift is the picture at its start. */
export function flowDrift(g: FlowGeometry) {
  return { dx: g.wavelength * Math.cos(g.angle), dy: g.wavelength * Math.sin(g.angle) }
}

function fmt(n: number) {
  return n.toFixed(1)
}

/* Two mirrored groups of perGroup lines, one each side of the master, ordered
   from the ribbon's upper edge to its lower edge. Each line is a chain of
   cubic Hermite segments through exact points with exact tangents. */
export function buildFlowLines(g: FlowGeometry): FlowLine[] {
  const { uMin, uMax, du } = flowSpan(g)
  const segments = Math.ceil((uMax - uMin) / du)
  const total = g.perGroup * 2
  const half = (total - 1) / 2
  const lines: FlowLine[] = []

  for (let j = 0; j < total; j++) {
    const d = (j - half) * g.step
    const inward = 1 - Math.abs(j - half) / half
    let prev = flowPoint(g, d, uMin)
    let path = `M${fmt(prev.x)} ${fmt(prev.y)}`
    for (let i = 1; i <= segments; i++) {
      const next = flowPoint(g, d, uMin + i * du)
      path +=
        `C${fmt(prev.x + (prev.mx * du) / 3)} ${fmt(prev.y + (prev.my * du) / 3)} ` +
        `${fmt(next.x - (next.mx * du) / 3)} ${fmt(next.y - (next.my * du) / 3)} ` +
        `${fmt(next.x)} ${fmt(next.y)}`
      prev = next
    }
    lines.push({
      d: path,
      colour: rampColour(j / (total - 1)),
      opacity: Number(lerp(OPACITY_RANGE, inward).toFixed(3)),
      width: Number(lerp(WIDTH_RANGE, inward).toFixed(2)),
    })
  }

  return lines
}
