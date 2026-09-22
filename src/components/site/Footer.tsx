import { Wordmark } from '@/components/site/Wordmark'
import { CONTACT_EMAIL, LOGIN_URL, PAGES, STATUS_URL } from '@/lib/links'

const SITE = [
  { href: PAGES.engage, label: 'Engage' },
  { href: PAGES.workspace, label: 'Workspace' },
  { href: PAGES.pilot, label: 'Pilot' },
  { href: PAGES.trust, label: 'Trust' },
  { href: STATUS_URL, label: 'Status' },
  { href: LOGIN_URL, label: 'Login' },
] as const

const LEGAL = [
  { href: '/legal/privacy/', label: 'Privacy' },
  { href: '/legal/terms/', label: 'Terms' },
] as const

const LINK = 'inline-flex min-h-11 items-center text-[15px] text-body/80 transition-colors hover:text-body'

function Links({ links, className }: { links: ReadonlyArray<{ href: string; label: string }>; className?: string }) {
  return (
    <ul role="list" className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className={LINK}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

/* On the page like the nav, cream by day and ink by night, under a
   hairline: the wordmark, then the site's pages in order on the left and
   the legal pages on the right, the address, the copyright. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell py-10">
        <Wordmark tone="page" />
        <div className="mt-8 flex flex-col gap-1 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
          <Links links={SITE} className="flex flex-wrap gap-x-6" />
          <Links links={LEGAL} className="flex flex-wrap gap-x-6" />
        </div>
        <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
          {CONTACT_EMAIL}
        </a>
        <p className="mt-2 text-[13px] text-dim">© 2026 Tripcerto Ltd</p>
      </div>
    </footer>
  )
}
