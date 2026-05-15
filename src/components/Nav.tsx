import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#demo', label: 'Solution' },
  { href: '#features', label: 'Platform' },
  { href: '#integration', label: 'Integrations' },
  { href: '#faq', label: 'FAQ' },
]

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
      >
        <nav className="nav-mobile-links" aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
