import { useEffect, useState } from 'react'

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
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
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
        </nav>
      </div>
    </header>
  )
}
