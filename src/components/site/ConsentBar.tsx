import { useLayoutEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { useConsent, type ConsentDecision } from '@/lib/consent'

/* Reject and Accept are one button with one set of classes: a refusal is
   exactly as easy to give as a yes. Each is a thumb's height, set in the
   question's size, with padding pared so the pair fits beside it. */
const CHOICE = 'h-auto min-h-11 px-3 text-label'

/* Asks once whether Google Analytics may run, across every tripcerto.com
   host. Not a modal: the page stays in use behind it. The build renders
   nothing here, having no visitor to ask, so the bar appears once the page
   has read the cookie. It sits under the phone menu's dimmed layer (z-40)
   and the nav (z-50), as the rest of the page does.

   One row at every width: the question, then the two answers beside it. A
   phone is asked in four words; from sm the full sentence has the room,
   except on a landscape phone, which has no height to spare. A phone's
   gutter is 16px, so at 320px the four words still take two lines. */
export function ConsentBar() {
  const { asking, decide } = useConsent()
  return asking ? <Bar decide={decide} /> : null
}

function Bar({ decide }: { decide: (analytics: ConsentDecision) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  /* The page grows by the bar's height while it shows, so the footer can be
     scrolled clear of it and a focused link is never scrolled under it. */
  useLayoutEffect(() => {
    const bar = ref.current
    if (!bar) return
    const body = document.body.style
    const root = document.documentElement.style
    const lift = () => {
      body.paddingBottom = `${bar.offsetHeight}px`
      root.scrollPaddingBottom = `${bar.offsetHeight}px`
    }
    lift()
    const observer = new ResizeObserver(lift)
    observer.observe(bar)
    return () => {
      observer.disconnect()
      body.removeProperty('padding-bottom')
      root.removeProperty('scroll-padding-bottom')
    }
  }, [])

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Analytics permission"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-page pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-16px_rgb(40_17_49/0.25)] dark:shadow-[0_-12px_32px_-12px_rgb(0_0_0/0.6)]"
    >
      <div className="shell flex items-center gap-3 max-sm:px-4">
        <p className="flex-1 text-small text-dim">
          <span className="sm:[@media(height>480px)]:hidden">Allow Google Analytics?</span>
          <span className="hidden sm:[@media(height>480px)]:inline">
            Can we measure how the site is used, with Google Analytics? Never advertising.
          </span>{' '}
          <a href="/legal/privacy" className="text-link underline underline-offset-4">
            Privacy
          </a>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <Button type="button" variant="outline" className={CHOICE} onClick={() => decide('denied')}>
            Reject
          </Button>
          <Button type="button" variant="outline" className={CHOICE} onClick={() => decide('granted')}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
