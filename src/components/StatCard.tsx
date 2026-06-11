interface StatCardProps {
  theme: string
  kpi: string
  gloss: string
  src: string
}

export function StatCard({ theme, kpi, gloss, src }: StatCardProps) {
  return (
    <div className="stat">
      <span className="stat-theme">{theme}</span>
      <span className="kpi">{kpi}</span>
      <p>{gloss}</p>
      <span className="src">{src}</span>
    </div>
  )
}
