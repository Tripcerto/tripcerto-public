import type { CSSProperties } from 'react'

/* Start time for an animate-* utility, in seconds from the hero's first paint. */
export const delay = (seconds: number): CSSProperties => ({ '--d': `${seconds}s` }) as CSSProperties
