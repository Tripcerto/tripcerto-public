import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, Boxes, Flag, ListOrdered, Send, UserRoundCheck, Users } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Heading, Lede, Section } from '@/components/site/Section'
import { WorkspaceChat } from '@/components/site/frames/WorkspaceChat'
import { WorkspaceScreen } from '@/components/site/frames/WorkspaceScreen'
import { workspace } from '@/content/workspace'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  trip: 'the-itemised-trip',
  systems: 'how-it-works',
  boundaries: 'what-stays',
} as const

type Column = (typeof workspace.trip.columns)[number]['name']
type Row = (typeof workspace.systems.rows)[number]['name']

const COLUMN_GLYPH: Record<Column, LucideIcon> = {
  'Structured, in order': ListOrdered,
  'The gaps, flagged': Flag,
  'Resolved, then approved': BadgeCheck,
}

const ROW_GLYPH: Record<Row, LucideIcon> = {
  'Your inventory and suppliers': Boxes,
  'Your CRM and inquiry channels': Users,
  'Your proposal and booking process': Send,
  'Your experts, in control': UserRoundCheck,
}

/* The Workspace page: the opening on the band with the window and Stella's
   pane, the itemised trip as three ruled columns, the systems it connects
   to as ruled rows, what stays where it is, and the close. */
export function WorkspacePage() {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main>
        <PageHero
          title={workspace.hero['W-1-A']}
          lede={workspace.hero['W-1-B']}
          primary={{ label: workspace.hero['W-1-C'], href: DEMO_URL }}
          secondary={{ label: workspace.hero['W-1-D'], href: `#${ID.trip}` }}
          layout="window"
          visual={
            <div className="w-full max-w-[600px]">
              <WorkspaceScreen pane={<WorkspaceChat />} />
            </div>
          }
        />

        <Section id={ID.trip}>
          <div className="max-w-[44rem]">
            <Heading>{workspace.trip['W-3-A']}</Heading>
            <Lede className="mt-5">{workspace.trip['W-3-B']}</Lede>
          </div>
          <ul role="list" className="mt-14 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-10 xl:gap-x-14">
            {workspace.trip.columns.map(({ name, line }) => {
              const Glyph = COLUMN_GLYPH[name]
              return (
                <li key={name} className="border-t border-line pt-6">
                  <h3 className="flex items-center gap-2.5 text-[19px] font-semibold">
                    <Glyph size={22} aria-hidden className="shrink-0 text-link" />
                    {name}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.55] text-body/80">{line}</p>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section id={ID.systems} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{workspace.systems['W-4-A']}</Heading>
            <Lede className="mt-5">{workspace.systems['W-4-B']}</Lede>
          </div>
          <ul role="list" className="mt-12 divide-y divide-line md:mt-14">
            {workspace.systems.rows.map(({ name, detail, line }) => {
              const Glyph = ROW_GLYPH[name]
              return (
                <li key={name} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12 md:gap-y-0">
                  <div className="flex items-start gap-3">
                    <Glyph size={22} aria-hidden className="mt-px shrink-0 text-link" />
                    <div>
                      <h3 className="text-[17px] leading-[1.4] font-semibold">{name}</h3>
                      <p className="mt-1 text-[14px] leading-[1.5] text-dim">{detail}</p>
                    </div>
                  </div>
                  <p className="pl-[34px] text-[16px] leading-[1.55] text-body/80 md:pl-0">{line}</p>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section id={ID.boundaries}>
          <div className="max-w-[44rem]">
            <Heading>{workspace.boundaries['W-6-A']}</Heading>
            <Lede className="mt-5">{workspace.boundaries['W-6-B']}</Lede>
          </div>
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
