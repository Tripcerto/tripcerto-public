import { useId } from 'react'
import { cn } from '@/lib/utils'

/* The made-up operator's logo: an acacia against a sunset, in the band's
   colours, so it reads as the operator's own brand rather than ours. */
export function OperatorMark({ className }: { className?: string }) {
  const sky = useId()
  return (
    <svg viewBox="0 0 24 24" className={cn('block rounded-full', className)} aria-hidden>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8437e" />
          <stop offset="1" stopColor="#ff9b7a" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill={`url(#${sky})`} />
      <circle cx="15.5" cy="15" r="4.2" fill="#fff1ea" fillOpacity="0.9" />
      <path d="M0 17.5 C 6 16.6, 14 18, 24 17 L24 24 L0 24 Z" fill="#281131" />
      <path d="M4 11.2 Q 9.5 6.4 15 11.2 Z" fill="#281131" />
      <path d="M9.3 17.6 L9.6 10.8" stroke="#281131" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
