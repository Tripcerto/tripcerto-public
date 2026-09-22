import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, Moon, Sun, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/site/Wordmark'
import { LOGIN_URL, NAV_LINKS, PAGES } from '@/lib/links'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'

/* The page the bar is on, by path; the clean URL and the dev server's
   trailing slash both count. */
function isCurrent(href: string) {
  return window.location.pathname.replace(/\/+$/, '') === href
}

export function Nav() {
  const [open, setOpen] = useState(false)
  /* The bar is glass over the band and over the page. Over a band section
     (the hero and the close carry `data-band`) the copy is paper whatever
     the theme; on the page it takes the page's own colours, which flip
     with the theme in CSS. */
  const [overBand, setOverBand] = useState(false)
  const [theme, toggleTheme] = useTheme()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const barRef = useRef<HTMLElement>(null)

  /* Over a band means a band section is under the bar's midline: measured
     against the bar on every scroll, not "somewhere in the viewport", which
     is what an intersection observer answers. Switching at the midline
     keeps the flip to the moment the seam passes the copy. */
  useEffect(() => {
    const bands = Array.from(document.querySelectorAll<HTMLElement>('[data-band]'))
    const bar = barRef.current
    if (!bands.length || !bar) return
    let frame = 0
    const measure = () => {
      frame = 0
      const mid = bar.offsetHeight / 2
      setOverBand(
        bands.some((band) => {
          const rect = band.getBoundingClientRect()
          return rect.top <= mid && rect.bottom >= mid
        }),
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
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
      ref={barRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b bg-glass backdrop-blur-2xl backdrop-saturate-150',
        overBand ? 'border-white/40' : 'border-line',
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex items-center">
          <a href={PAGES.home} aria-label="tripcerto home" className="inline-flex h-11 items-center">
            <Wordmark tone={overBand ? 'paper' : 'page'} />
          </a>
          <nav className="ml-10 hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const current = isCurrent(link.href)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-11 items-center text-[15px] font-medium transition-colors',
                    overBand
                      ? current
                        ? 'text-paper'
                        : 'text-paper/80 hover:text-paper'
                      : current
                        ? 'text-body'
                        : 'text-body/75 hover:text-body',
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeButton theme={theme} overBand={overBand} onClick={toggleTheme} />
          <a
            href={LOGIN_URL}
            className={cn(
              'inline-flex h-11 items-center gap-1 text-[15px] font-medium transition-colors',
              overBand ? 'text-paper/90 hover:text-paper' : 'text-body/85 hover:text-body',
            )}
          >
            Login
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeButton theme={theme} overBand={overBand} onClick={toggleTheme} />
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className={cn('size-11 [&_svg]:size-5', overBand && 'text-paper hover:bg-white/10')}
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
        <nav id={MENU_ID} className={cn('border-t md:hidden', overBand ? 'border-white/25' : 'border-line')}>
          {[...NAV_LINKS, { href: LOGIN_URL, label: 'Login' }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'shell flex h-14 items-center justify-between border-b text-[17px] font-medium transition-colors',
                overBand ? 'border-white/25 text-paper hover:bg-white/10' : 'border-line text-body hover:bg-soft',
              )}
            >
              {link.label}
              <ChevronRight size={16} aria-hidden="true" className={overBand ? 'text-paper/60' : 'text-body/40'} />
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function ThemeButton({ theme, overBand, onClick }: { theme: 'light' | 'dark'; overBand: boolean; onClick: () => void }) {
  const dark = theme === 'dark'
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-11 [&_svg]:size-5', overBand && 'text-paper hover:bg-white/10')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      onClick={onClick}
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  )
}
