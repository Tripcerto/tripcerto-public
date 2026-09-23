import type { ReactNode } from 'react'
import { Section } from '@/components/site/Section'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { ItineraryScreen } from '@/components/site/frames/WorkspaceScreen'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

/* A product as one tile of the site's glass, lifted off the page by the
   card shadow: its frame, held still at its finished state (the hero has
   just played the story) and painted with the page, then its name and its
   line under it. The whole tile opens the product's page: the
   name is the link and its hit area covers the tile, so a hover anywhere
   lifts the frame and turns the name pink, a press sets the frame back
   down, and the focus ring draws round the whole tile. Both frames stand
   the same height, centred, with the same room above them as between them
   and the name. */
function Product({
  name,
  line,
  href,
  frameClassName,
  frame,
}: {
  name: string
  line: string
  href: string
  frameClassName: string
  frame: ReactNode
}) {
  return (
    <article className="glass group relative mx-auto flex w-full max-w-[36rem] flex-col overflow-hidden rounded-xl shadow-card lg:max-w-none">
      <div className="flex justify-center py-6 md:py-7">
        <div
          className={cn(
            'still transition-transform duration-300 ease-site group-hover:-translate-y-1.5 group-active:translate-y-0 motion-reduce:transition-none',
            frameClassName,
          )}
        >
          {frame}
        </div>
      </div>
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <h3 className="text-subhead">
          <a
            href={href}
            className="transition-colors group-hover:text-link after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-link"
          >
            {name}
          </a>
        </h3>
        <p className="mt-1 text-copy text-dim">{line}</p>
      </div>
    </article>
  )
}

/* The two products side by side from lg, one to a row below, each tile
   as wide as the heading: the
   traveller's conversation on the phone, stopped at what they asked for,
   and the itinerary it became, zoomed in from the Workspace window, under
   a heading that says where each one works. */
export function Products() {
  return (
    <Section id={SECTION.products} heading={home.products['H-3-A']} lede={home.products['H-3-B']}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Product
          name="Engage"
          line={home.engage['H-4-A']}
          href={PAGES.engage}
          frameClassName="w-[38%] lg:w-[36%]"
          frame={<PhoneScreen surface="page" sends={false} />}
        />
        <Product
          name="Workspace"
          line={home.workspace['H-5-A']}
          href={PAGES.workspace}
          frameClassName="w-[76%] lg:w-[72%]"
          frame={<ItineraryScreen surface="page" />}
        />
      </div>
    </Section>
  )
}
