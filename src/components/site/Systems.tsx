import { Section, TILES } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

const { systems } = home

/* How the two products sit in a business, drawn from Charlie's journey
   diagram: the four steps from a traveller's question to the proposal, each
   named by what carries it, on a hairline rail (down the left on a phone,
   across from lg), and under them the systems the business already runs,
   which stay where they are. One closed box of the site's glass, as wide as
   the product tiles; a line under it says what is agreed at set-up. Second
   to the value, as the section's place on the page keeps it. */
export function Systems({ tone = 'page' }: { tone?: 'page' | 'tint' }) {
  const last = systems.steps.length - 1
  return (
    <Section id={SECTION.systems} tone={tone} heading={systems['H-11-A']}>
      <div className={cn(TILES, 'glass rounded-xl p-8 shadow-card')}>
        <ol role="list" className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
          {systems.steps.map(({ name, owner, line }, i) => (
            <li key={name} className="relative pl-8 lg:pl-0 lg:pt-8">
              <span aria-hidden className="absolute left-0 top-1.5 size-3 rounded-full bg-link lg:top-0" />
              {i < last && (
                <span
                  aria-hidden
                  className="absolute -bottom-8 left-[5.5px] top-6 w-px bg-line lg:-right-6 lg:bottom-auto lg:left-5 lg:top-[5.5px] lg:h-px lg:w-auto"
                />
              )}
              <p className={cn('text-label', owner === 'Your expert' ? 'text-body' : 'text-link')}>{owner}</p>
              <h3 className="mt-1 text-subhead">{name}</h3>
              <p className="mt-1 text-small text-dim">{line}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 border-t border-line pt-6 text-center">
          <h3 className="text-label text-dim">{systems['H-11-C']}</h3>
          <ul role="list" className="mt-4 flex flex-wrap justify-center gap-2">
            {systems.systems.map((system) => (
              <li key={system} className="rounded-full border border-line bg-soft px-3.5 py-1.5 text-small">
                {system}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[40rem] text-center text-small text-dim text-pretty">{systems['H-11-D']}</p>
    </Section>
  )
}
