/* Quiet schematic of Workspace: Stella's pane on the left, the itemised service list on the right,
   with two rows flagged. Shapes only. Replaced by a real capture or an HTML reconstruction later. */
export function WorkspacePlaceholder() {
  return (
    <div className="grid h-full min-w-0 grid-cols-[38%_minmax(0,1fr)] overflow-hidden bg-paper" aria-hidden>
      <div className="flex flex-col gap-3 border-r border-ink/10 p-4">
        <span className="h-2.5 w-20 rounded bg-ink/15" />
        <span className="h-16 rounded-xl bg-tint" />
        <span className="h-2 w-[90%] rounded bg-ink/10" />
        <span className="h-2 w-[70%] rounded bg-ink/10" />
        <span className="h-2 w-[80%] rounded bg-ink/10" />
        <span className="mt-auto h-9 rounded-full border border-ink/10" />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="h-2.5 w-28 rounded bg-ink/15" />
          <span className="h-5 w-16 rounded-full bg-ink/[0.07]" />
        </div>
        {ROWS.map((r, i) => (
          <div key={i} className="grid h-9 min-w-0 grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_56px] items-center gap-2 rounded-lg border border-ink/[0.07] px-3">
            <span className="h-2 w-10 rounded bg-ink/15" />
            <span className="h-2 rounded bg-ink/10" style={{ width: `${r.a}%` }} />
            <span className="h-2 rounded bg-ink/10" style={{ width: `${r.b}%` }} />
            <span className={`h-4 w-full rounded-full ${r.gap ? 'bg-primary/25' : 'bg-ink/[0.07]'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

const ROWS = [
  { a: 70, b: 45, gap: false },
  { a: 55, b: 60, gap: false },
  { a: 80, b: 40, gap: true },
  { a: 60, b: 55, gap: false },
  { a: 45, b: 65, gap: true },
  { a: 75, b: 50, gap: false },
]
