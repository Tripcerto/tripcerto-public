import { ArrowRight, Check } from 'lucide-react'
import { Eyebrow, Heading, Lede, Section } from '@/components/site/Section'
import { WindowFrame } from '@/components/site/frames/WindowFrame'
import { WorkspacePlaceholder } from '@/components/site/frames/WorkspacePlaceholder'
import { home } from '@/content/home'
import { PAGES, SECTION } from '@/lib/links'

export function WorkspaceSection() {
  return (
    <Section id={SECTION.workspace}>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Workspace</Eyebrow>
          <Heading className="mt-3">{home.workspace['H-5-A']}</Heading>
          <Lede className="mt-5 max-w-[40rem]">{home.workspace['H-5-B']}</Lede>
          <ul role="list" className="mt-8 space-y-3">
            {home.workspace.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base text-ink">
                <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-primary-deep" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href={PAGES.workspace}
              className="group -my-2.5 inline-flex items-center gap-1 py-2.5 font-semibold text-primary-deep"
            >
              More about Workspace
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </p>
        </div>
        <figure>
          <div className="rounded-xl bg-tint p-6 md:p-10">
            <WindowFrame title="Workspace">
              <div className="h-[320px]">
                <WorkspacePlaceholder />
              </div>
            </WindowFrame>
          </div>
          <figcaption className="mt-4 text-center text-[13px] text-muted">{home.workspace.caption}</figcaption>
        </figure>
      </div>
    </Section>
  )
}
