import { BriefReveal } from './BriefReveal'

interface Stay {
  name: string
  region: string
  score: number
  excluded?: boolean
}

// Fictional properties — region-consistent with the demo brief, not real businesses.
const STAYS: Stay[] = [
  { name: 'Ashworth Wine Estate', region: 'Stellenbosch · Winelands', score: 0.96 },
  { name: 'Camp Khaya', region: 'Sabi Sand · Safari', score: 0.87 },
  { name: 'The Hawthorne', region: 'Franschhoek · Winelands', score: 0.73 },
  { name: 'Sable Tree Camp', region: 'Sabi Sand · Safari', score: 0.58 },
  { name: 'Palmview Grand Resort', region: 'North West · Resort', score: 0.14, excluded: true },
]

export function MatchingSection() {
  return (
    <section id="demo" className="matching-section">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">
            <span className="dot" />
            Name-led matching · ~2,100 concepts
          </span>
          <h2 className="section-title">Not keyword filters. A fingerprint of what each traveller wants.</h2>
          <p className="section-sub">
            Every signal Stella picks up is weighted &mdash; must-have, nice-to-have, or must-exclude &mdash; and
            scored against your inventory in real time, in a way that you control.
          </p>
        </div>

        <div className="matching-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <BriefReveal />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <span className="label-mono" style={{ display: 'block', marginBottom: 12 }}>
                your inventory · scored
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STAYS.map((s) => (
                  <div key={s.name} className={`inv-row${s.excluded ? ' excluded' : ''}`}>
                    <span
                      className={s.excluded ? 'tag exclude' : 'score'}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        padding: '2px 8px',
                        fontWeight: 600,
                        minWidth: 36,
                        textAlign: 'center',
                      }}
                    >
                      {s.excluded ? '✕' : Math.round(s.score * 100)}
                    </span>
                    <div>
                      <span className="inv-name">{s.name}</span>
                      <span className="inv-region">{s.region}</span>
                    </div>
                    <div className="inv-bar">
                      <div
                        className="inv-bar-fill"
                        style={{
                          width: `${s.score * 100}%`,
                          background: s.excluded
                            ? 'var(--red)'
                            : 'linear-gradient(90deg, var(--gold-deep), var(--gold))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
