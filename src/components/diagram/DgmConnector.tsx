// Hairline gold connector. `h` = horizontal chevron (relay tracks, layer stage
// gaps). `v` = vertical chevron; `long` switches to the taller 46px boundary
// variant. `className` carries layout modifiers (stage-conn, input-vconn,
// layer-vconn, "layer-vconn always").
export function DgmConnector({
  dir,
  long = false,
  className = '',
}: {
  dir: 'h' | 'v'
  long?: boolean
  className?: string
}) {
  const cls = `dgm-conn ${dir}${className ? ` ${className}` : ''}`
  if (dir === 'h') {
    return (
      <svg className={cls} viewBox="0 0 54 16" aria-hidden="true">
        <line className="ln" x1="0" y1="8" x2="46" y2="8" />
        <path className="hd" d="M46 4 L54 8 L46 12 Z" />
      </svg>
    )
  }
  if (long) {
    return (
      <svg className={cls} viewBox="0 0 16 46" aria-hidden="true">
        <line className="ln" x1="8" y1="0" x2="8" y2="38" />
        <path className="hd" d="M4 38 L12 38 L8 46 Z" />
      </svg>
    )
  }
  return (
    <svg className={cls} viewBox="0 0 16 30" aria-hidden="true">
      <line className="ln" x1="8" y1="0" x2="8" y2="22" />
      <path className="hd" d="M4 22 L12 22 L8 30 Z" />
    </svg>
  )
}
