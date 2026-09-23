import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { inFullView } from '@/lib/view'

const STEPS = Array.from({ length: 51 }, (_, i) => i / 50)

/* Holds every animation inside it on its first frame until the whole of it
   is on screen, then lets it all run once. The animations are the frames'
   own, at their own speed; nothing is timed here. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const screen = entry.rootBounds?.height ?? window.innerHeight
        if (inFullView(entry.intersectionRect.height, entry.boundingClientRect.height, screen)) setSeen(true)
      },
      { threshold: STEPS },
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
