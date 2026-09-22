export type Noise3 = (x: number, y: number, z: number) => number

export interface FieldParams {
  /* Mean heading in radians, canvas y down: 0 is left to right, positive dips. */
  baseAngle: number
  /* Radians the noise may swing a line off the mean heading. */
  spread: number
  /* Reciprocal of the feature size in CSS px. */
  scale: number
  /* CSS px advanced per integration step. */
  step: number
}

export interface WarpParams {
  /* Furthest a point moves from rest, in CSS px. */
  amplitude: number
  /* Reciprocal of the warp's feature size in CSS px; keep it several times
     the line spacing so neighbours move together and never meet. */
  scale: number
}

export interface ComposeOptions {
  width: number
  height: number
  /* CSS px a line may run past each edge before it stops. */
  pad: number
  lineCount: number
  /* Closest two lines may sit, in CSS px. */
  spacing: number
  /* Multiplier on spacing at the top edge, easing to 1 by 60% of the height. */
  topSpacing: number
  /* Target length of a line as fractions of the width, min and max. */
  lengthRange: readonly [number, number]
  /* Lines shorter than this many CSS px are dropped. */
  minLength: number
  seed: number
  field: FieldParams
  warp: WarpParams
  /* Hex stops the family is coloured across, first line to last. */
  colours: readonly string[]
  /* Opacity of the first and last line; the family ramps between. */
  opacity: readonly [number, number]
}

export interface ComposedLine {
  /* Index of the first x in points; count points follow as x, y pairs. */
  offset: number
  count: number
  /* "r,g,b" ready for an rgba() string. */
  colour: string
  alpha: number
}

export interface FlowComposition {
  width: number
  height: number
  noise: Noise3
  warp: WarpParams
  /* Every line's rest points, packed. */
  points: Float64Array
  lines: ComposedLine[]
  /* Floats needed to hold the longest line's points. */
  capacity: number
}

const GRAD_X = [1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0]
const GRAD_Y = [1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1]
const GRAD_Z = [0, 0, 0, 0, 1, 1, -1, -1, 1, 1, -1, -1]
const F3 = 1 / 3
const G3 = 1 / 6

/* Vertices between warp samples; the warp is smooth at this scale, so the
   points between two samples take the straight blend of them. */
const WARP_STRIDE = 4

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Gustavson's 3D simplex noise over a permutation shuffled from the seed, so
   the same seed draws the same field on every load. */
