import { lazy, Suspense, useSyncExternalStore } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { WindowFrame } from '@/components/site/frames/WindowFrame'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { WorkspacePlaceholder } from '@/components/site/frames/WorkspacePlaceholder'
import { home } from '@/content/home'
import { DEMO_URL, SECTION } from '@/lib/links'

const PRODUCTS_HREF = `#${SECTION.products}`

/* ogl and the shader leave the main bundle; the copy paints first. */
const Particles = lazy(() => import('@/components/ui/particles').then((m) => ({ default: m.Particles })))

/* The band's two outer stops with primary and accent between. Module-level so
   the geometry is built once: the effect re-runs on any new reference. */
const EMBER_PARTICLES = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

/* Below Tailwind's md breakpoint the cloud is half as dense and ignores the
   pointer: a touch screen has no hover, and half the particles are enough
   for a 390px hero. */
const MOBILE_QUERY = '(max-width: 767px)'

function subscribeMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function isMobileNow() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, isMobileNow, () => false)
}

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

export function HeroParticles() {
  const isMobile = useIsMobile()

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-paper pb-16 pt-28 md:pb-28 md:pt-40"
    >
      <Suspense fallback={null}>
        <Particles
          className="absolute inset-0 mask-b-from-80%"
          particleColors={EMBER_PARTICLES}
          particleCount={isMobile ? 110 : 220}
          particleSpread={10}
          speed={0.08}
          moveParticlesOnHover={!isMobile}
          particleHoverFactor={0.5}
          alphaParticles
          particleBaseSize={isMobile ? 80 : 110}
          sizeRandomness={1}
          cameraDistance={20}
        />
      </Suspense>

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="animate-rise min-w-0 lg:col-span-6">
            <a
              href={PRODUCTS_HREF}
              className="relative inline-flex items-center gap-1 rounded-full bg-tint py-1.5 pl-3.5 pr-2.5 text-[13px] font-medium text-ink before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']"
            >
              {home.hero.pill}
              <ChevronRight size={14} aria-hidden />
            </a>

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
