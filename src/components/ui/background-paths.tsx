import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const STROKES = ['#E8437E', '#FF5C6C', '#FF9B7A'] as const
const PATH_COUNT = 36

interface FloatingPathsProps {
  position: 1 | -1
  reduced: boolean
}

function FloatingPaths({ position, reduced }: FloatingPathsProps) {
  const paths = Array.from({ length: PATH_COUNT }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    stroke: STROKES[i % STROKES.length],
    width: 0.5 + i * 0.03,
    opacity: Math.min(0.12 + i * 0.02, 0.7),
    duration: 20 + (i % 7) * 1.5,
  }))

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 696 316"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      {paths.map((path) =>
        reduced ? (
          <path
            key={path.id}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            opacity={0.45}
          />
        ) : (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
            transition={{ duration: path.duration, repeat: Infinity, ease: 'linear' }}
          />
        ),
      )}
    </svg>
  )
}

export interface BackgroundPathsProps {
  className?: string
}

export function BackgroundPaths({ className }: BackgroundPathsProps) {
  const reduced = useReducedMotion() ?? false
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
      <FloatingPaths position={1} reduced={reduced} />
      <FloatingPaths position={-1} reduced={reduced} />
    </div>
  )
}
