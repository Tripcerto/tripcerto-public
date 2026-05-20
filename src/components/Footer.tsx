import { Fragment } from 'react'

const LEGAL_LINKS = [
  { href: '/legal/terms/', label: 'Terms of Use' },
  { href: '/legal/privacy/', label: 'Privacy Policy' },
  { href: 'mailto:hello@tripcerto.com', label: 'hello@tripcerto.com' },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <nav className="footer-links" aria-label="Legal and contact">
          {LEGAL_LINKS.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && (
                <span className="footer-sep" aria-hidden="true">
                  ·
                </span>
              )}
              <a href={l.href}>{l.label}</a>
            </Fragment>
          ))}
        </nav>
        <p className="footer-company">
          &copy; {year} Tripcerto Ltd · Registered in England &amp; Wales · company no. 16121124
        </p>
      </div>
    </footer>
  )
}
