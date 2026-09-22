import { cn } from '@/lib/utils'

type Tone = 'ink' | 'paper'

/* The pack's wordmark is artwork, not type; it is only ever placed as an image. */
export function Wordmark({ tone = 'ink', className }: { tone?: Tone; className?: string }) {
  return (
    <img
      src={tone === 'paper' ? '/brand/wordmark-white.svg' : '/brand/wordmark.svg'}
      alt="tripcerto"
      width={990}
      height={243}
      decoding="async"
      className={cn('block h-6 w-auto', className)}
    />
  )
}
