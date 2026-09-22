import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, Moon, Sun, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/site/Wordmark'
import { LOGIN_URL, NAV_LINKS, PAGES } from '@/lib/links'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'
const NAV_HEIGHT = 72

export function Nav() {
  const [open, setOpen] = useState(false)
  /* The bar is glass over both the hero's band and the page. Over the band
     the copy is paper whatever the theme; on the page it takes the page's
     own colours, which flip with the theme in CSS. */
  const [overHero, setOverHero] = useState(false)
  const [theme, toggleTheme] = useTheme()
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
        'fixed inset-x-0 top-0 z-50 border-b bg-glass backdrop-blur-2xl backdrop-saturate-150',
        overHero ? 'border-white/40' : 'border-line',
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex items-center">
          <a href={PAGES.home} aria-label="tripcerto home" className="inline-flex h-11 items-center">
            <Wordmark tone={overHero ? 'paper' : 'page'} />
          </a>
          <nav className="ml-10 hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex h-11 items-center text-[15px] font-medium transition-colors',
                  overHero ? 'text-paper/80 hover:text-paper' : 'text-body/75 hover:text-body',
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeButton theme={theme} overHero={overHero} onClick={toggleTheme} />
          <a
            href={LOGIN_URL}
            className={cn(
              'inline-flex h-11 items-center gap-1 text-[15px] font-medium transition-colors',
              overHero ? 'text-paper/90 hover:text-paper' : 'text-body/85 hover:text-body',
            )}
          >
            Login
            <ChevronRight size={16} aria-hidden="true" />
          </a>
          <PilotButton overHero={overHero} />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeButton theme={theme} overHero={overHero} onClick={toggleTheme} />
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
        <nav id={MENU_ID} className={cn('border-t md:hidden', overHero ? 'border-white/25' : 'border-line')}>
          {[...NAV_LINKS, { href: PAGES.pilot, label: 'Pilot' }, { href: LOGIN_URL, label: 'Login' }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'shell flex h-14 items-center justify-between border-b text-[17px] font-medium transition-colors',
                overHero ? 'border-white/25 text-paper hover:bg-white/10' : 'border-line text-body hover:bg-soft',
              )}
            >
              {link.label}
              <ChevronRight size={16} aria-hidden="true" className={overHero ? 'text-paper/60' : 'text-body/40'} />
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/* The pilot is the way in, so it stands apart from the pages as a button
   beside Login: glass over the band, a glass pill on the page. */
function PilotButton({ overHero }: { overHero: boolean }) {
  return (
    <a
      href={PAGES.pilot}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-semibold transition-colors',
        overHero
          ? 'border-white/50 bg-white/15 text-paper backdrop-blur-md hover:bg-white/25'
          : 'border-line bg-card text-body hover:border-body/30',
      )}
    >
      Pilot
    </a>
  )
}

function ThemeButton({ theme, overHero, onClick }: { theme: 'light' | 'dark'; overHero: boolean; onClick: () => void }) {
  const dark = theme === 'dark'
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-11 [&_svg]:size-5', overHero && 'text-paper hover:bg-white/10')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      onClick={onClick}
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  )
}
