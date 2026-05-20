const LEGAL_LINKS = [
  { href: '/legal/terms/', label: 'Terms of Use' },
  { href: '/legal/privacy/', label: 'Privacy Policy' },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-identity">
          <p className="footer-company">
            Tripcerto Ltd — registered in England &amp; Wales, company no. 16121124
          </p>
          <p className="footer-address">
            Registered office: 118 Jellicoe Avenue, Alverstoke, Hampshire, United Kingdom, PO12 2PX
          </p>
        </div>
        <nav className="footer-links" aria-label="Legal and contact">
          {LEGAL_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="mailto:hello@tripcerto.com">hello@tripcerto.com</a>
        </nav>
      </div>
      <div className="shell footer-copy">
        <span>&copy; {year} Tripcerto Ltd. All rights reserved.</span>
      </div>
    </footer>
  )
}
