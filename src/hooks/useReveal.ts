import { useEffect } from 'react'

// Ports the demo's global `.reveal` scroll-in: every element with class `reveal`
// gains `.in` once 12% enters the viewport, then is unobserved. Under
// prefers-reduced-motion the CSS forces `.reveal` visible, so this is inert.
// Call once near the top of the tree, after the sections have rendered.
export function useReveal(): void {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!els.length) return
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
