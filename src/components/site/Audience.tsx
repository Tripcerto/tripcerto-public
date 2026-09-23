import type { LucideIcon } from 'lucide-react'
import { BadgePoundSterling, ClipboardCheck, Compass, Handshake, Megaphone, ServerCog } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

type Role = (typeof home.audience.roles)[number]['role']

const ROLE_GLYPH: Record<Role, LucideIcon> = {
  Sales: Handshake,
  Marketing: Megaphone,
  Operations: ClipboardCheck,
  Technology: ServerCog,
  Finance: BadgePoundSterling,
  'The travel expert': Compass,
}

/* The buying roles as a ruled grid: each cell the role's glyph, its name
   and the measures it is held to, one to a line. Two columns on a phone,
   three from md; rules run between the cells and across the top and foot,
   never up the outer sides, so the grid opens onto the page. The foot rule
   sits 40px above the band, the distance the footer keeps under it;
   md:pb-10 is what outranks the Section's md:py-28. */
export function Audience() {
  return (
    <Section id={SECTION.audience} tone="tint" className="pb-10 md:pb-10">
      <div className="max-w-[44rem]">
        <Heading>{home.audience['H-7-A']}</Heading>
        <Lede className="mt-5">{home.audience['H-7-B']}</Lede>
      </div>

      <ul role="list" className="mt-12 grid grid-cols-2 border-t border-line md:mt-14 md:grid-cols-3">
        {home.audience.roles.map(({ role, measures }, i) => {
          const Glyph = ROLE_GLYPH[role]
          return (
            <li
              key={role}
              className={cn(
                'border-b border-line py-7 pr-4 md:py-9 md:pr-8',
                i % 2 ? 'border-l pl-5' : 'pl-0',
                i % 3 ? 'md:border-l md:pl-8' : 'md:border-l-0 md:pl-0',
              )}
            >
              <Glyph size={22} aria-hidden className="text-link" />
              <h3 className="mt-4 text-[17px] leading-[1.3] font-semibold md:text-[19px]">{role}</h3>
              <ul role="list" className="mt-3 space-y-1.5 text-[14px] leading-[1.4] text-dim md:text-[15px]">
                {measures.map((measure) => (
                  <li key={measure}>{measure}</li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
