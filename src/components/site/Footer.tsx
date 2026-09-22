import { Wordmark } from '@/components/site/Wordmark'
import { home } from '@/content/home'
import { CONTACT_EMAIL, LOGIN_URL, PAGES, STATUS_URL } from '@/lib/links'

interface FooterLink {
  href: string
  label: string
}

interface FooterColumn {
  heading: string
  links: readonly FooterLink[]
}

const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { href: PAGES.engage, label: 'Engage' },
      { href: PAGES.workspace, label: 'Workspace' },
      { href: PAGES.pilot, label: 'Pilot' },
      { href: PAGES.trust, label: 'Trust' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: STATUS_URL, label: 'Status' },
      { href: LOGIN_URL, label: 'Login' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/legal/privacy/', label: 'Privacy' },
      { href: '/legal/terms/', label: 'Terms' },
    ],
  },
]

/* The footer sits on the page like the nav does, cream by day and ink by
   night, under a hairline, so the page ends quietly after the band instead
   of on a second slab. The wordmark follows the theme with the text. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell py-14 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <Wordmark tone="page" />
            <p className="mt-4 max-w-[22rem] text-[15px] leading-[1.55] text-dim">{home.footer.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="text-[13px] font-semibold text-dim">{column.heading}</h2>
                <ul role="list" className="mt-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-[15px] text-body/80 transition-colors hover:text-body"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-[13px] text-dim">© 2026 Tripcerto Ltd</p>
      </div>
    </footer>
  )
}
