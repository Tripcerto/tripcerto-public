import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

/* A voice note: a play button and a waveform. The wave is a fixed
   pattern, so it draws the same every time. It sits in the traveller's
   or the consultant's bubble, so its tones are that bubble's. */

const WAVE = [2, 4, 7, 5, 9, 6, 3, 8, 6, 4, 9, 7, 3, 6, 4, 2] as const

const VOICE = {
  window: { root: 'gap-[1.2cqw]', play: 'size-[3.2cqw]', icon: 'size-[1.3cqw]', wave: 'gap-[0.45cqw]', bar: 'w-[0.5cqw]', unit: 0.32 },
  phone: { root: 'gap-[2.4cqw]', play: 'size-[6.4cqw]', icon: 'size-[2.6cqw]', wave: 'gap-[0.8cqw]', bar: 'w-[0.9cqw]', unit: 0.5 },
} as const

export function VoiceNote({ scale }: { scale: keyof typeof VOICE }) {
  const t = VOICE[scale]
  return (
    <span className={cn('flex items-center', t.root)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-paper/20 text-paper dark:bg-ink/15 dark:text-ink',
          t.play,
        )}
      >
        <Play className={cn('translate-x-[8%] fill-current', t.icon)} />
      </span>
      <span className={cn('flex items-center', t.wave)}>
        {WAVE.map((h, i) => (
          <span key={i} className={cn('rounded-full bg-paper/70 dark:bg-ink/50', t.bar)} style={{ height: `${h * t.unit}cqw` }} />
        ))}
      </span>
    </span>
  )
}
