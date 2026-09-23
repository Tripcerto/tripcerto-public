import type { CSSProperties } from 'react'

/* Start time for an animate-* utility, in seconds from the hero's first paint. */
export const delay = (seconds: number): CSSProperties => ({ '--d': `${seconds}s` }) as CSSProperties

/* Start time for a text-shimmer sweep: set where the working line appears,
   so its first pass starts on the first letter as the line arrives. */
export const sweepFrom = (seconds: number): CSSProperties => ({ '--shimmer-at': `${seconds}s` }) as CSSProperties
