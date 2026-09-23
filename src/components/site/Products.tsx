import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Heading, Lede, Section } from '@/components/site/Section'
import { Reveal } from '@/components/site/Reveal'
import { Stage } from '@/components/site/Stage'
import { PRODUCT_GLYPH } from '@/components/site/frames/glyphs'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { WorkspaceChat } from '@/components/site/frames/WorkspaceChat'
import { WorkspaceScreen } from '@/components/site/frames/WorkspaceScreen'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'
import { cn } from '@/lib/utils'

/* A product as a glass card that opens its page: label, name, the line
   and the sentence under it beside the product's frame, a pool of the
   band's light low in the card, and a bar across the foot that is the
   link. The card is a size container: its type scales with its own width,
   steps down in a card narrower than 20rem, and the frame moves beside the
   copy once the card is 36rem wide, the same at any screen. The frame's column is set per card, since the phone
   stands narrower than the window. */
function ProductCard({
  glyph: Glyph,
  label,
  name,
  line,
  body,
  link,
  href,
  columns,
  frameClassName,
  frame,
}: {
  glyph: LucideIcon
  label: string
  name: string
  line: string
  body: string
  link: string
  href: string
  columns: string
  frameClassName: string
  frame: ReactNode
}) {
  return (
    <article className="glass @container relative isolate flex flex-col overflow-hidden rounded-xl shadow-card">
      <span aria-hidden className="bg-glow absolute -bottom-[30%] -left-[25%] -z-10 aspect-square w-[95%] rounded-full" />
      <div className={cn('grid flex-1 grid-cols-1 gap-7 p-5 @min-[36rem]:gap-6 @min-[36rem]:p-8', columns)}>
        <div>
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase text-dim @min-[20rem]:tracking-[0.04em] @min-[42rem]:gap-3 @min-[42rem]:text-[13px]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-link @min-[42rem]:size-11">
              <Glyph aria-hidden className="size-[18px] @min-[42rem]:size-5" />
            </span>
            {label}
          </p>
          <h3 className="mt-4 text-[clamp(1.875rem,6.5cqw,2.75rem)] font-bold leading-none tracking-[-0.03em] @min-[36rem]:mt-5">{name}</h3>
          <p className="mt-3 text-balance text-[clamp(1.1875rem,3.8cqw,1.625rem)] font-semibold leading-[1.2] tracking-[-0.015em] @min-[36rem]:mt-5">{line}</p>
          <Lede className="mt-3 max-w-[24rem] text-base @min-[36rem]:mt-4 @min-[36rem]:text-[17px]">{body}</Lede>
        </div>
        <Stage className="self-center">
          <Reveal className={frameClassName}>{frame}</Reveal>
        </Stage>
      </div>
      <a
        href={href}
        className="group flex items-center justify-between gap-4 rounded-b-xl border-t border-line bg-soft px-5 py-4 transition-colors hover:bg-card focus-visible:-outline-offset-4 @min-[36rem]:px-8 @min-[36rem]:py-5"
      >
        <span className="text-base font-bold tracking-[-0.015em] text-link @min-[20rem]:text-[clamp(1.125rem,3.4cqw,1.5rem)]">{link}</span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-body text-page transition-transform duration-200 group-hover:translate-x-1 @min-[36rem]:size-12">
          <ArrowRight aria-hidden className="size-[18px] @min-[36rem]:size-5" />
        </span>
      </a>
    </article>
  )
}

/* The two products side by side, each opening its own page. Two up from
   xl, in a container wider than the shell like the hero's; below that one
   card to a row. */
export function Products() {
  return (
    <Section id={SECTION.products} wide className="py-16 md:py-28">
      <div className="mx-auto max-w-[60rem] text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-link">{home.products.eyebrow}</p>
        <Heading className="mt-4 font-bold tracking-[-0.03em] xl:text-5xl">{home.products['H-3-A']}</Heading>
        <Lede className="mx-auto mt-4 max-w-[40rem] md:text-xl">{home.products['H-3-B']}</Lede>
      </div>

      <div className="mx-auto mt-12 grid max-w-[52rem] grid-cols-1 gap-5 md:mt-16 xl:max-w-none xl:grid-cols-2">
        <ProductCard
          glyph={PRODUCT_GLYPH.Engage}
          label={home.engage.label}
          name="Engage"
          line={home.engage['H-4-A']}
          body={home.engage['H-4-B']}
          link={home.engage.link}
          href={PAGES.engage}
          columns="@min-[36rem]:grid-cols-[minmax(0,1fr)_32%]"
          frameClassName="w-[min(48%,180px)] @min-[36rem]:w-full @min-[36rem]:max-w-[205px]"
          frame={<PhoneScreen />}
        />
        <ProductCard
          glyph={PRODUCT_GLYPH.Workspace}
          label={home.workspace.label}
          name="Workspace"
          line={home.workspace['H-5-A']}
          body={home.workspace['H-5-B']}
          link={home.workspace.link}
          href={PAGES.workspace}
          columns="@min-[36rem]:grid-cols-[minmax(0,1fr)_45%] @min-[42rem]:grid-cols-[minmax(0,1fr)_48%]"
          frameClassName="w-full"
          frame={<WorkspaceScreen pane={<WorkspaceChat />} />}
        />
      </div>
    </Section>
  )
}
