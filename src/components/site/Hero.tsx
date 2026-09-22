import { lazy, Suspense, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WaveName } from '@/components/ui/floating-lines'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowFrame } from '@/components/site/frames/WindowFrame'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { WorkspacePlaceholder } from '@/components/site/frames/WorkspacePlaceholder'
import { home } from '@/content/home'
import { DEMO_URL, SECTION } from '@/lib/links'

const PRODUCTS_HREF = `#${SECTION.products}`

/* three.js is most of the bundle; the copy paints first and the waves follow. */
const FloatingLines = lazy(() =>
  import('@/components/ui/floating-lines').then((m) => ({ default: m.FloatingLines })),
)

/* The React Bits demo's line counts and bend, in our colours, on our own path:
   two straight bands with no swirl, both entering at the left edge and both
   flowing left to right, descending gently. The top band enters near the top
   and reaches the right edge a quarter of the way down; the bottom band
   enters at the upper middle and runs at 30 degrees through the bottom of
   the phone, leaving by the bottom edge. y is the band's height at the
   centre (positive is up), rotate its tilt in radians (negative descends to
   the right under mirror). Module-level so the shader is built once: the
   effect re-runs on any new reference. Counts map to WAVES in order. */
const WAVE_COLOURS = ['#B9243D', '#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']
const WAVES: WaveName[] = ['top', 'bottom']
const WAVE_LINES = [10, 15]
const TOP_WAVE = { x: 10, y: 0.55, rotate: -0.16 }
const BOTTOM_WAVE = { x: 2, y: -0.6, rotate: -0.52 }

function Waves() {
  return (
    <Suspense fallback={null}>
      <FloatingLines
        className="absolute inset-x-0 top-0 bottom-16 mask-b-from-85% md:bottom-28"
        lightMode
        mirror
        swirl={0}
        sameDirection
        linesGradient={WAVE_COLOURS}
        enabledWaves={WAVES}
        lineCount={WAVE_LINES}
        topWavePosition={TOP_WAVE}
        bottomWavePosition={BOTTOM_WAVE}
        lineDistance={17}
        bendRadius={5}
        bendStrength={-0.5}
        interactive
        parallax
        lineWidth={2}
        lineBlur={8}
        lineOpacity={0.85}
      />
    </Suspense>
  )
}

function Title({ text }: { text: string }) {
  return (
    <h1
      id="hero-title"
      className="text-gradient max-w-[12ch] text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]"
    >
      {text}
    </h1>
  )
}

export interface HeroProps {
  /* The full-bleed layer behind the copy; the waves unless a variant passes its own. */
  background?: ReactNode
}

export function Hero({ background = <Waves /> }: HeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-paper pb-16 pt-28 md:pb-28 md:pt-40"
    >
      {background}

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="animate-rise min-w-0 lg:col-span-6">
            <Title text={home.hero['H-1-A']} />

            <p className="mt-4 max-w-[36rem] text-lg leading-[1.5] text-muted md:text-xl">{home.hero['H-1-B']}</p>

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

          <div className="min-w-0 lg:col-span-6">
            <div className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-[600px]">
              <div className="absolute right-0 top-0 w-[84%] rotate-[4deg] sm:w-[88%] lg:-right-10 lg:w-[460px] xl:-right-20 xl:w-[540px]">
                <WindowFrame title="Workspace">
                  <div className="h-[340px] lg:h-[400px]">
                    <WorkspacePlaceholder />
                  </div>
                </WindowFrame>
              </div>
              <PhoneFrame className="absolute bottom-0 left-0 z-10 w-[42%] sm:w-[200px] lg:w-[250px]">
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
