import type { LucideIcon } from 'lucide-react'
import { BadgePoundSterling, ClipboardCheck, Handshake, Megaphone, ServerCog } from 'lucide-react'
import { Section, TILES } from '@/components/site/Section'
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
}

/* The buying roles in one closed box of the site's glass under the
   heading. Each role is its glyph and name, then the measures it is held
   to, a bullet each, set as copy. From lg the box is as wide as the
   product tiles above and the five stand side by side, ruled between.
   Below that the box is the tiles' column (TILES), and each role is a row: the glyph and name on the left and the measures down the
   right, in two columns of one width in every row, the pair centred and
   each centred on the other, so no measure runs past two lines at any
   width. The glyph and name are centred in their column, and in their
   column from lg, with the measures centred as a block under them. */
export function Audience({ tone = 'tint' }: { tone?: 'page' | 'tint' }) {
  return (
    <Section id={SECTION.audience} tone={tone} heading={home.audience['H-7-A']}>
      <ul
        role="list"
        className={cn(TILES, 'glass divide-y divide-line overflow-hidden rounded-xl shadow-card lg:grid lg:grid-cols-5 lg:divide-x lg:divide-y-0')}
      >
        {home.audience.roles.map(({ role, measures }) => {
          const Glyph = ROLE_GLYPH[role]
          return (
            <li
              key={role}
              className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-x-5 px-5 py-5 sm:grid-cols-[10rem_16rem] sm:justify-center lg:flex lg:flex-col lg:justify-start lg:gap-x-0 lg:px-7 lg:py-9"
            >
              <div className="flex flex-col items-center gap-2 text-center lg:gap-4">
                <Glyph size={24} aria-hidden className="text-link" />
                <h3 className="text-subhead">{role}</h3>
              </div>
              <ul role="list" className="list-disc space-y-1 pl-[1.1em] text-copy text-dim marker:text-dim/60 lg:mx-auto lg:mt-4">
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
