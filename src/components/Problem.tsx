interface Stat {
  kpi: string
  label: string
}

const STATS: Stat[] = [
  { kpi: '60%', label: 'Increase in average site session duration' },
  { kpi: '390%', label: 'Increase in web lead conversion' },
  { kpi: '40%', label: 'Increase in sales from web leads' },
]

export function Problem() {
  return (
    <section id="problem">
      <div className="shell">
        <div className="grid-cols-2" style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span className="eyebrow">
              <span className="dot" />
              Problem
            </span>
            <h2 className="section-title">
              95% of visitors to travel websites leave without taking action.
            </h2>
          </div>
          <div
            style={{
              padding: '32px 28px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span className="label-mono" style={{ marginBottom: 8 }}>
              Your website today
            </span>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-dim)', lineHeight: 1.6 }}>
              Visitors land, scan a form, and leave. The ones who stay submit vague enquiries your team spends hours
              qualifying.
            </p>
            <p
              style={{
                margin: '12px 0 0',
                fontSize: 16,
                color: 'var(--gold-soft)',
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Tripcerto keeps them talking &mdash; and turns that conversation into 3&times; more enquiries than a
              static form ever could.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.kpi} className="stat-card">
              <span className="stat-kpi">{s.kpi}</span>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
