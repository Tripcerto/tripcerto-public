import { useEffect, useRef } from 'react'
import {
  Timer,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import { cn } from '@/lib/utils'

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform vec3  uAccent;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd     = noise(gl_FragCoord.xy);
  vec2  uv      = rotateUvs(vUv * uScale, uRotation);
  vec2  tex     = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  /* Folds sit in the accent, the lit face is the base colour, and the crest
     carries a white sheen. The original ramps one colour to black and white;
     on paper that reads as grey, so the shadow end is a second brand colour. */
  float fold  = smoothstep(0.2, 0.7, pattern);
  float sheen = smoothstep(0.72, 0.98, pattern);
  vec3  body  = mix(uAccent, uColor, fold);
  body = mix(body, vec3(1.0), sheen * 0.85);

  float fineNoise     = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
  float grainSignal   = rnd + fineNoise - 1.0;
  float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);

  gl_FragColor = vec4(clamp(body + grainSignal * grainStrength, 0.0, 1.0), 1.0);
}
`

/* The shader writes raw sRGB, so the hex goes in untouched: three's Color
   would convert it to linear and the fabric would come out darker. */
function hexToVec3(hex: string) {
  const value = hex.trim().replace(/^#/, '')
  const [r, g, b] =
    value.length === 6 ? [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) : [255, 255, 255]
  return new Vector3(r / 255, g / 255, b / 255)
}

export interface SilkProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  speed?: number
  scale?: number
  /* Hex of the lit face of the fabric. */
  color?: string
  /* Hex that shows in the folds. */
  accent?: string
  noiseIntensity?: number
  /* Radians. */
  rotation?: number
}

/* React Bits "Silk": one full-screen fragment shader that folds a sine field
   into draped fabric with film grain. Ported from react-three-fiber to plain
   three, which is what this repo carries. Opaque: the caller veils it. The
   loop runs only while the canvas is on screen, reduced motion gets one still
   frame, and no WebGL means no canvas at all. */
export function Silk({
  className,
  speed = 5,
  scale = 1,
  color = '#FF9B7A',
  accent = '#FF5C6C',
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
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
      renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' })
    } catch {
      return
    }
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const uniforms = {
      uTime: { value: 0 },
      uColor: { value: hexToVec3(color) },
      uAccent: { value: hexToVec3(accent) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uRotation: { value: rotation },
      uNoiseIntensity: { value: noiseIntensity },
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    const geometry = new PlaneGeometry(2, 2)
    scene.add(new Mesh(geometry, material))

    const timer = new Timer()

    /* A full-screen fragment pass is fill-bound, so phones get 1.5x at most. */
    const setSize = () => {
      if (!active) return
      const cap = window.innerWidth < 768 ? 1.5 : 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap))
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false)
    }

    const renderFrame = () => {
      renderer.render(scene, camera)
    }

    const renderLoop = () => {
      if (!active || !visible) {
        running = false
        return
      }
      timer.update()
      uniforms.uTime.value += 0.1 * Math.min(timer.getDelta(), 0.1)
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
      timer.update()
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
  }, [speed, scale, color, accent, noiseIntensity, rotation])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none overflow-hidden', className)} />
}
