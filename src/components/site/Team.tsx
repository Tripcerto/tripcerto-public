import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Section, TILES } from '@/components/site/Section'
import { about, advisers, founders, type Adviser, type Fact, type Person } from '@/content/about'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

const { team } = about

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

/* A person's portrait, a square with rounded corners: the photograph where
   public/team/ has one, otherwise the initials on the band's frosted pane
   (smoked by night), as the product frames are painted. The same box either
   way, so a photograph drops in without moving anything. */
function Portrait({ person, className, size }: { person: Adviser; className: string; size: number }) {
  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.name}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={cn(className, 'object-cover')}
      />
    )
  }
  return (
    <div aria-hidden className={cn(className, 'bg-band-frosted flex items-center justify-center dark:bg-band-smoked')}>
      <span className="text-subhead text-link">{initials(person.name)}</span>
    </div>
  )
}

/* A person's facts, one under the other between hairlines. In a founder's
   tile the figure has a column of its own so the figures line up, and what
   it counts sits beside it; in an adviser's narrower tile the figure stands
   over its label. The same at every screen width. */
function Facts({ facts, size }: { facts: readonly Fact[]; size: 'copy' | 'small' }) {
  return (
    <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
      {facts.map(({ figure, label }) => (
        <li
          key={label}
          className={cn(
            'grid items-baseline gap-3 py-2.5',
            size === 'copy' ? 'grid-cols-[4.5rem_minmax(0,1fr)]' : 'grid-cols-1 gap-0.5',
          )}
        >
          <span className="text-subhead tabular-nums">{figure}</span>
          <span className={cn(size === 'copy' ? 'text-copy' : 'text-small', 'text-dim')}>{label}</span>
        </li>
      ))}
    </ul>
  )
}

function LinkedIn({ person }: { person: Adviser }) {
  if (!person.linkedin) return null
  return (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex min-h-11 items-center gap-1 self-start pt-2 text-small text-link underline-offset-4 hover:underline"
    >
      LinkedIn
      <span className="sr-only">: {person.name} (opens in a new tab)</span>
      <ArrowUpRight size={14} aria-hidden />
    </a>
  )
}

/* A founder's tile, of the site's glass: the portrait beside the name and
   the role, then the facts, what they lead and the LinkedIn, the words
   leading and the portrait second (Taylor, 24 Sep). Like an adviser's, the
   tile is a subgrid of the list's rows, so the two founders' parts start on
   the same lines. One design at every width: the list changes how many sit
   in a row, never what a tile looks like (Taylor, 24 Sep). */
function FounderTile({ person }: { person: Person }) {
  return (
    <li className="glass row-span-4 grid grid-rows-subgrid gap-y-0 rounded-xl p-5 shadow-card">
      <div className="flex items-center gap-4">
        <Portrait person={person} size={400} className="size-20 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <h4 className="text-subhead">{person.name}</h4>
          <p className="text-small text-dim">{person.role}</p>
        </div>
      </div>
      <Facts facts={person.facts} size="copy" />
      <p className="mt-3 text-copy text-dim">{person.note}</p>
      <LinkedIn person={person} />
    </li>
  )
}

/* An adviser's tile, a step down from a founder's: the portrait, the
   name under it and the LinkedIn at the foot, and nothing else (both
   founders, 24 Sep afternoon review). */
function AdviserTile({ person }: { person: Adviser }) {
  return (
    <li className="glass flex flex-col items-start gap-3 rounded-xl p-5 shadow-card">
      <Portrait person={person} size={192} className="size-16 shrink-0 rounded-lg" />
      <h4 className="text-subhead">{person.name}</h4>
      <LinkedIn person={person} />
    </li>
  )
}

/* A group's label, as the FAQ labels its topics: small, in the link colour,
   at the left edge of the grid it heads. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-label text-link">{label}</h3>
      {children}
    </div>
  )
}

/* The team as one section (Taylor, 24 Sep): the founders, then the
   advisers, in tiles that keep one design at every width while the rows
   around them change, across the tiles' width (TILES) with the product
   tiles' gap, so the founders' edges meet the product tiles'. From lg the
   founders sit two across and the advisers four; below it the founders
   stand one above the other and the advisers two to a row, in the one
   centred column. Whatever follows (the home page's way on to About) sits
   under it. */
export function Team({ tone, children }: { tone: 'page' | 'tint'; children?: ReactNode }) {
  return (
    <Section id={SECTION.team} tone={tone} heading={team['A-3-A']}>
      <div className={cn(TILES, 'space-y-12')}>
        <Group label={team['A-3-B']}>
          <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Each tile spans four of this list's rows (see FounderTile). */}
            {founders.map((person) => (
              <FounderTile key={person.name} person={person} />
            ))}
          </ul>
        </Group>
        <Group label={team['A-3-C']}>
          <ul role="list" className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {advisers.map((person) => (
              <AdviserTile key={person.name} person={person} />
            ))}
          </ul>
        </Group>
      </div>
      {children}
    </Section>
  )
}
