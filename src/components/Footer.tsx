const PRODUCT = [
  { href: '#how', label: 'How it works' },
  { href: '#journey', label: 'Journey' },
  { href: '#data-control', label: 'Data control' },
  { href: '#why-now', label: 'Why now' },
]
const COMPANY = [{ href: 'mailto:hello@tripcerto.com', label: 'Contact' }]
const LEGAL = [
  { href: '/legal/privacy/', label: 'Privacy' },
  { href: '/legal/terms/', label: 'Terms' },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="foot-inner">
          <div className="foot-left">
            <a href="#" className="wordmark">
              tripcerto<span className="dot">.</span>
            </a>
            <p>
              The intelligence layer that moves information across the travel pipeline — so partners
              understand customers sooner, respond faster and win more bookings, while keeping control of
              the data that makes them unique.
            </p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h5>Product</h5>
              {PRODUCT.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              {COMPANY.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="foot-col">
              <h5>Legal</h5>
              {LEGAL.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            © 2026 Tripcerto Ltd · Registered in England &amp; Wales · company no. 16121124
          </span>
        </div>
      </div>
    </footer>
  )
}
