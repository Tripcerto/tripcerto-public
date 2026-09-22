import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/site/Wordmark'
import { LOGIN_URL, NAV_LINKS, PAGES } from '@/lib/links'
import { cn } from '@/lib/utils'

const MENU_ID = 'site-menu'

export function Nav() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/30 backdrop-blur-2xl backdrop-saturate-150',
        open && 'bg-paper',
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex items-center">
          <a href={PAGES.home} aria-label="tripcerto home" className="inline-flex h-11 items-center">
            <Wordmark />
          </a>
          <nav className="ml-10 hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex h-11 items-center text-[15px] font-medium text-ink/75 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center md:flex">
          <a
            href={LOGIN_URL}
            className="inline-flex h-11 items-center gap-1 text-[15px] font-medium text-ink/85 transition-colors hover:text-ink"
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
            className="size-11 [&_svg]:size-5"
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
        <nav id={MENU_ID} className="flex flex-col gap-1 border-b border-rule bg-paper p-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center rounded-md px-3 text-[17px] font-medium text-ink transition-colors hover:bg-tint"
            >
              {link.label}
            </a>
          ))}
          <a
            href={LOGIN_URL}
            onClick={() => setOpen(false)}
            className="flex h-12 items-center gap-1 rounded-md px-3 text-[17px] font-medium text-ink transition-colors hover:bg-tint"
          >
            Login
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  )
}
