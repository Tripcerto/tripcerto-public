import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/site/Wordmark'
import { LOGIN_URL, NAV_LINKS, PAGES } from '@/lib/links'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'
const NAV_HEIGHT = 72

export function Nav() {
  const [open, setOpen] = useState(false)
  /* The bar is glass over both the hero's band and the paper sections, so the
     copy carries the contrast: paper while the hero is still under the bar,
     ink once it has scrolled past. */
  const [overHero, setOverHero] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  /* The panel only renders below md; if the viewport crosses that line
     while it is open, the state closes with it. */
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onChange = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b bg-white/30 backdrop-blur-2xl backdrop-saturate-150',
        overHero ? 'border-white/40' : 'border-ink/[0.08]',
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex items-center">
          <a href={PAGES.home} aria-label="tripcerto home" className="inline-flex h-11 items-center">
            <Wordmark tone={overHero ? 'paper' : undefined} />
          </a>
          <nav className="ml-10 hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex h-11 items-center text-[15px] font-medium transition-colors',
                  overHero ? 'text-paper/80 hover:text-paper' : 'text-ink/75 hover:text-ink',
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center md:flex">
          <a
            href={LOGIN_URL}
            className={cn(
              'inline-flex h-11 items-center gap-1 text-[15px] font-medium transition-colors',
              overHero ? 'text-paper/90 hover:text-paper' : 'text-ink/85 hover:text-ink',
            )}
          >
            Login
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="flex items-center md:hidden">
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className={cn('size-11 [&_svg]:size-5', overHero && 'text-paper hover:bg-white/10')}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav id={MENU_ID} className={cn('border-t md:hidden', overHero ? 'border-white/25' : 'border-ink/[0.08]')}>
          {[...NAV_LINKS, { href: LOGIN_URL, label: 'Login' }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'shell flex h-14 items-center justify-between border-b text-[17px] font-medium transition-colors',
                overHero
                  ? 'border-white/25 text-paper hover:bg-white/10'
                  : 'border-ink/[0.08] text-ink hover:bg-white/40',
              )}
            >
              {link.label}
              <ChevronRight size={16} aria-hidden="true" className={overHero ? 'text-paper/60' : 'text-ink/40'} />
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
