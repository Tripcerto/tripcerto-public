import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { buildFlowLines, DESKTOP_FLOW, flowDrift, MOBILE_FLOW } from '@/components/ui/flow-paths-geometry'

export interface FlowPathsProps {
  /* The box the lines fill; the caller positions and sizes it. */
  className?: string
  /* How far the whole family shifts against the pointer at the window's edges, CSS px. Desktop only. */
  parallax?: number
  /* Seconds for the family to drift one wavelength along its own sweep. */
  driftSeconds?: number
}

const DESKTOP_QUERY = '(min-width: 64rem)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const PARALLAX_EASE = 0.08

function mediaSubscriber(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }
}

const subscribeDesktop = mediaSubscriber(DESKTOP_QUERY)
const subscribeReducedMotion = mediaSubscriber(REDUCED_MOTION_QUERY)
const readDesktop = () => window.matchMedia(DESKTOP_QUERY).matches
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

interface Size {
  width: number
  height: number
}

/* A ribbon of long parallel curves sweeping from the top-left to the
   bottom-right: one master curve and its true normal offsets, two mirrored
   groups either side of it, coloured pink to peach across the ribbon and most
   opaque at its centre. The family drifts along its own sweep, and because it
   repeats each wavelength the loop has no seam and no line has an end in
   view. The pointer is read from the window so the copy over the layer does
   not block it. Reduced motion draws the still ribbon; off screen the drift
   pauses. The frame bleeds past the box so the parallax never shows an edge,
   and the left, right and (on a phone) top fades live on that frame so they
   compose with whatever mask the caller puts on the box. */
export function FlowPaths({ className, parallax = 8, driftSeconds = 60 }: FlowPathsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const desktop = useSyncExternalStore(subscribeDesktop, readDesktop)
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, readReducedMotion)
  const [size, setSize] = useState<Size | null>(null)
  const [onScreen, setOnScreen] = useState(true)
  const id = `fp${useId().replace(/\W/g, '')}`

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      const width = frame.clientWidth
      const height = frame.clientHeight
      setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !desktop || reducedMotion || parallax <= 0) return
    let active = true
    let raf = 0
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const settle = () => {
      current.x += (target.x - current.x) * PARALLAX_EASE
      current.y += (target.y - current.y) * PARALLAX_EASE
      frame.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`
      const resting = Math.abs(target.x - current.x) < 0.05 && Math.abs(target.y - current.y) < 0.05
      raf = active && !resting ? requestAnimationFrame(settle) : 0
    }

    const handlePointerMove = (event: PointerEvent) => {
      target.x = -(event.clientX / window.innerWidth - 0.5) * 2 * parallax
      target.y = -(event.clientY / window.innerHeight - 0.5) * 2 * parallax
      if (!raf) raf = requestAnimationFrame(settle)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      active = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handlePointerMove)
      frame.style.transform = ''
    }
  }, [desktop, reducedMotion, parallax])

  const geometry = useMemo(() => size && { ...(desktop ? DESKTOP_FLOW : MOBILE_FLOW), ...size }, [size, desktop])
  const lines = useMemo(() => (geometry ? buildFlowLines(geometry) : []), [geometry])
  const drift = geometry ? flowDrift(geometry) : { dx: 0, dy: 0 }
  const width = geometry?.width ?? 1
  const height = geometry?.height ?? 1

  const css =
    `@keyframes ${id}-drift{to{transform:translate(${drift.dx.toFixed(1)}px,${drift.dy.toFixed(1)}px)}}` +
    `@keyframes ${id}-in{from{opacity:0}}` +
    `.${id}-drift{animation:${id}-drift ${driftSeconds}s linear infinite}` +
    `.${id}-in{animation:${id}-in .9s ease-out both}` +
    `@media (prefers-reduced-motion:reduce){.${id}-drift,.${id}-in{animation:none}}`

  return (
    <div ref={rootRef} aria-hidden className={cn('pointer-events-none relative overflow-hidden', className)}>
      <div
        ref={frameRef}
        className="absolute -inset-3 mask-x-from-88% max-lg:mask-t-from-40% max-lg:mask-t-to-72%"
      >
        <svg
          className={`${id}-in block h-full w-full`}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <style>{css}</style>
          <g className={`${id}-drift`} style={{ animationPlayState: onScreen ? 'running' : 'paused' }}>
            {lines.map((line, index) => (
              <path
                key={index}
                d={line.d}
                stroke={line.colour}
                strokeOpacity={line.opacity}
                strokeWidth={line.width}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
