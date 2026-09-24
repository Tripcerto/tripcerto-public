import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Band } from '@/components/site/Band'
import type { CloseLink } from '@/components/site/Close'
import { Lines, type Copy } from '@/components/site/Lines'
import { Reveal } from '@/components/site/Reveal'
import { HERO_PAD } from '@/components/site/Section'
import { Tag } from '@/components/site/Tag'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/events'
import { DEMO_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

/* A page's opening on the band, in the home hero's idiom a step smaller:
   paper copy, the two ways in, and the page's frame beside it where it
   has one. Not viewport-tall; the page's own sections follow at once. */
export function PageHero({
  tag,
  title,
  lede,
  primary,
  form,
  secondary,
  visual,
  layout = 'phone',
}: {
  /* A label in a pill above the title, as on the home hero. */
  tag?: string
  title: Copy
  lede: string
  /* The way in: a button, or a form in its place (the Pilot page's
     information pack), with the secondary link under the form. */
  primary?: CloseLink
  form?: ReactNode
  secondary?: CloseLink
  visual?: ReactNode
  /* A phone stands in the narrower column; a window needs the wider one. */
  layout?: 'phone' | 'window'
}) {
  return (
    <section id="hero" data-band aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <Band />
      <div className={cn('shell relative z-10', HERO_PAD)}>
        <div
          className={cn(
            'grid grid-cols-1 gap-14',
            visual && 'lg:items-center lg:gap-12',
            visual && (layout === 'window' ? 'lg:grid-cols-[5fr_7fr]' : 'lg:grid-cols-[6fr_5fr]'),
          )}
        >
          <div className="animate-rise min-w-0">
            {tag && <Tag className="mb-6">{tag}</Tag>}
            <h1
              id="hero-title"
              className="max-w-[18ch] text-display text-paper"
            >
              {/* Set lines stay whole on a narrow phone: the type steps
                  down with the viewport rather than wrapping. */}
              <Lines text={title} className="text-[length:min(1em,11.8vw)]" />
            </h1>
            <p className="mt-7 max-w-[34rem] text-lede text-paper/85">{lede}</p>
            {form && <div className="mt-9">{form}</div>}
            <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', form ? 'mt-4' : 'mt-9')}>
              {primary && (
                <Button asChild size="lg" variant="accent">
                  <a href={primary.href} onClick={primary.href === DEMO_URL ? () => trackEvent('demo_click', { button: 'hero' }) : undefined}>
                    {primary.label}
                    <ArrowRight aria-hidden />
                  </a>
                </Button>
              )}
              {secondary && (
                <a
                  href={secondary.href}
                  onClick={secondary.href === DEMO_URL ? () => trackEvent('demo_click', { button: 'hero' }) : undefined}
                  className="inline-flex min-h-11 items-center gap-1 text-action text-paper"
                >
                  {secondary.label}
                  <ArrowRight size={16} aria-hidden />
                </a>
              )}
            </div>
          </div>
          {visual && (
            <Reveal className="min-w-0">
              <div className="flex justify-center lg:justify-end">
                {visual}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
