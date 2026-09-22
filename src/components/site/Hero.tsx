import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowFrame } from '@/components/site/frames/WindowFrame'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { WorkspacePlaceholder } from '@/components/site/frames/WorkspacePlaceholder'
import { home } from '@/content/home'
import { DEMO_URL, SECTION } from '@/lib/links'

const BAND = 'linear-gradient(115deg, #FFE1DA 0%, #FFD5CB 45%, #FFE7D6 100%)'
const PRODUCTS_HREF = `#${SECTION.products}`

function Title({ text }: { text: string }) {
  return (
    <h1
      id="hero-title"
      className="text-gradient mt-6 max-w-[12ch] text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]"
    >
      {text}
    </h1>
  )
}

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-paper pb-16 pt-28 md:pb-24 md:pt-36"
    >
      <div
        aria-hidden
        className="absolute left-[-12%] top-[-25%] h-[92%] w-[124%] origin-top-left -skew-y-6 overflow-hidden"
        style={{ background: BAND }}
      >
        <BackgroundPaths />
      </div>

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="animate-rise lg:col-span-7">
            <a
              href={PRODUCTS_HREF}
              className="relative inline-flex items-center gap-1 rounded-full bg-paper/70 py-1.5 pl-3.5 pr-2.5 text-[13px] font-medium text-ink before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']"
            >
              {home.hero.pill}
              <ChevronRight size={14} aria-hidden />
            </a>

            <Title text={home.hero['H-1-A']} />

            <p className="mt-6 max-w-[36rem] text-lg leading-[1.5] text-muted md:text-xl">{home.hero['H-1-B']}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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

          <div className="mt-10 lg:col-span-5 lg:mt-0">
            <div className="relative min-h-[400px] lg:min-h-[560px]">
              <div className="absolute right-0 top-8 w-[82%] sm:w-[92%] lg:-right-16 lg:w-[440px] xl:-right-24 xl:w-[560px]">
                <WindowFrame title="Workspace">
                  <div className="h-[340px] lg:h-[400px]">
                    <WorkspacePlaceholder />
                  </div>
                </WindowFrame>
              </div>
              <PhoneFrame className="absolute left-0 top-0 z-10 w-[44%] sm:w-[210px] lg:-left-6 lg:w-[260px]">
                <EngagePlaceholder />
              </PhoneFrame>
            </div>
            <p className="mt-6 hidden text-[13px] text-muted lg:block">{home.hero.caption}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
