import { useEffect } from 'react'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'

import { analyticsAddress } from '@/lib/address'
import { isTeamBrowser, markTeamBrowser, useConsent } from '@/lib/consent'
import { currentPage, trackEvent } from '@/lib/events'
import { initGoogleAnalytics, sendPageView, setAnalyticsLayout, stopGoogleAnalytics, type Layout } from '@/lib/ga'

/* What every page measures. Vercel Web Analytics counts every visitor
   without a cookie or an identifier. Google Analytics runs only once the
   visitor has said yes, and stops, with its cookies gone, when they say no.
   Our own browsers are counted by neither. */
export function Measurement() {
  const { analytics } = useConsent()

  /* `?team` on any address marks this browser as ours, and `?team=off`
     unmarks it; the parameter is taken off the address either way. First,
     so the mark holds before anything below is sent. */
  useEffect(() => {
    const url = new URL(window.location.href)
    const team = url.searchParams.get('team')
    if (team === null) return
    markTeamBrowser(team !== 'off')
    url.searchParams.delete('team')
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }, [])

  useEffect(() => {
    if (analytics === 'granted' && !isTeamBrowser()) {
      initGoogleAnalytics({ layout: layoutNow() })
      const page = currentPage()
      if (page) sendPageView(page)
    } else if (analytics === 'denied' || isTeamBrowser()) {
      stopGoogleAnalytics()
    }
  }, [analytics])

  useEffect(() => {
    const queries = [PHONE_UP, DESKTOP_UP].map((query) => window.matchMedia(query))
    const onChange = () => setAnalyticsLayout(layoutNow())
    for (const query of queries) query.addEventListener('change', onChange)
    return () => {
      for (const query of queries) query.removeEventListener('change', onChange)
    }
  }, [])

  useSectionViews()

  return <Analytics beforeSend={beforeSend} />
}

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (isTeamBrowser()) return null
  const url = analyticsAddress(event.url)
  return url ? { ...event, url } : null
}

/* The site's sm and lg breakpoints. */
const PHONE_UP = '(min-width: 640px)'
const DESKTOP_UP = '(min-width: 1024px)'

function layoutNow(): Layout {
  if (!window.matchMedia(PHONE_UP).matches) return 'phone'
  return window.matchMedia(DESKTOP_UP).matches ? 'desktop' : 'tablet'
}

/* Each section once, when its top reaches the middle of the screen: the
   viewport's lower half is cut from the root, so a section taller than the
   screen still reports as soon as a reader is into it. */
function useSectionViews() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id], main > section')
    if (!sections.length) return
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target
          const section = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase()
          if (seen.has(section)) continue
          seen.add(section)
          trackEvent('section_view', { section })
        }
      },
      { threshold: 0, rootMargin: '0px 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
}
