import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/site/Wordmark'
import { LOGIN_URL, NAV_LINKS, PAGES } from '@/lib/links'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'

interface NavProps {
  /* The path of the page the bar is on, named by the page: the build renders
     the bar with no address to read. */
  current?: string
  /* Whether the page opens on the band, as every page but the legal ones
     does. */
  opensOnBand?: boolean
}

export function Nav({ current, opensOnBand = true }: NavProps) {
  const isCurrent = (href: string) => href === current
  const [open, setOpen] = useState(false)
  /* The bar is glass over the band and over the page. Over a band section
     (the hero and the close carry `data-band`) the copy is paper whatever
     the theme; on the page it takes the page's own colours, which flip
     with the theme in CSS. It starts as the top of its page stands, which
     is what the built page shows until the script has measured it. */
  const [overBand, setOverBand] = useState(opensOnBand)
  const [theme, toggleTheme] = useTheme()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  /* Over a band means a band section is under the bar's midline: measured
     against the bar on every scroll, not "somewhere in the viewport", which
     is what an intersection observer answers. Switching at the midline
     keeps the flip to the moment the seam passes the copy. The midline is
     placed on the page and held inside it, because pulling the page past
     its top (Safari reports a negative scroll, and moves the bar with the
     page) is not scrolling off the hero: measured from the window, the band
     slid below the midline and the nav turned ink over it. The midline is
     the bar row's, not the header's, which grows with the open menu. Before
     paint, so the first frame has the right tone. */
  useLayoutEffect(() => {
    const bands = Array.from(document.querySelectorAll<HTMLElement>('[data-band]'))
    const bar = barRef.current
    if (!bands.length || !bar) return
    let frame = 0
    const measure = () => {
      frame = 0
      const page = document.documentElement.getBoundingClientRect()
      const mid = Math.min(Math.max(bar.offsetHeight / 2 - page.top, 0), page.height)
      setOverBand(
        bands.some((band) => {
          const rect = band.getBoundingClientRect()
          return rect.top - page.top <= mid && rect.bottom - page.top >= mid
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

  /* A page the back-forward cache restores comes back as it was left, so a
     menu open when a link inside it was followed would still be open. */
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setOpen(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

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
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b bg-glass backdrop-blur-2xl backdrop-saturate-150 transition-shadow duration-300 ease-site',
          overBand ? 'border-white/40' : 'border-line',
          open && 'shadow-[0_28px_48px_-20px_rgb(40_17_49/0.45)] dark:shadow-[0_28px_48px_-16px_rgb(0_0_0/0.7)]',
        )}
      >
        <div ref={barRef} className="shell flex h-16 items-center justify-between md:h-[72px]">
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
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => setOpen((value) => !value)}
            >
              <MenuIcon open={open} />
            </Button>
          </div>
        </div>

        {/* The menu stays mounted so it can open and close on the site's curve:
            its row grows from nothing while the links slide down into place.
            Closed, it is inert, so nothing in it can be focused or clicked. */}
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-site motion-reduce:transition-none md:hidden',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <nav id={MENU_ID} inert={!open} className="min-h-0 overflow-hidden">
            <div
              className={cn(
                'border-t transition-[opacity,translate] duration-300 ease-site motion-reduce:transition-none',
                overBand ? 'border-white/25' : 'border-line',
                open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
              )}
            >
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
            </div>
          </nav>
        </div>
      </header>

      {/* Under the open menu the page dims, so the panel reads as a layer
          above it; a tap on the page closes the menu. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-ink/25 transition-opacity duration-300 ease-site motion-reduce:transition-none md:hidden dark:bg-black/45',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
    </>
  )
}

/* Three lines that fold into an X: the outer two meet at the centre and
   turn, the middle one fades. Drawn at Lucide's proportions so it sits with
   the theme icon beside it. */
function MenuIcon({ open }: { open: boolean }) {
  const line = 'absolute inset-x-[3.33px] h-[1.67px] rounded-full bg-current transition-[translate,rotate,opacity] duration-300 ease-site motion-reduce:transition-none'
  return (
    <span aria-hidden="true" className="relative block size-5">
      <span className={cn(line, 'top-[4.17px]', open && 'translate-y-[5px] rotate-45')} />
      <span className={cn(line, 'top-[9.17px]', open && 'opacity-0')} />
      <span className={cn(line, 'top-[14.17px]', open && '-translate-y-[5px] -rotate-45')} />
    </span>
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
      onClick={onClick}
    >
      <ThemeIcon />
    </Button>
  )
}

/* The moon and the sun share one square and trade places on the site's
   curve: the one leaving turns a quarter and shrinks away as the other
   turns in, the same speed as the menu icon beside it. The dark variant
   picks the one showing from the class the pre-paint script sets, so a dark
   page shows the sun from its first frame, before any script has run. */
function ThemeIcon() {
  const glyph = 'absolute inset-0 transition-[opacity,rotate,scale] duration-300 ease-site motion-reduce:transition-none'
  return (
    <span aria-hidden="true" className="relative block size-5">
      <Moon className={cn(glyph, 'rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0')} />
      <Sun className={cn(glyph, 'rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100')} />
    </span>
  )
}
