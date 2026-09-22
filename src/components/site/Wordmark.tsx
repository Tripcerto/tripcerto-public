import { cn } from '@/lib/utils'

/* ink and paper are fixed; page follows the page's colours, ink by day and
   paper in dark mode, decided by the same CSS as every other colour. */
type Tone = 'ink' | 'paper' | 'page'

const INK = '/brand/wordmark.svg'
const PAPER = '/brand/wordmark-white.svg'

/* The pack's wordmark is artwork, not type; it is only ever placed as an image. */
export function Wordmark({ tone = 'ink', className }: { tone?: Tone; className?: string }) {
  if (tone === 'page') {
    return (
      <>
        <Mark src={INK} className={cn('dark:hidden', className)} />
        <Mark src={PAPER} className={cn('hidden dark:block', className)} />
      </>
    )
  }
  return <Mark src={tone === 'paper' ? PAPER : INK} className={className} />
}

function Mark({ src, className }: { src: string; className?: string }) {
  return (
    <img src={src} alt="tripcerto" width={990} height={243} decoding="async" className={cn('block h-7 w-auto', className)} />
  )
}
