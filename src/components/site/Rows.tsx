export type Row = { name: string; note: string; line: string; href?: string }

/* Ruled rows read from the top: the subject and a short note under it on
   the left, the line on the right. A row with an address makes its name
   the link. */
export function Rows({ rows }: { rows: ReadonlyArray<Row> }) {
  return (
    <ul role="list" className="divide-y divide-line">
      {rows.map(({ name, note, line, href }) => (
        <li key={name} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12 md:gap-y-0">
          <div>
            <h3 className="text-subhead">
              {href ? (
                <a href={href} className="underline decoration-1 underline-offset-4 transition-colors hover:text-link">
                  {name}
                </a>
              ) : (
                name
              )}
            </h3>
            <p className="mt-1 text-small text-dim">{note}</p>
          </div>
          <p className="text-copy text-dim">{line}</p>
        </li>
      ))}
    </ul>
  )
}
