import { useEffect, useRef, type CSSProperties } from 'react'
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { cn } from '@/lib/utils'

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform bool lightMode;
uniform bool mirror;
uniform float swirl;
uniform bool sameDirection;
uniform float lineWidth;
uniform float lineBlur;
uniform float lineOpacity;
uniform float glowSpread;
uniform float glowHaze;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;

  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];

    gradientColor = mix(c1, c2, f);
  }

  return gradientColor;
}

/* Signed distance from the fragment to the wave, in uv units. */
float waveDelta(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  return uv.y - y;
}

/* Dark mode: additive glow, a bright core falling off over glowSpread uv
   units with a constant haze of glowHaze everywhere. */
float glow(float m) {
  return 0.0175 / max(abs(m) + glowSpread, 1e-3) + glowHaze;
}

/* Light mode: a stroke lineWidth pixels wide whose edge softens over lineBlur
   pixels each side, so it can read as a crisp line or a soft ribbon. */
float ink(float m) {
  float px = 2.0 / iResolution.y;
  float halfWidth = lineWidth * 0.5 * px;
  float blur = max(lineBlur, 1.0) * px;
  return (1.0 - smoothstep(halfWidth - blur, halfWidth + blur, abs(m))) * lineOpacity;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) {
    baseUv += parallaxOffset;
  }

  if (mirror) {
    baseUv.x *= -1.0;
  }

  vec3 col = vec3(0.0);
  vec3 paint = vec3(0.0);
  float alpha = 0.0;
  float darkScale = lineGradientCount > 0 ? 0.5 : 1.0;

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
    if (mirror) {
      mouseUv.x *= -1.0;
    }
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = bottomWavePosition.z * mix(1.0, log(length(baseUv) + 1.0), swirl);
      vec2 ruv = baseUv * rotate(angle);
      float m = waveDelta(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      );
      if (lightMode) {
        float a = ink(m);
        paint = paint * (1.0 - a) + lineCol * a;
        alpha = alpha * (1.0 - a) + a;
      } else {
        col += lineCol * darkScale * glow(m);
      }
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = middleWavePosition.z * mix(1.0, log(length(baseUv) + 1.0), swirl);
      vec2 ruv = baseUv * rotate(angle);
      float m = waveDelta(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
      if (lightMode) {
        float a = ink(m);
        paint = paint * (1.0 - a) + lineCol * a;
        alpha = alpha * (1.0 - a) + a;
      } else {
        col += lineCol * darkScale * glow(m);
      }
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = topWavePosition.z * mix(1.0, log(length(baseUv) + 1.0), swirl);
      vec2 ruv = baseUv * rotate(angle);
      if (!sameDirection) {
        ruv.x *= -1.0;
      }
      float m = waveDelta(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      );
      if (lightMode) {
        float a = ink(m);
        paint = paint * (1.0 - a) + lineCol * a;
        alpha = alpha * (1.0 - a) + a;
      } else {
        col += lineCol * darkScale * glow(m);
      }
    }
  }

  if (lightMode) {
    fragColor = vec4(paint, alpha);
  } else {
    fragColor = vec4(col, 1.0);
  }
}


