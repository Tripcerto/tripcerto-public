import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { SURFACE, TYPE, type Surface } from '@/components/site/frames/type'
import { cn } from '@/lib/utils'

const SHAPE = {
  screen: 'aspect-[4/3]',
  content: '',
} as const

/* A browser window with the app's name in the bar, painted with the
   surface it stands on. Its body is a 4:3 screen, or as tall as its content
   for a window showing one part of the app. The body is a size container,
   so what is drawn inside sizes itself in cqw and scales with the window;
   the bar sizes in cqw with it, so its title is set in the frames' one
   header size. Drawing only, like the phone frame, so none of it is read
   out. */
export function WindowShell({
  children,
  title,
  surface,
  shape,
}: {
  children: ReactNode
  title: string
  surface: Surface
  shape: keyof typeof SHAPE
}) {
  const T = TYPE.window
  return (
    <div
      aria-hidden
      className={cn(
        '@container cursor-default select-none overflow-hidden rounded-2xl border border-white/80 text-ink shadow-frame dark:border-ink/85 dark:text-paper',
        SURFACE[surface],
      )}
    >
      <div className="flex h-[5.6cqw] items-center gap-[0.9cqw] border-b border-ink/[0.06] px-[2.2cqw] dark:border-white/10">
        <span className="size-[1.3cqw] rounded-full bg-ink/20 dark:bg-white/25" />
        <span className="size-[1.3cqw] rounded-full bg-ink/20 dark:bg-white/25" />
        <span className="size-[1.3cqw] rounded-full bg-ink/20 dark:bg-white/25" />
        <span className={cn('ml-[1.4cqw] font-semibold', T.text)}>{title}</span>
        <span
          className={cn(
            'ml-auto flex h-[3.6cqw] w-[22cqw] items-center gap-[0.8cqw] rounded-[0.9cqw] border border-white/70 bg-white/60 px-[1.1cqw] text-ink/55 dark:border-white/15 dark:bg-white/10 dark:text-paper/60',
            T.detail,
          )}
        >
          <Search className="size-[1.8cqw]" />
          Search
        </span>
      </div>
      <div className={cn('@container', SHAPE[shape])}>{children}</div>
    </div>
  )
}
