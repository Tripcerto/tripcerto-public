import type { ReactNode } from 'react'
import { Database, UserRound, Users } from 'lucide-react'
import { Section, TILES } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

const { layer } = home

/* One side of the layer: a ringed mark, the name and one line. From lg a
   hairline runs from the mark to the Tripcerto panel beside it, level with
   the mark's centre and the panel's name. */
function Side({ icon, name, line, toward }: { icon: ReactNode; name: string; line: string; toward: 'right' | 'left' }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <span
        aria-hidden
        className={cn(
          'absolute top-7 hidden h-px bg-line lg:block',
          toward === 'right' ? 'left-[calc(50%+2.5rem)] right-0' : 'left-0 right-[calc(50%+2.5rem)]',
        )}
      />
      <span className="flex size-14 items-center justify-center rounded-full border-2 border-link bg-page text-link ring-8 ring-link/10">
        {icon}
      </span>
      <h3 className="mt-4 text-subhead">{name}</h3>
      <p className="mt-1 max-w-[16rem] text-copy text-dim text-pretty">{line}</p>
    </div>
  )
}

/* Below lg, where the three stand one under another: the hairline carried
   down between them. */
const DOWN = <span aria-hidden className="mx-auto my-4 h-8 w-px bg-line lg:hidden" />

/* Where Tripcerto sits, drawn as the heading says it: the business's
   customers on the left, its experts on the right, and between them
   Tripcerto, one panel of the site's glass holding a product for each
   side, Engage facing the customers and Workspace the experts, on the
   business's own data. Drawn from the founders' review of 24 Sep, not from
   a slide, and kept simple: it shows no systems and no wiring, since a
   buyer whose set-up differs would read a drawing of one as "this would
   not work for us" (Charlie). As wide as the product tiles; from lg the
   three stand in a row, joined by a hairline level with the panel's name. */
export function Layer({ tone = 'page' }: { tone?: 'page' | 'tint' }) {
  return (
    <Section id={SECTION.layer} tone={tone} heading={layer['H-11-A']}>
      <div className={cn(TILES, 'flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start')}>
        <Side icon={<Users size={24} aria-hidden />} name={layer.customers.name} line={layer.customers.line} toward="right" />
        {DOWN}
        <div className="glass overflow-hidden rounded-lg shadow-card">
          <h3 className="flex h-14 items-center justify-center text-subhead">Tripcerto</h3>
          <ul role="list" className="grid grid-cols-2 divide-x divide-line border-t border-line">
            {layer.products.map(({ name, line }) => (
              <li key={name} className="px-4 py-5 text-center sm:px-6">
                <h4 className="text-subhead text-link">{name}</h4>
                <p className="mt-1 text-small text-dim text-pretty">{line}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-line bg-page/50 px-4 py-3 text-center text-small text-dim text-balance">
            <Database size={14} aria-hidden className="mr-1.5 inline align-[-2px]" />
            {layer.data}
          </p>
        </div>
        {DOWN}
        <Side icon={<UserRound size={24} aria-hidden />} name={layer.experts.name} line={layer.experts.line} toward="left" />
      </div>
    </Section>
  )
}
