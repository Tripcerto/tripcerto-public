import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, Flag, ListOrdered } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Section } from '@/components/site/Section'
import { WorkspaceScreen } from '@/components/site/frames/WorkspaceScreen'
import { workspace } from '@/content/workspace'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  trip: 'the-itemised-trip',
} as const

type Column = (typeof workspace.trip.columns)[number]['name']

const COLUMN_GLYPH: Record<Column, LucideIcon> = {
  'Structured, in order': ListOrdered,
  'The gaps, flagged': Flag,
  'Resolved, then approved': BadgeCheck,
}

/* The Workspace page: the opening on the band with the window and Stella's
   pane, the itemised trip as three ruled columns, and the close. Every
   section shows the product or leads somewhere (23 Sep sync). */
export function WorkspacePage() {
  return (
    <>
      <Nav current={PAGES.workspace} />
      <main>
        <PageHero
          title={workspace.hero['W-1-A']}
          lede={workspace.hero['W-1-B']}
          primary={{ label: workspace.hero['W-1-C'], href: DEMO_URL }}
          secondary={{ label: workspace.hero['W-1-D'], href: `#${ID.trip}` }}
          layout="window"
          visual={
            <div className="w-full max-w-[600px]">
              <WorkspaceScreen surface="band" />
            </div>
          }
        />

        <Section id={ID.trip} heading={workspace.trip['W-3-A']} lede={workspace.trip['W-3-B']}>
          <ul role="list" className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-10 xl:gap-x-14">
            {workspace.trip.columns.map(({ name, line }) => {
              const Glyph = COLUMN_GLYPH[name]
              return (
                <li key={name} className="border-t border-line pt-6">
                  <h3 className="flex items-center gap-2.5 text-subhead">
                    <Glyph size={22} aria-hidden className="shrink-0 text-link" />
                    {name}
                  </h3>
                  <p className="mt-3 text-copy text-dim">{line}</p>
                </li>
              )
            })}
          </ul>
        </Section>

        <Close
          heading={workspace.close['W-8-A']}
          line={workspace.close['W-8-B']}
          primary={{ label: workspace.close['W-9-B'], href: DEMO_URL }}
          secondary={{ label: workspace.close['W-9-C'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
