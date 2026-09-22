import { lazy, Suspense } from 'react'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const GradientMesh = lazy(() =>
  import('@/components/ui/gradient-mesh').then((m) => ({ default: m.GradientMesh })),
)

const HOW_IT_WORKS_HREF = `#${SECTION.engage}`

/* The Ember strip from the identity pack, pink through coral into peach,
   rendered by a shader that warps the gradient with slow noise so the colour
   itself rolls and folds. The still CSS strip underneath is the no-WebGL
   case. The phone laps onto Stella's pane of the glass Workspace window,
   whose body is 16:9. The container runs wider than the nav's shell on large
   screens, so the window grows and the copy and visuals spread apart, and
   everything tightens toward the middle as the screen narrows. */
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

const ROWS = [
  { a: 70, b: 45, gap: false },
  { a: 55, b: 60, gap: false },
  { a: 80, b: 40, gap: true },
  { a: 60, b: 55, gap: false },
  { a: 45, b: 65, gap: true },
  { a: 75, b: 50, gap: false },
  { a: 65, b: 40, gap: false },
] as const

/* Workspace as glass: the chrome and Stella's pane let the band through;
   the itemised list sits on near-solid paper so the rows stay legible. */
function GlassWindow() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/25 shadow-frame backdrop-blur-2xl backdrop-saturate-150">
      <div className="flex h-12 items-center gap-2 border-b border-white/50 px-5">
        <span className="size-2.5 rounded-full bg-ink/20" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink/20" aria-hidden />
        <span className="size-2.5 rounded-full bg-ink/20" aria-hidden />
        <span className="ml-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink/70">Workspace</span>
        <span className="ml-auto flex h-7 w-48 items-center gap-2 rounded-md border border-white/70 bg-white/50 px-2 text-[12px] text-ink/60">
          <Search size={13} aria-hidden />
          Search
        </span>
      </div>
      <div className="grid aspect-[16/9] grid-cols-[34%_minmax(0,1fr)]" aria-hidden>
        <div className="flex flex-col gap-3 border-r border-white/50 bg-white/20 p-5">
          <span className="h-2.5 w-20 rounded bg-ink/25" />
          <span className="h-16 rounded-xl bg-white/50" />
          <span className="h-2 w-[90%] rounded bg-ink/15" />
          <span className="h-2 w-[70%] rounded bg-ink/15" />
          <span className="h-2 w-[80%] rounded bg-ink/15" />
          <span className="mt-auto h-9 rounded-full border border-ink/15 bg-white/40" />
        </div>
        <div className="flex min-w-0 flex-col gap-2 bg-paper/90 p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="h-2.5 w-28 rounded bg-ink/15" />
            <span className="h-5 w-16 rounded-full bg-ink/[0.07]" />
          </div>
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="grid h-9 min-w-0 grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_56px] items-center gap-2 rounded-lg border border-ink/[0.07] px-3"
            >
              <span className="h-2 w-10 rounded bg-ink/15" />
              <span className="h-2 rounded bg-ink/10" style={{ width: `${r.a}%` }} />
              <span className="h-2 rounded bg-ink/10" style={{ width: `${r.b}%` }} />
              <span className={`h-4 w-full rounded-full ${r.gap ? 'bg-primary/25' : 'bg-ink/[0.07]'}`} />
            </div>
          ))}
        </div>
      </div>
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
              className="mt-10 max-w-[12ch] text-balance text-[3rem] font-bold leading-[0.98] tracking-[-0.035em] text-paper sm:text-[4rem] lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5rem]"
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
            <div className="relative mx-auto min-h-[520px] max-w-[560px] sm:min-h-[560px] lg:min-h-[590px] lg:max-w-none xl:min-h-[650px]">
              <div className="ml-[14%] xl:ml-[12%]">
                <GlassWindow />
              </div>
              <PhoneFrame className="absolute left-0 top-12 z-10 aspect-[9/18] w-[190px] shadow-[0_2px_4px_rgb(43_18_32/0.08),0_24px_48px_-12px_rgb(43_18_32/0.45),0_60px_120px_-30px_rgb(43_18_32/0.5)] sm:w-[230px] lg:w-[244px] xl:w-[270px]">
                <EngagePlaceholder />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
