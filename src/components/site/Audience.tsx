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

/* The buying roles as a ruled list beside the heading, each with the
   number it is measured on; no cards. */
export function Audience() {
  return (
    <Section id={SECTION.audience} className="py-16 md:py-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <Heading>{home.audience['H-7-A']}</Heading>
          <Lede className="mt-5 max-w-[40rem]">{home.audience['H-7-B']}</Lede>
        </div>
        <ul role="list" className="border-t border-line">
          {home.audience.roles.map(({ role, measure, line }) => {
            const Glyph = ROLE_GLYPH[role]
            return (
              <li
                key={role}
                className="grid grid-cols-1 gap-2 border-b border-line py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6"
              >
                <div className="flex items-start gap-3">
                  <Glyph size={20} aria-hidden className="mt-[2px] shrink-0 text-link" />
                  <div>
                    <h3 className="text-[16px] font-semibold">{role}</h3>
                    <p className="mt-0.5 text-[13px] text-dim">{measure}</p>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.55] text-body/80">{line}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
