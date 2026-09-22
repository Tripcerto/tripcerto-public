import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EngagePlaceholder } from '@/components/site/frames/EngagePlaceholder'
import { PhoneFrame } from '@/components/site/frames/PhoneFrame'
import { home } from '@/content/home'
import { DEMO_URL, PAGES, SECTION } from '@/lib/links'

const HOW_IT_WORKS_HREF = `#${SECTION.engage}`


/* The band hero on a calm ground: the Ember strip from the identity pack,
   pink through coral into peach, with two broad diagonal sheens crossing
   bottom-left to top-right on their own slow clocks. No lines. The
   headline is solid ink; the phone overlaps Stella's pane
   of the glass Workspace window and the pair sits centred in its column,
   level with the copy. */
const BAND = 'linear-gradient(100deg, #e8437e 0%, #ff5c6c 50%, #ff9b7a 100%)'
const SHEEN = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)'

function Band() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: BAND }} />
      <div
        className="absolute -left-[30%] top-[-60%] h-[220%] w-[28%] -rotate-[35deg] animate-[drift-a_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
        style={{ background: SHEEN }}
      />
      <div
        className="absolute left-[25%] top-[-60%] h-[220%] w-[18%] -rotate-[35deg] animate-[drift-c_36s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none"
        style={{ background: SHEEN, opacity: 0.6 }}
      />
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

export function HeroGlass() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <Band />

      <div className="shell relative z-10 pb-16 pt-28 md:pt-32 lg:pb-24 lg:pt-[calc(72px+6rem)]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-8">
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
              className="mt-6 max-w-[12ch] text-ink text-balance text-[3rem] font-bold leading-[0.98] tracking-[-0.035em] sm:text-[4rem] lg:text-[4.75rem] xl:text-[5rem]"
            >
              {home.hero['H-1-A']}
            </h1>

            <p className="mt-8 max-w-[34rem] text-lg leading-[1.55] text-ink/80 md:text-xl">
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
            <div className="relative mx-auto h-[540px] max-w-[560px] sm:h-[600px] lg:h-[620px] lg:max-w-none">
              <div className="absolute left-[10%] top-0 w-[130%] sm:w-[720px] lg:left-[6%] lg:w-[760px]">
                <GlassWindow />
              </div>
              <PhoneFrame className="absolute left-[4%] top-[12%] z-10 w-[190px] shadow-[0_2px_4px_rgb(43_18_32/0.08),0_24px_48px_-12px_rgb(43_18_32/0.45),0_60px_120px_-30px_rgb(43_18_32/0.5)] sm:w-[230px] lg:left-[9%] lg:w-[250px]">
                <EngagePlaceholder />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
