import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'

type Props = Record<string, string | number | boolean | null>

export function trackEvent(name: string, props?: Props) {
  try {
    track(name, props)
  } catch {
    // analytics never blocks UX
  }
}

const SCROLL_BUCKETS = [25, 50, 75, 100] as const

export function useScrollDepth() {
  const firedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrolled = window.scrollY + window.innerHeight
        const total = document.documentElement.scrollHeight
        if (total <= window.innerHeight) {
          ticking = false
          return
        }
        const pct = Math.min(100, Math.round((scrolled / total) * 100))
        for (const bucket of SCROLL_BUCKETS) {
          if (pct >= bucket && !firedRef.current.has(bucket)) {
            firedRef.current.add(bucket)
            trackEvent('scroll_depth', { depth_pct: bucket })
          }
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])
}

export function useSectionViews() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id], main > section')
    if (!sections.length) return
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase()
          if (seen.has(id)) continue
          seen.add(id)
          trackEvent('section_view', { section: id })
        }
      },
      { threshold: 0.4 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
}

function describeTarget(el: HTMLElement): { label: string; kind: string; href?: string } {
  const explicit = el.closest<HTMLElement>('[data-track]')
  if (explicit) {
    return {
      label: explicit.dataset.track || 'tracked',
      kind: explicit.dataset.trackKind || 'custom',
      href: explicit.getAttribute('href') || undefined,
    }
  }
  const anchor = el.closest('a')
  if (anchor) {
    const text = (anchor.textContent || '').trim().slice(0, 80)
    return {
      label: text || anchor.getAttribute('aria-label') || anchor.href,
      kind: 'link',
      href: anchor.href,
    }
  }
  const button = el.closest('button')
  if (button) {
    const text = (button.textContent || '').trim().slice(0, 80)
    return {
      label: text || button.getAttribute('aria-label') || 'button',
      kind: 'button',
    }
  }
  return { label: '', kind: '' }
}

function classifyLink(href: string | undefined): string {
  if (!href) return 'unknown'
  if (href.startsWith('mailto:')) return 'mailto'
  if (href.startsWith('tel:')) return 'tel'
  if (href.startsWith('#')) return 'anchor'
  try {
    const url = new URL(href, window.location.href)
    if (url.host === window.location.host) return 'internal'
    return 'outbound'
  } catch {
    return 'unknown'
  }
}

export function useGlobalClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const info = describeTarget(target)
      if (!info.kind) return
      const linkClass = info.href ? classifyLink(info.href) : undefined
      trackEvent('click', {
        label: info.label,
        kind: info.kind,
        ...(info.href ? { href: info.href } : {}),
        ...(linkClass ? { link_class: linkClass } : {}),
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
}

export function useTimeOnPage() {
  useEffect(() => {
    const start = performance.now()
    const fire = () => {
      const seconds = Math.round((performance.now() - start) / 1000)
      trackEvent('session_duration', { seconds })
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') fire()
    }
    window.addEventListener('pagehide', fire)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', fire)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
