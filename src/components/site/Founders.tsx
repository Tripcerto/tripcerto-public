import { ArrowUpRight } from 'lucide-react'
import type { Person } from '@/content/about'
import { cn } from '@/lib/utils'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

/* A person's portrait, square-cornered: the photograph where public/team/
   has one, otherwise the initials set large on the band's frosted pane
   (smoked by night), as the product frames are painted. The same box
   either way, so a photograph drops in without moving anything. */
function Portrait({ person, className, type }: { person: Person; className: string; type: 'text-display' | 'text-subhead' }) {
  if (person.photo) {
    return <img src={person.photo} alt={person.name} width={800} height={600} loading="lazy" decoding="async" className={cn(className, 'object-cover object-[center_25%]')} />
  }
  return (
    <div aria-hidden className={cn(className, 'bg-band-frosted flex dark:bg-band-smoked')}>
      <span className={cn(type, 'text-link')}>{initials(person.name)}</span>
    </div>
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

/* The founders, built as the product tiles are: a tile of the site's glass
   each, the portrait across its top, then the name, the role, the line and
   the founder's LinkedIn. Side by side from sm, the pair as wide as a
   product tile and a half, every tile the same height. */
export function Founders({ people }: { people: readonly Person[] }) {
  return (
    <ul role="list" className="mx-auto grid max-w-[48rem] grid-cols-1 gap-6 sm:grid-cols-2">
      {people.map((person) => (
        <li key={person.name} className="glass flex flex-col overflow-hidden rounded-xl shadow-card">
          <Portrait person={person} type="text-display" className="aspect-[4/3] w-full items-end p-6" />
          <div className="flex flex-1 flex-col px-6 pb-5 pt-5 md:px-7">
            <h3 className="text-subhead">{person.name}</h3>
            <p className="text-small text-dim">{person.role}</p>
            <p className="mt-3 text-copy text-dim">{person.line}</p>
            <LinkedIn person={person} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/* The advisers, a step down from the founders and on the same columns: two
   to a row from sm, the grid as wide as the founders' pair, each a tile with
   a square portrait beside the name and the role and the line under them,
   every tile in a row the same height. */
export function Advisers({ people }: { people: readonly Person[] }) {
  return (
    <ul role="list" className="mx-auto grid max-w-[48rem] grid-cols-1 gap-6 sm:grid-cols-2">
      {people.map((person) => (
        <li key={person.name} className="glass flex flex-col rounded-xl p-6 shadow-card md:px-7">
          <div className="flex items-center gap-4">
            <Portrait person={person} type="text-subhead" className="size-16 shrink-0 items-center justify-center rounded-lg" />
            <div className="min-w-0">
              <h3 className="text-subhead">{person.name}</h3>
              <p className="text-small text-dim">{person.role}</p>
            </div>
          </div>
          <p className="mt-4 text-copy text-dim">{person.line}</p>
          <LinkedIn person={person} />
        </li>
      ))}
    </ul>
  )
}
