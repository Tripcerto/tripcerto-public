import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Holds the choreography inside it on its first frame until a fifth of the
   wrapper is on screen, then lets it run once. The animations are the
   frames' own, at their own speed; nothing is timed here. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [seen])
  return (
    <div ref={ref} className={cn('reveal', seen && 'is-in', className)}>
      {children}
    </div>
  )
}
