import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#journey', label: 'Journey' },
  { href: '#how', label: 'How it works' },
  { href: '#data-control', label: 'Data control' },
  { href: '#why-now', label: 'Why now' },
  { href: '#company', label: 'Team' },
]
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    // lock body scroll while the full-screen menu is open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      <header className="nav">
      <div className="shell nav-inner">
        <a href="#" className="wordmark" onClick={() => setOpen(false)}>
          tripcerto<span className="dot">.</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a
            href={CALENDAR_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-pill nav-cta"
            data-track="book_demo_nav"
            data-track-kind="cta"
          >
            Book a demo
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-mobile-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`burger-icon${open ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
        {/* desktop: pinned flush to the header's top-right corner, outside the
            centered shell (nav-actions reserves room). Hidden on mobile, where
            the toggle lives in the burger panel footer below. */}
        <ThemeToggle />
      </header>
      {/* sibling of <header>, NOT a child: the nav's backdrop-filter makes it a
          containing block for position:fixed, which would collapse this overlay
          to the 64px bar. Out here it's fixed to the viewport. */}
      <div
        id="nav-mobile-panel"
        className={`nav-mobile-panel${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="nav-mobile-links" aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-mobile-theme-row">
          <ThemeToggle variant="menu" />
        </div>
        <div className="nav-mobile-foot">
          <a
            href={CALENDAR_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-mobile-cta"
            data-track="book_demo_nav"
            data-track-kind="cta"
            onClick={() => setOpen(false)}
          >
            Book a demo
          </a>
        </div>
      </div>
    </>
  )
}
