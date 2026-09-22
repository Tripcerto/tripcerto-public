/* Quiet schematic of an Engage conversation on a partner's site: header, a few turns, the composer.
   Shapes only. Replaced by a real capture or an HTML reconstruction later. */
export function EngagePlaceholder() {
  return (
    <div className="flex h-full flex-col bg-paper pt-9" aria-hidden>
      <div className="flex items-center gap-2 border-b border-ink/10 px-4 pb-3">
        <span className="size-6 rounded-full bg-ink/10" />
        <span className="h-2.5 w-24 rounded bg-ink/15" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <Bubble side="left" w="w-[78%]" lines={2} />
        <Bubble side="right" w="w-[64%]" lines={1} />
        <Bubble side="left" w="w-[86%]" lines={3} />
        <div className="ml-1 mt-1 flex gap-2">
          <span className="h-14 w-[46%] rounded-lg bg-tint" />
          <span className="h-14 w-[46%] rounded-lg bg-tint" />
        </div>
        <Bubble side="right" w="w-[52%]" lines={1} />
      </div>
      <div className="mx-4 mb-4 flex h-11 items-center gap-2 rounded-full border border-ink/10 px-3">
        <span className="h-2 flex-1 rounded bg-ink/10" />
        <span className="size-7 rounded-full bg-primary" />
      </div>
    </div>
  )
}

function Bubble({ side, w, lines }: { side: 'left' | 'right'; w: string; lines: number }) {
  const tone = side === 'left' ? 'bg-tint' : 'bg-ink/[0.07]'
  return (
    <div className={`${w} ${side === 'right' ? 'self-end' : ''} rounded-2xl ${tone} px-3 py-2.5`}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="mb-1.5 block h-2 rounded bg-ink/15 last:mb-0"
          style={{ width: `${100 - (i % 2) * 28 - (i === lines - 1 ? 35 : 0)}%` }}
        />
      ))}
    </div>
  )
}
