import { useId } from 'react'
import { cn } from '@/lib/utils'

/* A sunrise in the band's colours, two balloons, a tent, an acacia and a
   giraffe cut in ink. A depiction, not a photograph; the slot takes a real
   image later. A crop centres one subject of the scene, so the cards can
   share it and read as separate pictures. */
const CROP = {
  balloon: '16 24 60 45',
  camp: '0 42 60 45',
} as const

export function SafariScene({ className, crop }: { className?: string; crop: keyof typeof CROP }) {
  const sky = useId()
  return (
    <svg viewBox={CROP[crop]} preserveAspectRatio="xMidYMid slice" className={cn('block h-full w-full', className)} aria-hidden>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8437e" />
          <stop offset="0.55" stopColor="#ff5c6c" />
          <stop offset="1" stopColor="#ff9b7a" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill={`url(#${sky})`} />
      <circle cx="118" cy="72" r="22" fill="#fff1ea" fillOpacity="0.85" />
      <g transform="translate(100 24) scale(0.42)">
        <Balloon panel="#ff9b7a" />
      </g>
      <g transform="translate(46 30)">
        <Balloon panel="#ff5c6c" />
      </g>
      <path d="M0 76 C 30 72, 60 80, 90 76 S 140 72, 160 76 L160 100 L0 100 Z" fill="#281131" />
      <g fill="#281131" stroke="#281131" strokeLinecap="round">
        <path d="M22 76 L23 61" strokeWidth="1.8" />
        <path d="M9 62 Q 23 48 39 62 Z" stroke="none" />
      </g>
      <path d="M28 77.5 L34.5 69.5 L41 77.5 Z" fill="#281131" />
      <path d="M33.6 77.5 L34.5 72.5 L35.4 77.5 Z" fill="#ff9b7a" />
      <g transform="translate(122 49)" fill="#281131" stroke="#281131" strokeLinecap="round">
        <rect x="4" y="12" width="16" height="7.5" rx="3" stroke="none" />
        <path d="M6.5 13.5 L-0.5 -3" strokeWidth="2.4" />
        <rect x="-4.2" y="-6.2" width="6" height="3.2" rx="1.5" stroke="none" />
        <path d="M-2.8 -6.2 V-8.4 M-0.6 -6.2 V-8.4" strokeWidth="0.9" />
        <path d="M6.5 19 V28 M9.5 19 V28 M15 19 V28 M18 19 V28" strokeWidth="1.6" />
        <path d="M20 13.5 L22.6 17.5" strokeWidth="0.9" />
      </g>
    </svg>
  )
}

/* Envelope, strings and basket; the origin is the crown. About 22 wide, 35 tall. */
function Balloon({ panel }: { panel: string }) {
  return (
    <g>
      <path d="M0 0 C 7 0, 11 5, 11 11 C 11 17, 6 21, 3 25 L -3 25 C -6 21, -11 17, -11 11 C -11 5, -7 0, 0 0 Z" fill="#ffffff" fillOpacity="0.96" />
      <path d="M0 0 C 2.6 0, 4 5, 4 11 C 4 17, 2 21, 1 25 L -1 25 C -2 21, -4 17, -4 11 C -4 5, -2.6 0, 0 0 Z" fill={panel} />
      <path d="M-3 25 L-3.6 30 M3 25 L3.6 30" stroke="#281131" strokeWidth="0.6" />
      <rect x="-4.2" y="30" width="8.4" height="4.6" rx="1.2" fill="#281131" />
    </g>
  )
}

/* The same balloon as a currentColor glyph for rows and chips. */
export function BalloonGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="-13 -1 26 37" className={cn('block', className)} fill="currentColor" aria-hidden>
      <path d="M0 0 C 7 0, 11 5, 11 11 C 11 17, 6 21, 3 25 L -3 25 C -6 21, -11 17, -11 11 C -11 5, -7 0, 0 0 Z" />
      <path d="M-3 25 L-3.6 30 M3 25 L3.6 30" stroke="currentColor" strokeWidth="1.2" />
      <rect x="-4.2" y="30" width="8.4" height="4.6" rx="1.2" />
    </svg>
  )
}
