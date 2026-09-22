import { useEffect, useRef } from 'react'
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Timer, Vector2, Vector3, WebGLRenderer } from 'three'
import { cn } from '@/lib/utils'

const MAX_STOPS = 6

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/* A gradient across the stops in a straight line at `angle`, whose
   coordinate is warped by two octaves of drifting simplex noise so the
   bands of colour swell and roll through each other; a second, softer
   noise lifts and lowers the colour along the way so the surface reads as
   folds rather than stripes. Every fragment is a blend of the stops and
   nothing else. */
const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec3 stops[${MAX_STOPS}];
uniform int stopCount;
uniform float angle;
uniform float warp;
uniform float scale;

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
  vec2 p = vec2(uv.x * iResolution.x / iResolution.y, uv.y) * scale;
  float t = iTime;

  vec2 dir = vec2(cos(angle), sin(angle));
  float along = dot(vec2(uv.x, 1.0 - uv.y) - 0.5, dir) + 0.5;

  float n1 = snoise(p * 0.9 + vec2(t * 0.045, -t * 0.03));
  float n2 = snoise(p * 1.8 + vec2(-t * 0.02, t * 0.05) + n1 * 0.6);
  float fold = snoise(p * 0.6 + vec2(t * 0.025, t * 0.015) + n2 * 0.4);

  float coord = along + warp * (0.65 * n1 + 0.35 * n2) + 0.12 * fold;
  gl_FragColor = vec4(ramp(coord), 1.0);
}
`

function hexToVec3(hex: string) {
  const value = hex.trim().replace(/^#/, '')
  const [r, g, b] =
    value.length === 3
      ? [...value].map((c) => parseInt(c + c, 16))
      : value.length === 6
        ? [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16))
        : [255, 255, 255]
  return new Vector3(r / 255, g / 255, b / 255)
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
  /* Feature size: larger draws smaller folds. */
  scale?: number
  /* Time multiplier; 1 is slow. */
  speed?: number
}

export function GradientMesh({ className, colours, angle = 100, warp = 0.28, scale = 1.4, speed = 1 }: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!('WebGLRenderingContext' in window)) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let active = true
    let visible = false
    let running = false
    let raf = 0

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    camera.position.z = 1

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: false })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const stops = colours.slice(0, MAX_STOPS).map(hexToVec3)
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector2(1, 1) },
      stops: { value: Array.from({ length: MAX_STOPS }, (_, i) => stops[Math.min(i, stops.length - 1)]) },
      stopCount: { value: stops.length },
      /* CSS angle to the shader's: CSS 0deg points up and turns clockwise. */
      angle: { value: ((angle - 90) * Math.PI) / 180 },
      warp: { value: warp },
      scale: { value: scale },
    }
    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    const geometry = new PlaneGeometry(2, 2)
    scene.add(new Mesh(geometry, material))
    const timer = new Timer()

    const setSize = () => {
      if (!active) return
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false)
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }
    const renderFrame = () => {
      timer.update()
      uniforms.iTime.value = reducedMotion ? 0 : timer.getElapsed() * speed
      renderer.render(scene, camera)
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

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [colours, angle, warp, scale, speed])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)} />
}
