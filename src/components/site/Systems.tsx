import type { CSSProperties } from 'react'
import { Section, TILES } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

const { systems } = home

/* How the two products sit in a business, drawn from Charlie's journey
   diagram: the four steps from a traveller's question to the proposal, each
   named by what carries it, on a hairline rail, and under them the systems
   the business already runs, which stay where they are. One closed box of
   the site's glass, as wide as the product tiles; a line under it says what
   is agreed at set-up. Second to the value, as the section's place on the
   page keeps it.

   On a phone and a tablet the rail runs down the left. From lg it runs
   across the whole box with the dots evenly spaced from end to end: the
   first step set from the left edge, the last to the right edge, and the
   steps between centred on their dots. For that the row is cut into twice
   as many columns as there are gaps between the dots, so each dot stands on
   a column line; a step takes the two columns either side of its dot (the
   first and last, the two inside the box), and stands two thirds of that
   wide, less the gap, so neighbours never touch. */
export function Systems({ tone = 'page' }: { tone?: 'page' | 'tint' }) {
  const last = systems.steps.length - 1
  return (
    <Section id={SECTION.systems} tone={tone} heading={systems['H-11-A']}>
      <div className={cn(TILES, 'glass rounded-xl p-8 shadow-card')}>
        <ol
          role="list"
          style={{ '--cols': 2 * last } as CSSProperties}
          className="relative grid grid-cols-1 gap-8 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-0 lg:before:absolute lg:before:inset-x-1.5 lg:before:top-[5.5px] lg:before:h-px lg:before:bg-line"
        >
          {systems.steps.map(({ name, owner, line }, i) => (
            <li
              key={name}
              style={{ '--start': i === 0 ? 1 : i === last ? 2 * last - 1 : 2 * i } as CSSProperties}
              className={cn(
                'relative pl-8 lg:row-start-1 lg:w-[calc((100%-1.5rem)*2/3)] lg:pl-0 lg:pt-8 lg:[grid-column:var(--start)/span_2]',
                i === 0 ? 'lg:justify-self-start' : i === last ? 'lg:justify-self-end lg:text-right' : 'lg:justify-self-center lg:text-center',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-1.5 size-3 rounded-full bg-link lg:top-0',
                  i === last ? 'lg:left-auto lg:right-0' : i > 0 && 'lg:left-1/2 lg:-translate-x-1/2',
                )}
              />
              {i < last && <span aria-hidden className="absolute -bottom-8 left-[5.5px] top-6 w-px bg-line lg:hidden" />}
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
