import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/site/Section'
import { about, advisers, founders, type Fact, type Person } from '@/content/about'
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
function Portrait({ person, className, size }: { person: Person; className: string; size: number }) {
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

/* A person's facts, one under the other between hairlines: the figure in a
   column of its own so the figures line up, and what it counts beside it.
   In an adviser's narrow tile below lg the figure stands over its label, so
   the label keeps the tile's width. */
function Facts({ facts, size }: { facts: readonly Fact[]; size: 'copy' | 'small' }) {
  return (
    <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
      {facts.map(({ figure, label }) => (
        <li
          key={label}
          className={cn(
            'grid items-baseline gap-3 py-2.5',
            size === 'copy' ? 'grid-cols-[4.5rem_minmax(0,1fr)]' : 'grid-cols-1 gap-0.5 lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:gap-3',
          )}
        >
          <span className="text-subhead tabular-nums">{figure}</span>
          <span className={cn(size === 'copy' ? 'text-copy' : 'text-small', 'text-dim')}>{label}</span>
        </li>
      ))}
    </ul>
  )
}

function LinkedIn({ person }: { person: Person }) {
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

/* A founder's tile, of the site's glass: the words lead and the portrait
   stays second (Taylor, 24 Sep), a square beside them from sm and above
   them on a phone, then the name, the role, the facts, what they lead and
   the LinkedIn. */
function FounderTile({ person }: { person: Person }) {
  return (
    <li className="glass flex flex-col gap-5 rounded-xl p-6 shadow-card sm:flex-row md:p-7">
      <Portrait person={person} size={400} className="size-24 shrink-0 rounded-lg md:size-28" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="text-subhead">{person.name}</h4>
        <p className="text-small text-dim">{person.role}</p>
        <Facts facts={person.facts} size="copy" />
        {person.note && <p className="mt-3 text-copy text-dim">{person.note}</p>}
        <LinkedIn person={person} />
      </div>
    </li>
  )
}

/* An adviser's tile, a step down from a founder's: a small square portrait
   (Taylor, 24 Sep) above the name, the fact, the line on what they bring
   and the LinkedIn. The tile is a subgrid of the list's rows, so across a
   row of tiles each of the four parts starts on the same line, whatever
   the one above it wraps to, and the line and the link sit at the foot. */
function AdviserTile({ person }: { person: Person }) {
  return (
    <li className="glass row-span-4 grid grid-rows-subgrid gap-y-0 rounded-xl p-4 shadow-card md:p-5">
      <div className="flex flex-col gap-3">
        <Portrait person={person} size={160} className="size-14 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <h4 className="text-subhead">{person.name}</h4>
          <p className="text-small text-dim">{person.role}</p>
        </div>
      </div>
      <Facts facts={person.facts} size="small" />
      <p className="mt-3 text-small text-dim">{person.note}</p>
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

/* The team as one section (Taylor, 24 Sep): the founders, two tiles side by
   side from sm, then the advisers, four across from lg and two to a row
   below it, phones included, on the same columns (a founder's tile spans
   two adviser columns), as wide as the product tiles. Whatever follows (the home page's way on to About) sits under it. */
export function Team({ tone, children }: { tone: 'page' | 'tint'; children?: ReactNode }) {
  return (
    <Section id={SECTION.team} tone={tone} heading={team['A-3-A']}>
      <div className="mx-auto max-w-[64rem] space-y-12">
        <Group label={team['A-3-B']}>
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {founders.map((person) => (
              <FounderTile key={person.name} person={person} />
            ))}
          </ul>
        </Group>
        <Group label={team['A-3-C']}>
          <ul role="list" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {/* Each tile spans four of this list's rows (see AdviserTile). */}
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
