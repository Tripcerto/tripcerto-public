const ASSETS = [
  'product knowledge',
  'customer insight',
  'supplier relationships',
  'sales expertise',
  'live inventory',
  'CRM history',
]

export function AssetChips() {
  return (
    <div className="frag reveal">
      {ASSETS.map((a) => (
        <span key={a} className="asset">
          {a}
        </span>
      ))}
    </div>
  )
}
