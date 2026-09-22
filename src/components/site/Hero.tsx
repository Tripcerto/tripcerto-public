import { lazy, Suspense } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroVisuals } from '@/components/site/frames/HeroVisuals'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { WorkspaceScreen } from '@/components/site/frames/WorkspaceScreen'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const GradientMesh = lazy(() =>
  import('@/components/ui/gradient-mesh').then((m) => ({ default: m.GradientMesh })),
)

const HOW_IT_WORKS_HREF = `#${SECTION.engage}`

/* The Ember strip from the identity pack, pink through coral into peach,
   rendered by a shader that warps the gradient with slow noise so the colour
   itself rolls and folds. The still CSS strip underneath is the no-WebGL
   case. The container runs wider than the nav's shell on large screens, so
   the frames grow and the copy and visuals spread apart, and everything
   tightens toward the middle as the screen narrows. */
const BAND = 'linear-gradient(100deg, #e8437e 0%, #ff5c6c 50%, #ff9b7a 100%)'
/* Module-level so the shader builds once. */
const MESH_COLOURS = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

function Band() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: BAND }} />
      <Suspense fallback={null}>
        <GradientMesh className="absolute inset-0" colours={MESH_COLOURS} angle={100} warp={0.3} scale={1.3} speed={1} />
      </Suspense>
    </div>
  )
}

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper">
      <Band />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-5 pb-16 pt-28 sm:px-8 md:pt-32 lg:pb-20 lg:pt-[calc(72px+5rem)] xl:max-w-[1480px] 2xl:max-w-[1680px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
          <div className="animate-rise min-w-0 lg:col-span-5">
            <a
              href={PAGES.pilot}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/50 bg-white/15 pl-4 pr-3 text-[14px] font-medium text-paper backdrop-blur-md transition-colors hover:bg-white/25"
            >
              Pilot
              <span className="text-paper/50" aria-hidden>
                ·
              </span>
              How a pilot runs
              <ChevronRight size={14} aria-hidden />
            </a>

            <h1
              id="hero-title"
              className="mt-10 max-w-[15ch] text-[3rem] font-bold leading-[0.98] tracking-[-0.035em] text-paper sm:text-[4rem] lg:text-[3.75rem] xl:text-[4rem] 2xl:text-[5rem]"
            >
              {home.hero['H-1-A']}
            </h1>

            <p className="mt-12 max-w-[34rem] text-lg leading-[1.55] text-paper/85 md:text-xl">{home.hero['H-1-B']}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild size="lg" variant="accent">
                <a href={DEMO_URL}>
                  {home.hero['H-1-C']}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <a href={HOW_IT_WORKS_HREF} className="inline-flex min-h-11 items-center gap-1 font-semibold text-paper">
                {home.hero['H-1-D']}
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <HeroVisuals window={<WorkspaceScreen />} phone={<PhoneScreen />} />
          </div>
        </div>
      </div>
    </section>
  )
}
