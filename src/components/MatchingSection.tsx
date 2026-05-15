import { BriefReveal } from './BriefReveal'

type ConceptKind = 'must' | 'nice' | 'exclude'

interface Concept {
  t: string
  kind: ConceptKind
}

interface Stay {
  name: string
  region: string
  score: number
  excluded?: boolean
}

const CONCEPTS: Concept[] = [
  { t: 'winelands tasting', kind: 'must' },
  { t: 'safari game drive', kind: 'must' },
  { t: 'cape town city day', kind: 'nice' },
  { t: 'two-base itinerary', kind: 'must' },
  { t: 'boutique lodge', kind: 'must' },
  { t: 'large group resort', kind: 'exclude' },
  { t: 'all-inclusive', kind: 'exclude' },
  { t: 'private chef dinner', kind: 'nice' },
  { t: 'scenic helicopter', kind: 'nice' },
  { t: 'self-drive', kind: 'exclude' },
  { t: 'mountain views', kind: 'nice' },
  { t: 'backpacker hostel', kind: 'exclude' },
]

const STAYS: Stay[] = [
  { name: 'Delaire Graff Estate', region: 'Stellenbosch · Winelands', score: 0.96 },
  { name: 'Singita Boulders Lodge', region: 'Sabi Sand · Safari', score: 0.91 },
  { name: 'La Residence', region: 'Franschhoek · Winelands', score: 0.85 },
  { name: 'Londolozi Tree Camp', region: 'Sabi Sand · Safari', score: 0.79 },
  { name: 'Sun City Resort', region: 'North West · Resort', score: 0.18, excluded: true },
]

const GLYPH: Record<ConceptKind, string> = {
  must: '●',
  nice: '+',
  exclude: '×',
}

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
                CUSTOMER PREFERENCES · SEPT HONEYMOON
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CONCEPTS.map((c) => (
                  <span key={c.t} className={`tag ${c.kind}`}>
                    <span className="glyph">{GLYPH[c.kind]}</span>
                    {c.t}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                Concepts are weighted, not booleans. &ldquo;large group resort = exclude&rdquo; cancels properties even
                if their other signals score high.
              </p>
            </div>

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
