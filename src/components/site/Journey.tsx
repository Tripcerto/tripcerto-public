import type { ReactNode } from 'react'
import { Database, UserRound } from 'lucide-react'
import { Section, TILES } from '@/components/site/Section'
import { home } from '@/content/home'
import { SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

const { journey } = home

/* Where a marker stands on the rail: the first draws the rail out to its
   right, the last in from its left, and any other straight through. */
type Along = 'first' | 'through' | 'last'

const ALONG: Record<Along, string> = {
  first: 'before:left-1/2 before:right-0',
  through: 'before:inset-x-0',
  last: 'before:left-0 before:right-1/2',
}

const ALONG_LG: Record<Along, string> = {
  first: 'lg:before:left-1/2 lg:before:right-0',
  through: 'lg:before:inset-x-0',
  last: 'lg:before:left-0 lg:before:right-1/2',
}

/* A marker's cell: a fixed-height strip with the rail through its middle
   and the marker centred on it. Cells meet with no gap between them, so
   the rail runs unbroken from one to the next. `along` is where the marker
   stands in its own row below lg, `alongLg` where it stands on the one
   rail from lg; without one there, the cell draws no rail at that size. */
function Stop({ along, alongLg, className, children }: { along?: Along; alongLg?: Along; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative flex h-16 items-center justify-center before:absolute before:top-1/2 before:h-px before:bg-line lg:h-20',
        along ? ALONG[along] : 'before:hidden',
        alongLg ? cn('lg:before:block', ALONG_LG[alongLg]) : 'lg:before:hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

const DOT = <span aria-hidden className="relative size-3 rounded-full bg-link" />

/* A product's half of the journey: its name and when it works, then its
   three steps on the rail in a panel, the data of the business's own it
   draws on at the panel's foot, and what it changes under the panel. */
function Stage({
  product,
  when,
  steps,
  data,
  caption,
  first,
}: {
  product: string
  when: string
  steps: readonly string[]
  data: string
  caption: string
  first?: boolean
}) {
  const last = steps.length - 1
  return (
    <div className="grid grid-cols-3 lg:row-span-5 lg:grid-rows-subgrid">
      <div aria-hidden className="col-span-full row-start-2 row-end-5 rounded-lg bg-page/70" />
      <h3 className="col-span-full row-start-1 pb-3 text-center text-label text-dim">
        <span className="text-link">{product}</span> · {when}
      </h3>
      <ol role="list" className="col-span-full row-start-2 row-span-2 grid grid-cols-subgrid grid-rows-subgrid">
        {steps.map((step, i) => (
          <li key={step} className="row-span-2 grid grid-rows-subgrid">
            <Stop along={i === 0 ? 'first' : i === last ? 'last' : 'through'} alongLg={first && i === 0 ? 'first' : 'through'}>
              {DOT}
            </Stop>
            <p className="px-1 text-center text-small text-balance">{step}</p>
          </li>
        ))}
      </ol>
      <p className="col-span-full row-start-4 px-3 pt-3 pb-4 text-center text-small text-dim text-balance">
        <Database size={14} aria-hidden className="mr-1.5 inline align-[-2px]" />
        {data}
      </p>
      <p className="col-span-full row-start-5 pt-4 text-center text-subhead text-balance">{caption}</p>
    </div>
  )
}

/* Between the stages below lg, where they stand one under another: the
   rail carried down from one to the next. */
const DOWN = <span aria-hidden className="mx-auto h-8 w-px bg-line lg:hidden" />

/* The journey the two products carry, drawn from Charlie's diagram in "The
   Changing Customer Journey": before the enquiry on Engage, the enquiry
   and the expert who takes it, after it on Workspace, then the sale. It
   shows the handoff to a person in the middle, so neither product reads as
   doing the expert's work, and it names only the kinds of data each
   product draws on, never how a business wires its systems (Charlie, 24
   Sep). One closed box of the site's glass, as wide as the product tiles.

   From lg it is one row on one rail: the grid's five rows (the stage's
   name, the rail, the steps' names, the data, what changes) are shared by
   every part through subgrid, so the rail and each row line up across it.
   Below lg the parts stand one under another, each on a short rail of its
   own, joined down the middle. */
export function Journey({ tone = 'page' }: { tone?: 'page' | 'tint' }) {
  const { engage, handoff, workspace } = journey
  return (
    <Section id={SECTION.journey} tone={tone} heading={journey['H-11-A']}>
      <div
        className={cn(
          TILES,
          'glass flex flex-col rounded-xl p-5 shadow-card sm:p-8 lg:grid lg:grid-cols-[3fr_auto_3fr_auto] lg:grid-rows-[repeat(5,auto)]',
        )}
      >
        <Stage product="Engage" when={engage.when} steps={engage.steps} data={engage.data} caption={engage['H-11-B']} first />
        {DOWN}
        <div className="grid grid-cols-[auto_auto] justify-center lg:row-span-5 lg:grid-rows-subgrid">
          <Stop along="first" alongLg="through" className="row-start-2 px-4 lg:px-3">
            <p className="relative rounded-full border border-line bg-page px-4 py-2 text-label">{handoff.enquiry}</p>
          </Stop>
          <Stop along="last" alongLg="through" className="row-start-2 px-6 lg:px-5">
            <span className="relative flex size-14 items-center justify-center rounded-full border-2 border-link bg-page text-link ring-8 ring-link/10 lg:size-16">
              <UserRound size={24} aria-hidden />
            </span>
          </Stop>
          <p className="col-start-2 row-start-3 text-center text-small">{handoff.expert}</p>
          <p className="col-span-full row-start-5 pt-4 text-center text-subhead text-balance lg:max-w-[12rem] lg:justify-self-center">
            {handoff['H-11-C']}
          </p>
        </div>
        {DOWN}
        <Stage product="Workspace" when={workspace.when} steps={workspace.steps} data={workspace.data} caption={workspace['H-11-D']} />
        {DOWN}
        <div className="flex justify-center lg:row-span-5 lg:grid lg:grid-rows-subgrid">
          <Stop alongLg="last" className="lg:row-start-2 lg:pl-4">
            <p className="relative rounded-full bg-link px-5 py-2 text-label text-paper">{journey.sale}</p>
          </Stop>
        </div>
      </div>
    </Section>
  )
}
