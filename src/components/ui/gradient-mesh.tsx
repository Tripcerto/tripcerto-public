import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const MAX_STOPS = 6

/* A fullscreen quad in clip space; every pixel is decided by the fragment
   shader, so there is nothing to transform. */
const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

const VERTEX_SHADER = `
precision highp float;

attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

/* A gradient across the stops in a straight line at `angle`, whose
   coordinate is warped by two octaves of drifting simplex noise so the
   bands of colour swell and roll through each other; a second, softer
   noise lifts and lowers the colour along the way so the surface reads as
   folds rather than stripes. Every fragment is a blend of the stops and
   nothing else. */
const FRAGMENT_SHADER = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec3 stops[${MAX_STOPS}];
uniform int stopCount;
uniform float angle;
uniform float warp;
uniform float scale;
uniform vec2 seed;
uniform float bias;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 ramp(float t) {
  float clamped = clamp(t, 0.0, 0.9999);
  float scaled = clamped * float(stopCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  vec3 a = stops[0];
  vec3 b = stops[0];
  for (int i = 0; i < ${MAX_STOPS}; ++i) {
    if (i == idx) a = stops[i];
    if (i == idx + 1) b = stops[i];
  }
  if (idx + 1 >= stopCount) b = a;
  return mix(a, b, smoothstep(0.0, 1.0, f));
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = gl_FragCoord.xy / max(iResolution.x, iResolution.y) * scale + seed;
  float t = iTime;

  vec2 dir = vec2(cos(angle), sin(angle));
  float along = dot(vec2(uv.x, 1.0 - uv.y) - 0.5, dir) + 0.5;

  float n1 = snoise(p * 0.9 + vec2(t * 0.045, -t * 0.03));
  float n2 = snoise(p * 1.8 + vec2(-t * 0.02, t * 0.05) + n1 * 0.6);
  float fold = snoise(p * 0.6 + vec2(t * 0.025, t * 0.015) + n2 * 0.4);

  float coord = along + bias + warp * (0.65 * n1 + 0.35 * n2) + 0.12 * fold;
  gl_FragColor = vec4(ramp(coord), 1.0);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, '')
  const [r, g, b] =
    value.length === 3
      ? [...value].map((c) => parseInt(c + c, 16))
      : value.length === 6
        ? [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16))
        : [255, 255, 255]
  return [r / 255, g / 255, b / 255]
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('GradientMesh: shader failed to compile.', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export interface GradientMeshProps {
  /* The box the canvas fills; the caller sizes it and paints a still
     gradient under it for the no-WebGL case. */
  className?: string
  /* Hex stops blended across the box, first to last (max 6). */
  colours: readonly string[]
  /* Direction of the underlying gradient in degrees, CSS convention: 90 runs left to right. */
  angle?: number
  /* How far the noise pushes a point along the gradient, in gradient lengths. */
  warp?: number
  /* How many folds fit across the box's longer side, so a short wide band
     and a tall one fold at the same size. Larger draws smaller folds. */
  scale?: number
  /* Time multiplier; 1 is slow. */
  speed?: number
}

export function GradientMesh({ className, colours, angle = 100, warp = 0.28, scale = 4.7, speed = 1 }: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!('WebGLRenderingContext' in window)) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
    const stillOnly = () => motionQuery?.matches ?? false
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

    const stops = colours.slice(0, MAX_STOPS).map(hexToRgb)
    const stopCount = stops.length
    /* The shader reads a fixed-length array, so the last stop fills the tail
       and `stopCount` decides how much of it the ramp spans. */
    const stopValues = new Float32Array(MAX_STOPS * 3)
    for (let i = 0; i < MAX_STOPS; i += 1) stopValues.set(stops[Math.min(i, stopCount - 1)] ?? [1, 1, 1], i * 3)
    /* Every mount draws a different band (Taylor, 22 Sep: reloads looked
       "not different enough", the same folds in the same places). The
       noise starts somewhere else in its field, the ramp leans up to a
       fifth of its length towards pink or towards peach, the direction
       turns up to 25° either way and the warp varies a little. A restored
       context redraws the same band. */
    const seed: [number, number] = [Math.random() * 100, Math.random() * 100]
    const bias = (Math.random() - 0.5) * 0.4
    const turned = angle + (Math.random() - 0.5) * 50
    const warped = warp * (0.85 + Math.random() * 0.3)
    /* CSS angle to the shader's: CSS 0deg points up and turns clockwise. */
    const shaderAngle = ((turned - 90) * Math.PI) / 180

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'

    /* Transparent, so any frame the shader has not drawn yet — first paint, a
       resize, a lost context — shows the still gradient underneath instead of
       black. Every fragment writes alpha 1, so drawn pixels are unaffected. */
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false })
    if (!gl) return

    let active = true
    let visible = false
    let running = false
    let ready = false
    let raf = 0
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let uTime: WebGLUniformLocation | null = null
    let uResolution: WebGLUniformLocation | null = null

    /* Everything the context owns, built here and again if the driver takes
       the context away and hands it back. */
    const build = () => {
      const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
      if (!vertex || !fragment) {
        if (vertex) gl.deleteShader(vertex)
        if (fragment) gl.deleteShader(fragment)
        return false
      }

      program = gl.createProgram()
      if (!program) {
        gl.deleteShader(vertex)
        gl.deleteShader(fragment)
        return false
      }
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('GradientMesh: program failed to link.', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        program = null
        return false
      }
      gl.useProgram(program)

      buffer = gl.createBuffer()
      if (!buffer) {
        gl.deleteProgram(program)
        program = null
        return false
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
      const position = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

      uTime = gl.getUniformLocation(program, 'iTime')
      uResolution = gl.getUniformLocation(program, 'iResolution')
      gl.uniform3fv(gl.getUniformLocation(program, 'stops'), stopValues)
      gl.uniform1i(gl.getUniformLocation(program, 'stopCount'), stopCount)
      gl.uniform1f(gl.getUniformLocation(program, 'angle'), shaderAngle)
      gl.uniform1f(gl.getUniformLocation(program, 'warp'), warped)
      gl.uniform1f(gl.getUniformLocation(program, 'scale'), scale)
      gl.uniform2f(gl.getUniformLocation(program, 'seed'), seed[0], seed[1])
      gl.uniform1f(gl.getUniformLocation(program, 'bias'), bias)
      return true
    }

    const setSize = () => {
      if (!active || !ready) return
      const width = Math.floor((container.clientWidth || 1) * pixelRatio)
      const height = Math.floor((container.clientHeight || 1) * pixelRatio)
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
    }

    /* A random phase, so the band is somewhere else in its roll on every load.
       Capped at two minutes to keep the noise inputs small on mediump GPUs. */
    const startedAt = performance.now() - Math.random() * 120_000
    const renderFrame = () => {
      if (!ready) return
      gl.uniform1f(uTime, stillOnly() ? 0 : ((performance.now() - startedAt) / 1000) * speed)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const renderLoop = () => {
      if (!active || !visible || !ready || stillOnly()) {
        running = false
        return
      }
      renderFrame()
      raf = requestAnimationFrame(renderLoop)
    }
    /* Observer callbacks run after the frame's animation callbacks and before
       paint, so the first frame is drawn here rather than scheduled: a canvas
       that reaches the compositor undrawn is a hole in the hero. */
    const start = () => {
      if (!ready) return
      renderFrame()
      if (stillOnly() || running) return
      running = true
      raf = requestAnimationFrame(renderLoop)
    }

    /* A lost context is only restorable if the default is prevented. */
    const onContextLost = (event: Event) => {
      event.preventDefault()
      ready = false
      running = false
      cancelAnimationFrame(raf)
    }
    const onContextRestored = () => {
      if (!active) return
      ready = build()
      setSize()
      if (visible) start()
    }
    /* Every exit path gives the context back; a mount that keeps one alive
       counts against the browser's per-page limit until it is collected. */
    const release = () => {
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }

    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    ready = build()
    if (!ready) {
      release()
      return
    }
    container.appendChild(canvas)
    setSize()
    renderFrame()

    /* Sizing the canvas clears its buffer, and this runs after the frame's
       draw, so the frame composites empty unless it is redrawn here. */
    const resizeObserver = new ResizeObserver(() => {
      setSize()
      renderFrame()
    })
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    intersectionObserver.observe(container)

    const onMotionChange = () => {
      cancelAnimationFrame(raf)
      running = false
      if (visible) start()
    }
    motionQuery?.addEventListener('change', onMotionChange)

    return () => {
      active = false
      ready = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motionQuery?.removeEventListener('change', onMotionChange)
      release()
    }
  }, [colours, angle, warp, scale, speed])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)} />
}
