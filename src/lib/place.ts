/* Keeps the reader's place when the window changes width: a window dragged
   narrower, a tablet or a phone turned on its side.

   Browsers try to do this themselves (scroll anchoring), but they give up
   whenever the padding, margin or width of what they are holding on to, or
   of anything around it, changes, which is exactly what a breakpoint does, so
   the page slid a screen or more at every one. Here the place is kept
   wherever the page is read: what sits just under the bar is noted when
   scrolling stops, and after each change of width the page is scrolled so
   the same point of it is back under the bar.

   Only a change of width moves anything. A phone's toolbar showing or hiding
   as it scrolls changes the height alone, and the page is left to scroll. At
   the very top nothing is held, so a page opened at its top stays there.
   Returns what stops it. */
export function keepPlace(): () => void {
  let place: { el: Element; share: number } | null = null
  let width = window.innerWidth
  let timer = 0

  /* The point read: the middle of the page, just under the fixed bar. */
  const under = () => (document.querySelector('header')?.getBoundingClientRect().bottom ?? 0) + 1

  const note = () => {
    if (window.scrollY <= 0) {
      place = null
      return
    }
    const y = under()
    /* The page's own content, never the bar or the open menu above it. */
    const el = document.elementsFromPoint(window.innerWidth / 2, y).find((hit) => hit.closest('main, footer'))
    if (!el) {
      place = null
      return
    }
    const rect = el.getBoundingClientRect()
    place = { el, share: rect.height > 0 ? (y - rect.top) / rect.height : 0 }
  }

  const keep = () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    if (!place?.el.isConnected) return
    const rect = place.el.getBoundingClientRect()
    const off = rect.top + place.share * rect.height - under()
    if (Math.abs(off) >= 1) window.scrollBy({ top: off, behavior: 'instant' })
  }

  const scrolled = () => {
    clearTimeout(timer)
    timer = window.setTimeout(note, 100)
  }

  window.addEventListener('scroll', scrolled, { passive: true })
  window.addEventListener('resize', keep)
  note()
  return () => {
    clearTimeout(timer)
    window.removeEventListener('scroll', scrolled)
    window.removeEventListener('resize', keep)
  }
}
