import type { LucideIcon } from 'lucide-react'
import { BadgePoundSterling, ClipboardCheck, Compass, Handshake, Megaphone, ServerCog } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'

type Role = (typeof home.audience.roles)[number]['role']

const ROLE_GLYPH: Record<Role, LucideIcon> = {
  Sales: Handshake,
  Marketing: Megaphone,
  Operations: ClipboardCheck,
  Technology: ServerCog,
  Finance: BadgePoundSterling,
  'The travel expert': Compass,
}

const ROW = 'md:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,7fr)] md:gap-8'

/* The buying roles as ruled rows across the page: the role, the number it
   is measured on, and what changes for it. No cards. */
export function Audience() {
  return (
    <Section id={SECTION.audience} className="py-20 md:py-28">
      <div className="max-w-[44rem]">
        <Heading>{home.audience['H-7-A']}</Heading>
        <Lede className="mt-5">{home.audience['H-7-B']}</Lede>
      </div>

      <div aria-hidden className={`mt-12 hidden pb-3 text-[13px] font-semibold text-dim md:mt-14 md:grid ${ROW}`}>
        <span>Role</span>
        <span>Measured on</span>
        <span>What changes</span>
      </div>
      <ul role="list" className="mt-12 border-t border-line md:mt-0">
        {home.audience.roles.map(({ role, measure, line }) => {
          const Glyph = ROLE_GLYPH[role]
          return (
            <li key={role} className={`grid grid-cols-1 gap-2 border-b border-line py-6 ${ROW}`}>
              <div className="flex items-center gap-3">
                <Glyph size={22} aria-hidden className="shrink-0 text-link" />
                <h3 className="text-[17px] font-semibold">{role}</h3>
              </div>
              <p className="text-[15px] text-dim md:pt-[3px]">{measure}</p>
              <p className="text-[16px] leading-[1.55] text-body/80">{line}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
