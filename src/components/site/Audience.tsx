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

/* The buying roles as ruled rows: the role with the number it is measured
   on stacked under it, and what changes for it alongside, both read from
   the top of the row. Rules sit only between rows, so the list opens onto
   the band 40px below the last one, the distance the footer keeps under
   it; md:pb-10 is what outranks the Section's md:py-28. */
export function Audience() {
  return (
    <Section id={SECTION.audience} tone="tint" className="pb-10 md:pb-10">
      <div className="max-w-[44rem]">
        <Heading>{home.audience['H-7-A']}</Heading>
        <Lede className="mt-5">{home.audience['H-7-B']}</Lede>
      </div>

      <ul role="list" className="mt-12 divide-y divide-line md:mt-14">
        {home.audience.roles.map(({ role, measure, line }) => {
          const Glyph = ROLE_GLYPH[role]
          return (
            <li
              key={role}
              className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12 md:gap-y-0"
            >
              <div className="flex items-start gap-3">
                <Glyph size={22} aria-hidden className="mt-px shrink-0 text-link" />
                <div>
                  <h3 className="text-[17px] leading-[1.4] font-semibold">{role}</h3>
                  <p className="mt-1 text-[14px] leading-[1.5] text-dim">{measure}</p>
                </div>
              </div>
              <p className="pl-[34px] text-[16px] leading-[1.55] text-body/80 md:pl-0">{line}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
