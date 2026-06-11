const VERTICALS = [
  'Operators',
  'OTAs',
  'DMCs',
  'TMCs',
  'Accommodation',
  'Experiences',
  'Flights',
  'Ground transport',
]

export function VerticalsRow() {
  return (
    <div className="platform-verticals" style={{ justifyContent: 'center', marginTop: 6 }}>
      <span className="vlab">Built for</span>
      {VERTICALS.map((v) => (
        <span key={v} className="vchip">
          {v}
        </span>
      ))}
    </div>
  )
}