export function createNoise3(seed: number): Noise3 {
  const random = mulberry32(seed)
  const source = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const swap = source[i]
    source[i] = source[j]
    source[j] = swap
  }
  const perm = new Uint8Array(512)
  const permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) {
    perm[i] = source[i & 255]
    permMod12[i] = perm[i] % 12
  }

  return (x, y, z) => {
    const s = (x + y + z) * F3
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)
    const k = Math.floor(z + s)
    const t = (i + j + k) * G3
    const x0 = x - (i - t)
    const y0 = y - (j - t)
    const z0 = z - (k - t)

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1
      }
    } else if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0
    }

    const x1 = x0 - i1 + G3
    const y1 = y0 - j1 + G3
    const z1 = z0 - k1 + G3
    const x2 = x0 - i2 + 2 * G3
    const y2 = y0 - j2 + 2 * G3
    const z2 = z0 - k2 + 2 * G3
    const x3 = x0 - 1 + 3 * G3
    const y3 = y0 - 1 + 3 * G3
    const z3 = z0 - 1 + 3 * G3

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255
    const g0 = permMod12[ii + perm[jj + perm[kk]]]
    const g1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]
    const g2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]
    const g3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]

    let n = 0
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    if (t0 > 0) {
      t0 *= t0
      n += t0 * t0 * (GRAD_X[g0] * x0 + GRAD_Y[g0] * y0 + GRAD_Z[g0] * z0)
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    if (t1 > 0) {
      t1 *= t1
      n += t1 * t1 * (GRAD_X[g1] * x1 + GRAD_Y[g1] * y1 + GRAD_Z[g1] * z1)
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    if (t2 > 0) {
      t2 *= t2
      n += t2 * t2 * (GRAD_X[g2] * x2 + GRAD_Y[g2] * y2 + GRAD_Z[g2] * z2)
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    if (t3 > 0) {
      t3 *= t3
      n += t3 * t3 * (GRAD_X[g3] * x3 + GRAD_Y[g3] * y3 + GRAD_Z[g3] * z3)
    }
    return 32 * n
  }
}

function halton(index: number, base: number) {
  let result = 0
  let f = 1 / base
  let i = index
  while (i > 0) {
    result += f * (i % base)
    i = Math.floor(i / base)
    f /= base
  }
  return result
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, '')
  const wide = value.length === 3 ? [...value].map((c) => c + c).join('') : value
  const n = parseInt(wide, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rampColour(stops: readonly (readonly [number, number, number])[], t: number) {
  if (stops.length === 1) return stops[0]
  const scaled = Math.min(t, 0.9999) * (stops.length - 1)
  const index = Math.floor(scaled)
  const f = scaled - index
  const a = stops[index]
  const b = stops[index + 1]
  return [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f), Math.round(a[2] + (b[2] - a[2]) * f)]
}

function headingAt(noise: Noise3, field: FieldParams, x: number, y: number) {
  const s = field.scale
  const n = noise(x * s, y * s, 0) + 0.4 * noise(x * s * 2.3 + 11.7, y * s * 2.3 + 5.3, 2.1)
  return field.baseAngle + (field.spread * n) / 1.4
}

/* Euler-steps a streamline from (x, y) along the field, sign -1 upstream,
   writing each new point into out from offset. Returns the points written;
   the line ends before the point that trips stop. */
function trace(
  noise: Noise3,
  field: FieldParams,
  x: number,
  y: number,
  sign: number,
  maxSteps: number,
  out: Float64Array,
  offset: number,
  stop: (x: number, y: number) => boolean,
) {
  let px = x
  let py = y
  let n = 0
  for (; n < maxSteps; n++) {
    const a = headingAt(noise, field, px, py)
    px += Math.cos(a) * field.step * sign
    py += Math.sin(a) * field.step * sign
    if (stop(px, py)) break
    out[offset + 2 * n] = px
    out[offset + 2 * n + 1] = py
  }
  return n
}

/* Picks the family once per size. Seeds walk a Halton sequence so the first
   lineCount accepted are spread across the box; a Jobard-Lefer occupancy grid
   refuses a seed inside `spacing` of any drawn line and ends a trace that
   closes within 0.65 of it, so lines merge softly instead of crossing. */
export function composeField(options: ComposeOptions): FlowComposition {
  const {
    width,
    height,
    pad,
    lineCount,
    spacing,
    topSpacing,
    lengthRange,
    minLength,
    seed,
    field,
    warp,
    colours,
    opacity,
  } = options
  const noise = createNoise3(seed)
  const random = mulberry32(seed ^ 0x5bd1e995)

  const cell = spacing
  const cols = Math.ceil((width + 2 * pad) / cell) + 1
  const rows = Math.ceil((height + 2 * pad) / cell) + 1
  const grid: number[][] = Array.from({ length: cols * rows }, () => [])
  const reach = Math.ceil(topSpacing)

  const separation = (y: number) => spacing * (1 + (topSpacing - 1) * (1 - smoothstep(height * 0.2, height * 0.6, y)))

  const crowded = (x: number, y: number, radius: number) => {
    const r2 = radius * radius
    const c = Math.floor((x + pad) / cell)
    const r = Math.floor((y + pad) / cell)
    for (let j = Math.max(0, r - reach); j <= Math.min(rows - 1, r + reach); j++) {
      for (let i = Math.max(0, c - reach); i <= Math.min(cols - 1, c + reach); i++) {
        const bucket = grid[j * cols + i]
        for (let k = 0; k < bucket.length; k += 2) {
          const dx = bucket[k] - x
          const dy = bucket[k + 1] - y
          if (dx * dx + dy * dy < r2) return true
        }
      }
    }
    return false
  }

  const occupy = (x: number, y: number) => {
    const c = Math.floor((x + pad) / cell)
    const r = Math.floor((y + pad) / cell)
    if (c < 0 || c >= cols || r < 0 || r >= rows) return
    grid[r * cols + c].push(x, y)
  }

  const stop = (x: number, y: number) =>
    x < -pad || x > width + pad || y < -pad || y > height + pad || crowded(x, y, separation(y) * 0.65)

  const maxSteps = Math.ceil((lengthRange[1] * width) / field.step) + 2
  const capacity = (maxSteps + 2) * 2
  const forwardBuffer = new Float64Array(capacity)
  const backwardBuffer = new Float64Array(capacity)
  const seeds: { x: number; y: number; points: Float64Array }[] = []

  for (let i = 1; seeds.length < lineCount && i < lineCount * 60; i++) {
    const x = halton(i, 2) * width
    const y = halton(i, 3) * height
    if (crowded(x, y, separation(y))) continue

    const length = (lengthRange[0] + (lengthRange[1] - lengthRange[0]) * random()) * width
    const share = 0.5 + 0.35 * random()
    const forward = trace(noise, field, x, y, 1, Math.round((length * share) / field.step), forwardBuffer, 0, stop)
    const backward = trace(
      noise,
      field,
      x,
      y,
      -1,
      Math.round((length * (1 - share)) / field.step),
      backwardBuffer,
      0,
      stop,
    )
    if ((forward + backward) * field.step < minLength) continue

    const points = new Float64Array((backward + 1 + forward) * 2)
    for (let k = 0; k < backward; k++) {
      points[2 * k] = backwardBuffer[2 * (backward - 1 - k)]
      points[2 * k + 1] = backwardBuffer[2 * (backward - 1 - k) + 1]
    }
    points[2 * backward] = x
    points[2 * backward + 1] = y
    points.set(forwardBuffer.subarray(0, forward * 2), 2 * (backward + 1))
    for (let k = 0; k < points.length; k += 2) occupy(points[k], points[k + 1])
    seeds.push({ x, y, points })
  }

  const nx = -Math.sin(field.baseAngle)
  const ny = Math.cos(field.baseAngle)
  seeds.sort((a, b) => a.x * nx + a.y * ny - (b.x * nx + b.y * ny))

  const stops = colours.map(parseHex)
  const total = seeds.reduce((sum, s) => sum + s.points.length, 0)
  const points = new Float64Array(total)
  let offset = 0
  const lines = seeds.map((s, index) => {
    const t = seeds.length > 1 ? index / (seeds.length - 1) : 0
    points.set(s.points, offset)
    const line: ComposedLine = {
      offset,
      count: s.points.length / 2,
      colour: rampColour(stops, t).join(','),
      alpha: opacity[0] + (opacity[1] - opacity[0]) * t,
    }
    offset += s.points.length
    return line
  })

  return { width, height, noise, warp, points, lines, capacity }
}

let scratch = new Float64Array(0)

/* Copies one line's rest points into out, displaced by the warp at time t.
   The warp is sampled every WARP_STRIDE vertices and blended between. */
function warpLine(composition: FlowComposition, line: ComposedLine, t: number, out: Float64Array) {
  const { points, noise, warp } = composition
  const { offset, count } = line
  const s = warp.scale
  const a = warp.amplitude

  let prevDx = 0
  let prevDy = 0
  let prevIndex = 0
  for (let anchor = 0; anchor < count + WARP_STRIDE; anchor += WARP_STRIDE) {
    const index = Math.min(anchor, count - 1)
    const px = points[offset + 2 * index]
    const py = points[offset + 2 * index + 1]
    const dx = a * noise(px * s, py * s, t)
    const dy = a * noise(px * s + 31.4, py * s + 17.2, t + 5.7)
    if (anchor === 0) {
      out[0] = px + dx
      out[1] = py + dy
    } else {
      const span = index - prevIndex
      for (let i = prevIndex + 1; i <= index; i++) {
        const f = (i - prevIndex) / span
        out[2 * i] = points[offset + 2 * i] + prevDx + (dx - prevDx) * f
        out[2 * i + 1] = points[offset + 2 * i + 1] + prevDy + (dy - prevDy) * f
      }
    }
    prevDx = dx
    prevDy = dy
    prevIndex = index
    if (index === count - 1) break
  }
}

/* Strokes one line with its alpha ramping in over the first 15% of its length
   and out over the last 15%. Canvas cannot vary alpha along a path, so the
   ramp is a gradient along the chord with its stops at the chord projections
   of the two arc-length points; the field never turns a line back on itself,
   so the projection stays monotonic. */
function strokeFaded(ctx: CanvasRenderingContext2D, pts: Float64Array, count: number, colour: string, alpha: number) {
  const last = 2 * (count - 1)
  const x0 = pts[0]
  const y0 = pts[1]
  const cx = pts[last] - x0
  const cy = pts[last + 1] - y0
  const chord2 = cx * cx + cy * cy
  if (chord2 < 1) return

  let length = 0
  for (let i = 2; i <= last; i += 2) length += Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1])
  if (length < 1) return

  const project = (x: number, y: number) => ((x - x0) * cx + (y - y0) * cy) / chord2
  const at = (target: number) => {
    let run = 0
    for (let i = 2; i <= last; i += 2) {
      const seg = Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1])
      if (run + seg >= target) {
        const f = seg > 0 ? (target - run) / seg : 0
        return project(pts[i - 2] + (pts[i] - pts[i - 2]) * f, pts[i - 1] + (pts[i + 1] - pts[i - 1]) * f)
      }
      run += seg
    }
    return 1
  }

  const fade = length * 0.15
  const tIn = Math.min(0.49, Math.max(0.01, at(fade)))
  const tOut = Math.max(0.51, Math.min(0.99, at(length - fade)))

  const gradient = ctx.createLinearGradient(x0, y0, pts[last], pts[last + 1])
  gradient.addColorStop(0, `rgba(${colour},0)`)
  gradient.addColorStop(tIn, `rgba(${colour},${alpha})`)
  gradient.addColorStop(tOut, `rgba(${colour},${alpha})`)
  gradient.addColorStop(1, `rgba(${colour},0)`)

  ctx.strokeStyle = gradient
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  for (let i = 2; i <= last; i += 2) ctx.lineTo(pts[i], pts[i + 1])
  ctx.stroke()
}

/* Strokes every composed line displaced by the warp at noise time t. The
   rest points never change, so the family keeps the spacing it was composed
   with however far t advances. */
export function paintField(ctx: CanvasRenderingContext2D, composition: FlowComposition, t: number, lineWidth: number) {
  const { lines, capacity } = composition
  if (scratch.length < capacity) scratch = new Float64Array(capacity)
  const pts = scratch

  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const line of lines) {
    if (line.count < 3) continue
    warpLine(composition, line, t, pts)
    strokeFaded(ctx, pts, line.count, line.colour, line.alpha)
  }
}
