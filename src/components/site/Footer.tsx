import { Section } from '@/components/site/Section'
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
      { href: LOGIN_URL, label: 'Login' },
      { href: STATUS_URL, label: 'Status' },
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

export function Footer() {
  return (
    <footer>
      <Section tone="ink" className="py-16 md:py-16">
        <Wordmark tone="paper" className="h-6" />
        <p className="mt-4 max-w-xs text-sm text-paper/60">{home.products['H-3-A']}</p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="font-mono text-xs font-medium uppercase tracking-wide text-paper/50">{column.heading}</h2>
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-[15px] text-paper/80 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-paper/10 pt-6 text-sm text-paper/50">© 2026 Tripcerto Ltd</p>
      </Section>
    </footer>
  )
}
