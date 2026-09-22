import { ArrowRight, Check, LayoutPanelLeft } from 'lucide-react'
import { Heading, Lede, ProductBadge, Section } from '@/components/site/Section'
import { Stage } from '@/components/site/Stage'
import { WorkspaceChat } from '@/components/site/frames/WorkspaceChat'
import { WorkspaceScreen } from '@/components/site/frames/WorkspaceScreen'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

/* The window runs past its column to the shell's edge on large screens,
   so it reads at the size it is used at. */
export function WorkspaceSection() {
  return (
    <Section id={SECTION.workspace} className="pt-0 pb-16 md:pt-0 md:pb-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        <div>
          <ProductBadge glyph={LayoutPanelLeft}>Workspace</ProductBadge>
          <Heading className="mt-5">{home.workspace['H-5-A']}</Heading>
          <Lede className="mt-5 max-w-[40rem]">{home.workspace['H-5-B']}</Lede>
          <ul role="list" className="mt-8 space-y-3">
            {home.workspace.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base text-body">
                <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-link" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href={PAGES.workspace}
              className="group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-link"
            >
              More about Workspace
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </p>
        </div>
        <Stage caption={home.workspace.caption} className="max-lg:mb-8 lg:-mr-[max(0px,calc((100vw-var(--shell))/2))]">
          <div className="w-full">
            <WorkspaceScreen pane={<WorkspaceChat />} />
          </div>
        </Stage>
      </div>
    </Section>
  )
}
