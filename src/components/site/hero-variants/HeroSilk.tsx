import { lazy, Suspense } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowFrame } from '@/components/site/frames/WindowFrame'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { WorkspacePlaceholder } from '@/components/site/frames/WorkspacePlaceholder'
import { home } from '@/content/home'
import { DEMO_URL, SECTION } from '@/lib/links'

const PRODUCTS_HREF = `#${SECTION.products}`

/* three.js is most of the bundle; the copy paints first and the silk follows. */
const Silk = lazy(() => import('@/components/ui/silk').then((m) => ({ default: m.Silk })))

function Title({ text }: { text: string }) {
  return (
    <h1
      id="hero-title"
      className="text-gradient mx-auto mt-6 max-w-[20ch] text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]"
    >
      {text}
    </h1>
  )
}

/* The silk runs under the whole section at half strength, so the nav's glass
   has fabric to blur. The copy carries its own heavier veil, sized by the
   copy itself rather than by a proportion of the section, so the headline
   stays on pale paper however many lines it wraps to at any width. The
   devices sit on the fabric's strong band inside a glass card. */
export function HeroSilk() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-paper pb-16 pt-28 md:pb-24 md:pt-36"
    >
      <Suspense fallback={null}>
        <Silk
          className="absolute inset-0"
          color="#FF9B7A"
          accent="#FF7A5C"
          speed={4}
          scale={1.1}
          noiseIntensity={1.2}
          rotation={0.35}
        />
      </Suspense>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-paper/50" />
      {/* Taller on phones: the fabric closes behind the window and the phone frame sits on paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28rem] bg-linear-to-t from-paper to-transparent md:h-48"
      />

      <div className="shell relative z-10">
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 -inset-x-[100vw]">
            <div className="absolute inset-x-0 -top-24 h-24 bg-linear-to-b from-transparent to-paper/70" />
            <div className="absolute inset-0 bg-paper/70" />
            <div className="absolute inset-x-0 -bottom-24 h-24 bg-linear-to-b from-paper/70 to-transparent" />
          </div>

          <div className="animate-rise relative mx-auto flex max-w-[56rem] flex-col items-center text-center">
            <a
              href={PRODUCTS_HREF}
              className="relative inline-flex items-center gap-1 rounded-full bg-tint py-1.5 pl-3.5 pr-2.5 text-[13px] font-medium text-ink before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']"
            >
              {home.hero.pill}
              <ChevronRight size={14} aria-hidden />
            </a>

            <Title text={home.hero['H-1-A']} />

            <p className="mt-4 max-w-[38rem] text-lg leading-[1.5] text-muted md:text-xl">{home.hero['H-1-B']}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Button asChild size="lg">
                <a href={DEMO_URL}>
                  {home.hero['H-1-C']}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <a
                href={PRODUCTS_HREF}
                className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary-deep"
              >
                {home.hero['H-1-D']}
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="animate-rise relative mt-12 [animation-delay:120ms] md:mt-16">
          <div className="rounded-[28px] border border-rule bg-paper/70 p-3 shadow-card backdrop-blur-xl sm:p-5 lg:p-7">
            <div className="relative md:pr-[212px] lg:pr-[264px]">
              <div className="min-w-0">
                <WindowFrame title="Workspace">
                  <div className="h-[240px] sm:h-[340px] md:h-[360px] lg:h-[460px]">
                    <WorkspacePlaceholder />
                  </div>
                </WindowFrame>
              </div>
              <PhoneFrame className="mx-auto mt-4 w-[200px] md:absolute md:bottom-0 md:right-0 md:mt-0 md:w-[188px] lg:w-[232px]">
                <EngagePlaceholder />
              </PhoneFrame>
            </div>
            <p className="mt-4 text-center text-[13px] text-muted sm:mt-5">{home.hero.caption}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
