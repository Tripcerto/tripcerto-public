import { Fragment, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import type { CloseLink } from '@/components/site/Close'
import { delay } from '@/components/site/frames/motion'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/events'
import { DEMO_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

/* A page's opening on the band, in the home hero's idiom a step smaller:
   paper copy, the two ways in, and the page's frame beside it where it
   has one. Not viewport-tall; the page's own sections follow at once. */
export function PageHero({
  title,
  lede,
  primary,
  secondary,
  visual,
  layout = 'phone',
}: {
  /* A list sets the headline's lines; a string wraps where it falls. */
  title: string | readonly string[]
  lede: string
  primary: CloseLink
  secondary?: CloseLink
  visual?: ReactNode
  /* A phone stands in the narrower column; a window needs the wider one. */
  layout?: 'phone' | 'window'
}) {
  return (
    <section id="hero" data-band aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <Band />
      <div className="shell relative z-10 pb-16 pt-28 md:pb-24 md:pt-40">
        <div
          className={cn(
            'grid grid-cols-1 gap-14',
            visual && 'lg:items-center lg:gap-12',
            visual && (layout === 'window' ? 'lg:grid-cols-[5fr_7fr]' : 'lg:grid-cols-[6fr_5fr]'),
          )}
        >
          <div className="animate-rise min-w-0">
            <h1
              id="hero-title"
              className="max-w-[18ch] text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] text-paper sm:text-[3.5rem] lg:text-[3.75rem]"
            >
              {typeof title === 'string'
                ? title
                : title.map((line, i) => (
                    <Fragment key={line}>
                      {i > 0 && ' '}
                      {/* Each line stays whole on a narrow phone: the type
                          steps down with the viewport rather than wrapping. */}
                      <span className="block text-[length:min(1em,11.8vw)]">{line}</span>
                    </Fragment>
                  ))}
            </h1>
            <p className="mt-7 max-w-[34rem] text-lg leading-[1.55] text-paper/85 md:text-xl">{lede}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild size="lg" variant="accent">
                <a href={primary.href} onClick={primary.href === DEMO_URL ? () => trackEvent('demo_click', { button: 'hero' }) : undefined}>
                  {primary.label}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              {secondary && (
                <a href={secondary.href} className="inline-flex min-h-11 items-center gap-1 font-semibold text-paper">
                  {secondary.label}
                  <ArrowRight size={16} aria-hidden />
                </a>
              )}
            </div>
          </div>
          {visual && (
            <div className="animate-pop flex min-w-0 justify-center lg:justify-end" style={delay(0.15)}>
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
