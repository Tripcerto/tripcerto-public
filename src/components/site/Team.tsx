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

/* A person's portrait, square-cornered and filling its box edge to edge:
   the photograph where public/team/ has one, otherwise the initials set
   large in the box's corner on the band's frosted pane (smoked by night),
   as the product frames are painted. The same box either way, so a
   photograph drops in without moving anything. */
function Portrait({ person, className, square }: { person: Person; className: string; square: boolean }) {
  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.name}
        width={square ? 800 : 1200}
        height={square ? 800 : 900}
        loading="lazy"
        decoding="async"
        className={cn(className, 'object-cover')}
      />
    )
  }
  return (
    <div aria-hidden className={cn(className, 'bg-band-frosted flex items-end p-4 dark:bg-band-smoked md:p-5')}>
      <span className="text-display text-link">{initials(person.name)}</span>
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

/* A tile of the site's glass per person, the portrait across its top, as
   the product tiles carry their frames: then the name, the role, the facts,
   an adviser's note and the LinkedIn. A founder's portrait is 4:3 and an
   adviser's square, so a founder's tile spans two adviser columns exactly
   and every edge on the page lines up. */
function Tile({ person, founder }: { person: Person; founder: boolean }) {
  return (
    <li className="glass flex flex-col overflow-hidden rounded-xl shadow-card">
      <Portrait person={person} square={!founder} className={cn('w-full', founder ? 'aspect-[4/3]' : 'aspect-square')} />
      <div className={cn('flex flex-1 flex-col', founder ? 'px-6 pb-5 pt-5 md:px-7' : 'px-4 pb-4 pt-4 md:px-5')}>
        <h4 className="text-subhead">{person.name}</h4>
        <p className="text-small text-dim">{person.role}</p>
        <Facts facts={person.facts} size={founder ? 'copy' : 'small'} />
        {person.note && <p className="mt-3 text-small text-dim">{person.note}</p>}
        <LinkedIn person={person} />
      </div>
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
   below it, phones included, on the same columns, as wide as the product
   tiles. Whatever follows (the home page's way on to About) sits under it. */
export function Team({ tone, children }: { tone: 'page' | 'tint'; children?: ReactNode }) {
  return (
    <Section id={SECTION.team} tone={tone} heading={team['A-3-A']}>
      <div className="mx-auto max-w-[64rem] space-y-12">
        <Group label={team['A-3-B']}>
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {founders.map((person) => (
              <Tile key={person.name} person={person} founder />
            ))}
          </ul>
        </Group>
        <Group label={team['A-3-C']}>
          <ul role="list" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {advisers.map((person) => (
              <Tile key={person.name} person={person} founder={false} />
            ))}
          </ul>
        </Group>
      </div>
      {children}
    </Section>
  )
}
