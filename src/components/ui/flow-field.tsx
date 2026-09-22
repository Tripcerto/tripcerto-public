import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { composeField, paintField, type FlowComposition } from '@/components/ui/flow-field-paint'

const EMBER_RAMP: readonly string[] = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']
const DEFAULT_OPACITY: readonly [number, number] = [0.85, 0.6]

const FRAME_MS = 1000 / 24
/* Noise time advanced per second: a twentieth of real time. */
const EVOLUTION_RATE = 0.05
const PARALLAX_EASE = 0.08
const PAD = 32

const DESKTOP = { spacing: 13, topSpacing: 1, lengthRange: [0.35, 0.8] as const, warp: 7 }
const MOBILE = { spacing: 14, topSpacing: 2.2, lengthRange: [0.5, 1.1] as const, warp: 4 }

export interface FlowFieldProps {
  /* The box the canvas fills; the caller sizes it. */
  className?: string
  /* Hex stops the family is coloured across, first line to last. */
  colours?: readonly string[]
  /* Opacity of the first and last line; the family ramps between. */
  opacity?: readonly [number, number]
  /* Stroke width in CSS px. */
  lineWidth?: number
  /* Radius of the soft halo under each line in CSS px; 0 draws crisp lines only. */
  glow?: number
  /* Opacity of the halo relative to the line it sits under. */
  glowOpacity?: number
  lineCount?: number
  /* Lines under 768px. */
  mobileLineCount?: number
  /* Pointer parallax reach in CSS px; 0 disables it. */
  parallax?: number
  seed?: number
}

/* Streamlines of a seeded simplex flow field, composed once per size on a 2D
   canvas and redrawn at most 24 times a second through a slow, low-frequency
   warp of the rest points, so the family drifts without ever losing the
   spacing it was composed with. Each frame strokes the family crisp on a
   scratch canvas and composites it twice: once through a Gaussian blur at
   reduced alpha for the halo, then unfiltered on top for the line, so each
   line glows at full raster resolution. The pointer, read from the
   window because the copy sits over the layer, eases the whole canvas a few
   pixels; the canvas is drawn that much larger than its box so no edge
   shows. Reduced motion gets one still frame, the loop runs only on screen,
   phones get no pointer behaviour, and no 2D context means no canvas at all. */
export function FlowField({
  className,
  colours = EMBER_RAMP,
  opacity = DEFAULT_OPACITY,
  lineWidth = 1.3,
  glow = 0,
  glowOpacity = 0.6,
  lineCount = 120,
  mobileLineCount = 56,
  parallax = 8,
  seed = 7,
}: FlowFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!('CanvasRenderingContext2D' in window)) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scratch = document.createElement('canvas')
    const scratchCtx = scratch.getContext('2d')
    if (!ctx || !scratchCtx) return
    const haloed = glow > 0 && 'filter' in ctx

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
    const pointerActive = parallax > 0 && finePointer && !reducedMotion
    const margin = pointerActive ? Math.ceil(parallax) : 0

    canvas.style.position = 'absolute'
    canvas.style.top = `${-margin}px`
    canvas.style.left = `${-margin}px`
    canvas.style.display = 'block'
    if (pointerActive) canvas.style.willChange = 'transform'
    container.appendChild(canvas)

    let active = true
    let visible = false
    let running = false
    let raf = 0
    let lastDraw = -Infinity
    let composition: FlowComposition | null = null
    let dpr = 1
    let sized = { width: 0, height: 0, dpr: 0 }
    const started = performance.now()
    const targetShift = { x: 0, y: 0 }
    const currentShift = { x: 0, y: 0 }

    const phase = (now: number) => (reducedMotion ? 0 : ((now - started) / 1000) * EVOLUTION_RATE)

    const draw = (now: number) => {
      if (!composition) return
      scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scratchCtx.clearRect(0, 0, composition.width, composition.height)
      paintField(scratchCtx, composition, phase(now), lineWidth)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (haloed) {
        ctx.filter = `blur(${glow * dpr}px)`
        ctx.globalAlpha = glowOpacity
        ctx.drawImage(scratch, 0, 0)
        ctx.filter = 'none'
        ctx.globalAlpha = 1
      }
      ctx.drawImage(scratch, 0, 0)
    }

    const setSize = () => {
      if (!active) return
      const boxWidth = container.clientWidth
      const boxHeight = container.clientHeight
      if (boxWidth < 1 || boxHeight < 1) return
      const mobile = boxWidth < 768
      const nextDpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      const width = boxWidth + 2 * margin
      const height = boxHeight + 2 * margin
      if (sized.width === width && sized.height === height && sized.dpr === nextDpr) return
      sized = { width, height, dpr: nextDpr }
      dpr = nextDpr

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      scratch.width = canvas.width
      scratch.height = canvas.height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const layout = mobile ? MOBILE : DESKTOP
      composition = composeField({
        width,
        height,
        pad: PAD,
        lineCount: mobile ? mobileLineCount : lineCount,
        spacing: layout.spacing,
        topSpacing: layout.topSpacing,
        lengthRange: layout.lengthRange,
        minLength: Math.max(90, width * 0.12),
        seed,
        field: { baseAngle: -0.26, spread: 0.8, scale: 1 / Math.max(340, width * 0.32), step: 3 },
        warp: { amplitude: layout.warp, scale: 1 / Math.max(400, width * 0.36) },
        colours,
        opacity,
      })
      draw(performance.now())
    }

    const frame = (now: number) => {
      if (!active || !visible) {
        running = false
        return
      }
      if (pointerActive) {
        currentShift.x += (targetShift.x - currentShift.x) * PARALLAX_EASE
        currentShift.y += (targetShift.y - currentShift.y) * PARALLAX_EASE
        canvas.style.transform = `translate3d(${currentShift.x.toFixed(2)}px, ${currentShift.y.toFixed(2)}px, 0)`
      }
      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now
        draw(now)
      }
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (reducedMotion || running) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => setSize())
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    intersectionObserver.observe(container)

    const handlePointerMove = (event: PointerEvent) => {
      targetShift.x = (event.clientX / window.innerWidth - 0.5) * 2 * parallax
      targetShift.y = (event.clientY / window.innerHeight - 0.5) * 2 * parallax
    }
    if (pointerActive) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      active = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      if (pointerActive) window.removeEventListener('pointermove', handlePointerMove)
      canvas.remove()
    }
  }, [colours, opacity, lineWidth, glow, glowOpacity, lineCount, mobileLineCount, parallax, seed])

  return <div ref={containerRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)} />
}
