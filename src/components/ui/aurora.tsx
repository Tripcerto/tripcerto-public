import { useEffect, useRef } from 'react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { cn } from '@/lib/utils'

const vertexShader = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uOpacity;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

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

/* Piecewise linear across the three stops at 0, 0.5 and 1. */
vec3 ramp(float t) {
  return t < 0.5
    ? mix(uColorStops[0], uColorStops[1], t * 2.0)
    : mix(uColorStops[1], uColorStops[2], (t - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 rampColor = ramp(clamp(uv.x, 0.0, 1.0));

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = uv.y * 2.0 - height + 0.2;
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  float energy = clamp(intensity, 0.0, 1.0);
  float coverage = auroraAlpha * (0.55 + 0.45 * energy) * uOpacity;

  fragColor = vec4(rampColor * coverage, coverage);
}
`

/* Under this width the pixel-ratio cap drops and mobileAmplitude applies. */
const NARROW = '(max-width: 767px)'

function toRgb(hex: string): [number, number, number] {
  const c = new Color(hex)
  return [c.r, c.g, c.b]
}

export interface AuroraProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  /* Three hex stops, left to right. */
  colorStops?: [string, string, string]
  /* Height of the wave along the band's lower edge. */
  amplitude?: number
  /* Amplitude under 768px, where the pixel-ratio cap also drops to 1.5. */
  mobileAmplitude?: number
  /* Width of the soft edge, 0 to 1. */
  blend?: number
  speed?: number
  /* Ceiling on how much of a stop shows through; the band fades to the page from there. */
  opacity?: number
}

/* React Bits "Aurora": a band of colour whose lower edge undulates with
   simplex noise, drawn by an OGL fragment shader on one triangle. The canvas
   is transparent and the fragment is premultiplied, so over paper every pixel
   is a tint of the stop colour and nothing else shows. The loop runs only
   while the canvas is on screen, reduced motion gets one still frame, and no
   WebGL2 means no canvas at all. */
export function Aurora({
  className,
  colorStops = ['#E8437E', '#FF5C6C', '#FF9B7A'],
  amplitude = 1,
  mobileAmplitude = amplitude,
  blend = 0.5,
  speed = 1,
  opacity = 0.7,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('WebGLRenderingContext' in window)) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const narrow = window.matchMedia(NARROW)
    let active = true
    let visible = false
    let running = false
    let raf = 0
    let elapsed = 0
    let last = 0

    let renderer: Renderer
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, depth: false, dpr: 1 })
    } catch {
      return
    }
    if (!renderer.gl || !renderer.isWebgl2) return
    const gl = renderer.gl
    gl.canvas.style.display = 'block'
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    /* The vertex shader reads only position; an unused uv buffer is not worth uploading. */
    delete geometry.attributes.uv

    const uniforms = {
      uTime: { value: 0 },
      uAmplitude: { value: narrow.matches ? mobileAmplitude : amplitude },
      uColorStops: { value: colorStops.map(toRgb) },
      uResolution: { value: [1, 1] },
      uBlend: { value: blend },
      uOpacity: { value: opacity },
    }
    const program = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms })
    const mesh = new Mesh(gl, { geometry, program })

    const render = () => renderer.render({ scene: mesh })

    /* gl_FragCoord is in device pixels, so the resolution is the drawing buffer, not the CSS box. */
    const setSize = () => {
      if (!active) return
      renderer.dpr = Math.min(window.devicePixelRatio || 1, narrow.matches ? 1.5 : 2)
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1)
      uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
    }

    const frame = (now: number) => {
      if (!active || !visible) {
        running = false
        return
      }
      if (last) elapsed += (now - last) / 1000
      last = now
      uniforms.uTime.value = elapsed * speed
      render()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (reducedMotion) {
        render()
        return
      }
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (reducedMotion && visible) render()
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    intersectionObserver.observe(container)

    const handleNarrowChange = () => {
      uniforms.uAmplitude.value = narrow.matches ? mobileAmplitude : amplitude
      setSize()
      if (reducedMotion && visible) render()
    }
    narrow.addEventListener('change', handleNarrowChange)

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      narrow.removeEventListener('change', handleNarrowChange)
      geometry.remove()
      program.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [colorStops, amplitude, mobileAmplitude, blend, speed, opacity])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none overflow-hidden', className)} />
}
