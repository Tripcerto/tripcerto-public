import { lazy, Suspense } from 'react'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WaveName } from '@/components/ui/floating-lines'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const HOW_IT_WORKS_HREF = `#${SECTION.engage}`

const FloatingLines = lazy(() =>
  import('@/components/ui/floating-lines').then((m) => ({ default: m.FloatingLines })),
)

/* Ember on Stripe's home composition: the whole hero is the gradient band;
   the headline multiplied into it so it reads as ink soaked through the
   colour; a glass Workspace window running off the right edge with the
   phone in front of it. The band moves: three wave families in the shader's
   screen-blended glow mode sweep across it and brighten whatever they
   cross, over five soft lights drifting on their own clocks. Module-level
   so the shader builds once. */
const WAVE_COLOURS = ['#FFFFFF', '#F0DCD4', '#FF5C6C', '#E8437E']
const WAVES: WaveName[] = ['middle', 'bottom']
const WAVE_LINES = [6, 6]
const WAVE_DISTANCE = [10, 10]
/* Two families on Taylor's two drawn lines (22 Sep): one steep, entering
   at the bottom-left corner and rising at about 36 degrees through the
   headline; one shallow and lower, rising at about 21 degrees. */
const STEEP_WAVE = { x: 0, y: 0.35, rotate: -0.63 }
const SHALLOW_WAVE = { x: 2, y: -0.4, rotate: -0.37 }

/* Review scaffolding: `?tone=coral|rose|wine|mist` picks the band's gradient.
   Every stop is a palette colour; none of them is peach or the cream tint. */
const TONES = {
  coral: 'linear-gradient(105deg, #ff5c6c 0%, #ff5c6c 18%, #f0dcd4 62%, #ffffff 100%)',
  rose: 'linear-gradient(105deg, #e8437e 0%, #ff5c6c 30%, #f0dcd4 68%, #ffffff 100%)',
  wine: 'linear-gradient(105deg, #b9243d 0%, #e8437e 26%, #f0dcd4 70%, #ffffff 100%)',
  mist: 'linear-gradient(105deg, #ff5c6c 0%, #f0dcd4 34%, #ffffff 70%)',
} as const
type Tone = keyof typeof TONES
const TONE: Tone = ((key) => (key && key in TONES ? (key as Tone) : 'coral'))(
  new URLSearchParams(window.location.search).get('tone'),
)

function Band() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: TONES[TONE] }} />
      <div className="absolute -left-[20%] -top-[40%] h-[130%] w-[65%] bg-[radial-gradient(closest-side,rgba(232,67,126,0.55),transparent)] animate-[drift-a_26s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
      <div className="absolute -right-[10%] -top-[30%] h-[130%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.8),transparent)] animate-[drift-b_28s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
      <div className="absolute -bottom-[30%] left-[30%] h-[110%] w-[60%] bg-[radial-gradient(closest-side,rgba(255,92,108,0.5),transparent)] animate-[drift-c_32s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
      <div className="absolute -bottom-[25%] -left-[5%] h-[80%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.6),transparent)] animate-[drift-a_18s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none" />
      <div className="absolute -top-[20%] left-[35%] h-[60%] w-[35%] bg-[radial-gradient(closest-side,rgba(240,220,212,0.6),transparent)] animate-[drift-c_20s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none" />
      <Suspense fallback={null}>
        <FloatingLines
          className="absolute inset-0 opacity-55"
          mixBlendMode="screen"
          swirl={0}
          sameDirection
          linesGradient={WAVE_COLOURS}
          enabledWaves={WAVES}
          lineCount={WAVE_LINES}
          lineDistance={WAVE_DISTANCE}
          middleWavePosition={STEEP_WAVE}
          bottomWavePosition={SHALLOW_WAVE}
          glowSpread={0.003}
          glowHaze={0}
          bendRadius={6}
          bendStrength={-0.4}
          animationSpeed={0.6}
          interactive
          parallax
        />
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
      <div className="grid h-[420px] grid-cols-[34%_minmax(0,1fr)] lg:h-[480px]" aria-hidden>
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

export function HeroBand() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <Band />

      <div className="shell relative z-10 pb-16 pt-28 md:pt-36 lg:pb-32 lg:pt-44">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="animate-rise min-w-0 lg:col-span-6">
            <a
              href={PAGES.pilot}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/60 bg-white/30 pl-4 pr-3 text-[14px] font-medium text-ink backdrop-blur-md transition-colors hover:bg-white/50"
            >
              Pilot
              <span className="text-ink/40" aria-hidden>
                ·
              </span>
              How a pilot runs
              <ChevronRight size={14} aria-hidden />
            </a>

            <h1
              id="hero-title"
              className="text-inked mix-blend-multiply mt-10 max-w-[12ch] text-balance text-[3rem] font-bold leading-[0.98] tracking-[-0.035em] sm:text-[4rem] lg:text-[4.75rem] xl:text-[5rem]"
            >
              {home.hero['H-1-A']}
            </h1>

            <p className="mt-12 max-w-[34rem] text-lg leading-[1.55] text-ink/80 md:text-xl lg:mt-20">
              {home.hero['H-1-B']}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild size="lg">
                <a href={DEMO_URL}>
                  {home.hero['H-1-C']}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <a
                href={HOW_IT_WORKS_HREF}
                className="inline-flex min-h-11 items-center gap-1 font-semibold text-ink"
              >
                {home.hero['H-1-D']}
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <div className="relative h-[560px] sm:h-[640px] lg:h-[700px]">
              <div className="absolute left-[26%] top-0 w-[760px] max-w-none sm:w-[880px] lg:-top-10 lg:left-[22%]">
                <GlassWindow />
              </div>
              <PhoneFrame className="absolute left-0 top-20 z-10 w-[210px] sm:w-[240px] lg:top-24 lg:w-[264px]">
                <EngagePlaceholder />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
