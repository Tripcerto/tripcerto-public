import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { cn } from '@/lib/utils'

const vertexShader = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float amplitude;
uniform float spread;
uniform float center;
uniform vec2 pointer;
uniform int lineCount;
uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform float lineWidth;
uniform float lineWidthEnd;
uniform float lineBlur;
uniform float lineOpacity;
uniform float lineOpacityEnd;

out vec4 fragColor;

float perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
    * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
    * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

vec3 rampColor(float t) {
  if (lineGradientCount <= 1) {
    return lineGradient[0];
  }
  float scaled = clamp(t, 0.0, 0.9999) * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  int idx2 = min(idx + 1, lineGradientCount - 1);
  return mix(lineGradient[idx], lineGradient[idx2], fract(scaled));
}

/* Height of line perc at column x, in uv units: flat from the left edge
   until its split point, then two octaves of drifting noise. k is width
   over height capped at 1, so a portrait phone gets the same curves in
   pixels as a landscape screen instead of a fan the height of the box. */
float lineHeight(float x, float perc, float k) {
  float splitPoint = 0.1 + perc * 0.4;
  float ramp = smoothstep(splitPoint, 0.7, x);
  float amp = ramp * 0.5 * amplitude * (1.0 + (pointer.y - 0.5) * 0.2) * k;
  float t = iTime / 10.0 + (pointer.x - 0.5);
  float nx = x * k;
  float n = mix(
    perlin2D(vec2(t, nx + perc) * 2.5),
    perlin2D(vec2(t, nx + t) * 3.5) / 1.5,
    x * 0.3
  );
  return center + (perc - 0.5) * spread + n * 0.5 * amp;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float k = min(iResolution.z, 1.0);
  float last = max(float(lineCount - 1), 1.0);

  vec3 paint = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < lineCount; ++i) {
    float perc = float(i) / float(lineCount);
    float t = float(i) / last;

    float y = lineHeight(uv.x, perc, k);
    float slope = dFdx(y) * iResolution.y;
    float d = abs(uv.y - y) * iResolution.y * inversesqrt(1.0 + slope * slope);

    float radius = mix(lineWidth, lineWidthEnd, t) * 0.5;
    float a = (1.0 - smoothstep(radius - lineBlur, radius + lineBlur, d)) * mix(lineOpacity, lineOpacityEnd, t);

    vec3 c = rampColor(t);
    paint = paint * (1.0 - a) + c * a;
    alpha = alpha * (1.0 - a) + a;
  }

  fragColor = vec4(paint, alpha);
}
`

const MAX_GRADIENT_STOPS = 8
const MOBILE_BREAKPOINT = 768
const DEFAULT_GRADIENT = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

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

export interface ThreadsProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  /* Hex stops the lines are coloured across, first line to last (max 8). */
  linesGradient?: string[]
  /* Lines drawn at 768px and wider, and below it. */
  lineCount?: number
  mobileLineCount?: number
  /* How far the threads fan out, and how far apart they sit before the noise. */
  amplitude?: number
  distance?: number
  /* Where the bundle leaves the left edge, 0 at the bottom of the box to 1 at the top. */
  center?: number
  mobileCenter?: number
  /* Pointer bends the field; mouse only, never touch. */
  interactive?: boolean
  mouseDamping?: number
  /* Stroke width and opacity in CSS pixels and 0 to 1, first line to last. */
  lineWidth?: number
  lineWidthEnd?: number
  /* Edge softness in CSS pixels each side of the stroke; 0.5 is a crisp antialias. */
  lineBlur?: number
  lineOpacity?: number
  lineOpacityEnd?: number
}

/* React Bits "Threads": a bundle of thin lines that leaves the left edge as
   one thread and fans out across the box on drifting noise, with the pointer
   scrubbing the field. The canvas is transparent and writes premultiplied
   colour, so the lines sit on the paper instead of on the original's black.
   Each line is an antialiased stroke of a set width measured perpendicular
   to its slope, coloured along an Ember ramp by its index. The pointer is
   read from the window so content stacked over the canvas does not block
   it. The loop runs only while the canvas is on screen, reduced motion gets
   one still frame, and no WebGL2 means no canvas at all. */
export function Threads({
  className,
  linesGradient = DEFAULT_GRADIENT,
  lineCount = 36,
  mobileLineCount = 18,
  amplitude = 1,
  distance = 0,
  center = 0.5,
  mobileCenter = 0.5,
  interactive = true,
  mouseDamping = 0.05,
  lineWidth = 1.5,
  lineWidthEnd = 1.5,
  lineBlur = 0.5,
  lineOpacity = 0.85,
  lineOpacityEnd = 0.6,
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('WebGL2RenderingContext' in window)) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const pointerActive = interactive && !reducedMotion
    let active = true
    let visible = false
    let running = false
    let mobile = false
    let raf = 0
    let elapsed = 0
    let lastFrame = 0

    const targetPointer = [0.5, 0.5]
    const currentPointer = new Float32Array([0.5, 0.5])

    let renderer: Renderer
    try {
      renderer = new Renderer({ alpha: true, depth: false, antialias: false, premultipliedAlpha: true })
    } catch {
      return
    }
    const gl = renderer.gl
    if (!renderer.isWebgl2) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      return
    }
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const stops = (linesGradient.length > 0 ? linesGradient : DEFAULT_GRADIENT).slice(0, MAX_GRADIENT_STOPS)
    const gradient = Array.from({ length: MAX_GRADIENT_STOPS }, (_, i) => hexToRgb(stops[Math.min(i, stops.length - 1)]))

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1, 1]) },
      amplitude: { value: amplitude },
      spread: { value: distance },
      center: { value: center },
      pointer: { value: currentPointer },
      lineCount: { value: lineCount },
      lineGradient: { value: gradient },
      lineGradientCount: { value: stops.length },
      lineWidth: { value: lineWidth },
      lineWidthEnd: { value: lineWidthEnd },
      lineBlur: { value: lineBlur },
      lineOpacity: { value: lineOpacity },
      lineOpacityEnd: { value: lineOpacityEnd },
    }

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new Mesh(gl, { geometry, program })

    const setSize = () => {
      if (!active) return
      mobile = window.innerWidth < MOBILE_BREAKPOINT
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      renderer.dpr = dpr
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1)
      uniforms.iResolution.value[0] = canvas.width
      uniforms.iResolution.value[1] = canvas.height
      uniforms.iResolution.value[2] = canvas.width / canvas.height
      uniforms.lineCount.value = mobile ? mobileLineCount : lineCount
      uniforms.center.value = mobile ? mobileCenter : center
      uniforms.lineWidth.value = lineWidth * dpr
      uniforms.lineWidthEnd.value = lineWidthEnd * dpr
      uniforms.lineBlur.value = Math.max(lineBlur, 0.5) * dpr
      if (mobile) {
        targetPointer[0] = 0.5
        targetPointer[1] = 0.5
      }
    }

    const renderFrame = () => {
      const now = performance.now()
      if (!reducedMotion) {
        elapsed += Math.min((now - lastFrame) / 1000, 0.1)
      }
      lastFrame = now
      uniforms.iTime.value = elapsed

      if (pointerActive) {
        currentPointer[0] += (targetPointer[0] - currentPointer[0]) * mouseDamping
        currentPointer[1] += (targetPointer[1] - currentPointer[1]) * mouseDamping
      }

      renderer.render({ scene: mesh })
    }

    const renderLoop = () => {
      if (!active || !visible) {
        running = false
        return
      }
      renderFrame()
      raf = requestAnimationFrame(renderLoop)
    }

    const start = () => {
      if (reducedMotion) {
        renderFrame()
        return
      }
      if (running) return
      running = true
      lastFrame = performance.now()
      raf = requestAnimationFrame(renderLoop)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (reducedMotion && visible) renderFrame()
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    intersectionObserver.observe(container)

    const handlePointerMove = (event: PointerEvent) => {
      if (mobile || event.pointerType === 'touch') return
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      targetPointer[0] = inside ? x : 0.5
      targetPointer[1] = inside ? y : 0.5
    }

    if (pointerActive) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      if (pointerActive) window.removeEventListener('pointermove', handlePointerMove)
      geometry.remove()
      program.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [
    linesGradient,
    lineCount,
    mobileLineCount,
    amplitude,
    distance,
    center,
    mobileCenter,
    interactive,
    mouseDamping,
    lineWidth,
    lineWidthEnd,
    lineBlur,
    lineOpacity,
    lineOpacityEnd,
  ])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)} />
}
