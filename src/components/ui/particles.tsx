import { useEffect, useRef } from 'react'
import { Camera, Geometry, Mesh, Program, Renderer } from 'ogl'
import { cn } from '@/lib/utils'

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = random;
  vColor = color;

  vec3 pos = position * uSpread;
  pos.z *= 10.0;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

  vec4 mvPos = viewMatrix * mPos;

  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`

/* The shimmer scales the particle's own colour instead of adding a per-channel
   sine, so a coral particle never drifts through green on its way round. */
const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uAlphaParticles;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  float shimmer = 0.92 + 0.08 * sin(uTime * 1.5 + vRandom.y * 6.28);
  vec3 col = vColor * shimmer;

  if (uAlphaParticles < 0.5) {
    if (d > 0.5) {
      discard;
    }
    gl_FragColor = vec4(col, 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(col, circle);
  }
}
`

const DEFAULT_COLOURS = ['#ffffff']

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

function pixelRatioFor(viewportWidth: number) {
  return Math.min(window.devicePixelRatio || 1, viewportWidth < 768 ? 1.5 : 2)
}

export interface ParticlesProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  /* Hex colours, one picked at random per particle. */
  particleColors?: string[]
  particleCount?: number
  /* Radius of the cloud in scene units; depth is ten times this. */
  particleSpread?: number
  speed?: number
  /* Drift the whole cloud against the pointer. Read from the window, so
     content stacked over the canvas does not block it. */
  moveParticlesOnHover?: boolean
  particleHoverFactor?: number
  /* Soft-edged translucent discs instead of hard opaque ones. */
  alphaParticles?: boolean
  /* Point size in CSS pixels at the camera, before depth and randomness. */
  particleBaseSize?: number
  sizeRandomness?: number
  cameraDistance?: number
  disableRotation?: boolean
}

/* React Bits "Particles": a sphere of points with per-particle random size
   and colour, each drifting on its own sine, the cloud slowly turning. The
   canvas is transparent. The loop runs only while the canvas is on screen,
   reduced motion gets one still frame, and no WebGL means no canvas at all.
   Pixel ratio is capped at 2, and at 1.5 under 768px. */
export function Particles({
  className,
  particleColors,
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('WebGLRenderingContext' in window)) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const hoverActive = moveParticlesOnHover && !reducedMotion
    const rotating = !disableRotation && !reducedMotion

    let renderer: Renderer
    try {
      renderer = new Renderer({ dpr: pixelRatioFor(window.innerWidth), depth: false, alpha: true })
    } catch {
      return
    }
    const gl = renderer.gl
    const canvas = gl.canvas
    container.appendChild(canvas)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 15 })
    camera.position.set(0, 0, cameraDistance)

    const palette = particleColors && particleColors.length > 0 ? particleColors : DEFAULT_COLOURS
    const positions = new Float32Array(particleCount * 3)
    const randoms = new Float32Array(particleCount * 4)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      let x = 0
      let y = 0
      let z = 0
      let len = 0
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        len = x * x + y * y + z * z
      } while (len > 1 || len === 0)
      const r = Math.cbrt(Math.random())
      positions.set([x * r, y * r, z * r], i * 3)
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      colors.set(hexToRgb(palette[Math.floor(Math.random() * palette.length)]), i * 3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })

    const uniforms = {
      uTime: { value: 0 },
      uSpread: { value: particleSpread },
      uBaseSize: { value: particleBaseSize * renderer.dpr },
      uSizeRandomness: { value: sizeRandomness },
      uAlphaParticles: { value: alphaParticles ? 1 : 0 },
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms,
      transparent: true,
      depthTest: false,
    })

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })

    let active = true
    let visible = false
    let running = false
    let raf = 0
    let lastTime = 0
    let elapsed = 0
    const targetOffset = { x: 0, y: 0 }
    const currentOffset = { x: 0, y: 0 }

    const setSize = () => {
      if (!active) return
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.dpr = pixelRatioFor(window.innerWidth)
      uniforms.uBaseSize.value = particleBaseSize * renderer.dpr
      renderer.setSize(width, height)
      camera.perspective({ aspect: width / height })
    }

    const renderFrame = (now: number) => {
      if (!reducedMotion) {
        elapsed += (lastTime === 0 ? 0 : now - lastTime) * speed
        lastTime = now
      }
      uniforms.uTime.value = elapsed * 0.001

      if (hoverActive) {
        currentOffset.x += (targetOffset.x - currentOffset.x) * 0.05
        currentOffset.y += (targetOffset.y - currentOffset.y) * 0.05
        particles.position.x = -currentOffset.x * particleHoverFactor
        particles.position.y = -currentOffset.y * particleHoverFactor
      }

      if (rotating) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15
        particles.rotation.z = elapsed * 0.0006
      }

      renderer.render({ scene: particles, camera })
    }

    const renderLoop = (now: number) => {
      if (!active || !visible) {
        running = false
        return
      }
      renderFrame(now)
      raf = requestAnimationFrame(renderLoop)
    }

    const start = () => {
      if (reducedMotion) {
        renderFrame(0)
        return
      }
      if (running) return
      running = true
      lastTime = 0
      raf = requestAnimationFrame(renderLoop)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (reducedMotion && visible) renderFrame(0)
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    intersectionObserver.observe(container)

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      targetOffset.x = inside ? x * 2 - 1 : 0
      targetOffset.y = inside ? 1 - y * 2 : 0
    }

    if (hoverActive) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      if (hoverActive) window.removeEventListener('pointermove', handlePointerMove)
      geometry.remove()
      program.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [
    particleColors,
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
  ])

  return (
    <div ref={containerRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)} />
  )
}