void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`

const MAX_GRADIENT_STOPS = 8

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

export type WaveName = 'top' | 'middle' | 'bottom'

export interface WavePosition {
  x: number
  y: number
  rotate: number
}

export interface FloatingLinesProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  /* Hex stops the lines are coloured across, first line to last (max 8). */
  linesGradient?: string[]
  enabledWaves?: WaveName[]
  /* One number for every wave, or one per enabled wave in enabledWaves order. */
  lineCount?: number | number[]
  lineDistance?: number | number[]
  topWavePosition?: WavePosition
  middleWavePosition?: WavePosition
  bottomWavePosition?: WavePosition
  animationSpeed?: number
  interactive?: boolean
  bendRadius?: number
  bendStrength?: number
  mouseDamping?: number
  parallax?: boolean
  parallaxStrength?: number
  mixBlendMode?: CSSProperties['mixBlendMode']
  lightMode?: boolean
  /* Flip the field left to right; the pointer bend flips with it. */
  mirror?: boolean
  /* How much a wave's rotation grows with distance from the centre: 1 is the
     original's curl, 0 a straight tilt across the box. */
  swirl?: number
  /* The original runs the top wave against the other two; true runs all one way. */
  sameDirection?: boolean
  /* Light mode only: stroke width and edge blur in CSS pixels, opacity 0 to 1. */
  lineWidth?: number
  lineBlur?: number
  lineOpacity?: number
  /* Dark mode only: how far the glow falls off from a line in uv units
     (smaller is tighter), and the constant haze added everywhere. */
  glowSpread?: number
  glowHaze?: number
}

function perWave(value: number | number[], waves: WaveName[], wave: WaveName, fallback: number) {
  if (typeof value === 'number') return value
  const index = waves.indexOf(wave)
  return index === -1 ? fallback : (value[index] ?? fallback)
}

/* React Bits "FloatingLines": three sine-wave layers drawn by a fragment shader,
   bending around the pointer and drifting with it. The canvas is transparent:
   light mode draws coloured ink over whatever sits behind it. The pointer is
   read from the window so content stacked over the canvas does not block the
   effect. Light mode replaces the original's glow with an antialiased stroke
   of a set width and opacity, composited over transparent, so the lines stay
   crisp on paper. The loop runs only while the canvas is on screen, reduced
   motion gets one still frame, and no WebGL means no canvas at all. */
export function FloatingLines({
  className,
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
  lightMode = false,
  mirror = false,
  swirl = 1,
  sameDirection = false,
  lineWidth = 2,
  lineBlur = 1,
  lineOpacity = 0.9,
  glowSpread = 0.01,
  glowHaze = 0.01,
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('WebGLRenderingContext' in window)) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const pointerActive = interactive && !reducedMotion
    let active = true
    let visible = false
    let running = false
    let raf = 0

    const targetMouse = new Vector2(-1000, -1000)
    const currentMouse = new Vector2(-1000, -1000)
    let targetInfluence = 0
    let currentInfluence = 0
    const targetParallax = new Vector2(0, 0)
    const currentParallax = new Vector2(0, 0)

    const has = (wave: WaveName) => enabledWaves.includes(wave)
    const count = (wave: WaveName) => (has(wave) ? perWave(lineCount, enabledWaves, wave, 6) : 0)
    const distance = (wave: WaveName) => (has(wave) ? perWave(lineDistance, enabledWaves, wave, 0.1) * 0.01 : 0.01)

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    camera.position.z = 1

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: has('top') },
      enableMiddle: { value: has('middle') },
      enableBottom: { value: has('bottom') },

      topLineCount: { value: count('top') },
      middleLineCount: { value: count('middle') },
      bottomLineCount: { value: count('bottom') },

      topLineDistance: { value: distance('top') },
      middleLineDistance: { value: distance('middle') },
      bottomLineDistance: { value: distance('bottom') },

      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4),
      },
      middleWavePosition: {
        value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2),
      },
      bottomWavePosition: {
        value: new Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4),
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: pointerActive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax && !reducedMotion },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount: { value: 0 },
      lightMode: { value: lightMode },
      mirror: { value: mirror },
      swirl: { value: swirl },
      sameDirection: { value: sameDirection },
      lineWidth: { value: lineWidth * renderer.getPixelRatio() },
      lineBlur: { value: lineBlur * renderer.getPixelRatio() },
      lineOpacity: { value: lineOpacity },
      glowSpread: { value: glowSpread },
      glowHaze: { value: glowHaze },
    }

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS)
      uniforms.lineGradientCount.value = stops.length
      stops.forEach((hex, i) => {
        uniforms.lineGradient.value[i].copy(hexToVec3(hex))
      })
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    const geometry = new PlaneGeometry(2, 2)
    scene.add(new Mesh(geometry, material))

    const timer = new Timer()

    const setSize = () => {
      if (!active) return
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false)
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1)
    }

    const renderFrame = () => {
      timer.update()
      uniforms.iTime.value = reducedMotion ? 0 : timer.getElapsed()

      if (pointerActive) {
        currentMouse.lerp(targetMouse, mouseDamping)
        uniforms.iMouse.value.copy(currentMouse)
        currentInfluence += (targetInfluence - currentInfluence) * mouseDamping
        uniforms.bendInfluence.value = currentInfluence
      }

      if (parallax && !reducedMotion) {
        currentParallax.lerp(targetParallax, mouseDamping)
        uniforms.parallaxOffset.value.copy(currentParallax)
      }

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

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      const dpr = renderer.getPixelRatio()

      targetMouse.set(x * dpr, (rect.height - y) * dpr)
      targetInfluence = inside ? 1 : 0

      if (parallax) {
        targetParallax.set(
          ((x - rect.width / 2) / rect.width) * parallaxStrength,
          (-(y - rect.height / 2) / rect.height) * parallaxStrength,
        )
      }
    }

    if (pointerActive) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      if (pointerActive) window.removeEventListener('pointermove', handlePointerMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    lightMode,
    mirror,
    swirl,
    sameDirection,
    lineWidth,
    lineBlur,
    lineOpacity,
    glowSpread,
    glowHaze,
  ])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn('pointer-events-none relative overflow-hidden', className)}
      style={{ mixBlendMode: lightMode ? 'normal' : mixBlendMode }}
    />
  )
}
