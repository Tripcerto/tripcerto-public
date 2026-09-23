import type { ReactNode } from 'react'
import { Wordmark } from '@/components/site/Wordmark'
import { useConsent } from '@/lib/consent'
import { trackEvent } from '@/lib/events'
import { CONTACT_EMAIL, LOGIN_URL, PAGES, STATUS_URL } from '@/lib/links'

interface FooterLink {
  href: string
  label: string
  onClick?: () => void
}

const SITE: readonly FooterLink[] = [
  { href: PAGES.engage, label: 'Engage' },
  { href: PAGES.workspace, label: 'Workspace' },
  { href: PAGES.pilot, label: 'Pilot' },
  { href: STATUS_URL, label: 'Status' },
  { href: LOGIN_URL, label: 'Login', onClick: () => trackEvent('login_click', { place: 'footer' }) },
]

/* Trust sits with the legal pages. */
const LEGAL: readonly FooterLink[] = [
  { href: PAGES.trust, label: 'Trust' },
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
]

const LINK = 'inline-flex min-h-11 items-center text-[15px] text-body/80 transition-colors hover:text-body'

function Links({ links, className, children }: { links: readonly FooterLink[]; className?: string; children?: ReactNode }) {
  return (
    <ul role="list" className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} onClick={link.onClick} className={LINK}>
            {link.label}
          </a>
        </li>
      ))}
      {children}
    </ul>
  )
}

/* On the page like the nav, cream by day and ink by night, under a
   hairline: the wordmark and the address, then the site's pages in order
   on the left and the legal pages on the right, with Cookie settings, which
   asks the analytics question again, then the copyright. */
export function Footer() {
  const { reopen } = useConsent()
  return (
    <footer className="border-t border-line">
      <div className="shell py-10">
        <Wordmark tone="page" />
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => trackEvent('contact_click', {})} className={`${LINK} mt-3`}>
          {CONTACT_EMAIL}
        </a>
        <div className="mt-6 flex flex-col gap-1 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
          <Links links={SITE} className="flex flex-wrap gap-x-6" />
          <Links links={LEGAL} className="flex flex-wrap gap-x-6">
            <li>
              <button type="button" onClick={reopen} className={`${LINK} cursor-pointer`}>
                Cookie settings
              </button>
            </li>
          </Links>
        </div>
        <p className="mt-4 text-[13px] text-dim">© 2026 Tripcerto Ltd</p>
      </div>
    </footer>
  )
}
