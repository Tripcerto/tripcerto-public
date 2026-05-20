interface BriefSignals {
  budget: string
  groupSize: string
  style: string
  confidence: number
}

// Tag labels are verbatim production `dotpess_names` so the demo brief
// mirrors what Stella's pipeline actually extracts and matches on.
const BRIEF = {
  summary: 'Anniversary · 2 adults · South Africa · 10 nights · Oct 5–15',
  must: ['Safari', 'Game Drive', 'Wildlife', 'Wine', 'Vineyard', 'Lodge', 'Boutique'],
  nice: ['City', 'Chef’s Table', 'Fine Dining', 'Helicopter', 'Mountain', 'Spa'],
  exclude: ['Resort', 'All-Inclusive', 'Self-Drive', 'Backpacking'],
  signals: {
    budget: '$15–25k',
    groupSize: '2 Adults',
    style: 'Ultra-Luxury, Romantic',
    confidence: 0.96,
  } satisfies BriefSignals,
} as const

const SIGNAL_LABELS: Record<keyof BriefSignals, string> = {
  budget: 'budget',
  groupSize: 'group size',
  style: 'style',
  confidence: 'confidence',
}

export function BriefReveal() {
  const signals = Object.entries(BRIEF.signals) as [keyof BriefSignals, string | number][]

  return (
    <div className="brief">
      <div className="brief-header">
        <span>BRIEF.JSON</span>
        <span style={{ color: 'var(--gold-soft)', letterSpacing: 0 }}>● direct to pipeline</span>
      </div>
      <div className="brief-body">
        <div className="brief-row">
          <span className="brief-label">Summary</span>
          <span style={{ color: 'var(--ink)' }}>{BRIEF.summary}</span>
        </div>
        <div className="brief-row">
          <span className="brief-label">Must-haves</span>
          <div className="brief-tags">
            {BRIEF.must.map((t) => (
              <span key={t} className="tag must">
                <span className="glyph">●</span>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="brief-row">
          <span className="brief-label">Nice-to-have</span>
          <div className="brief-tags">
            {BRIEF.nice.map((t) => (
              <span key={t} className="tag nice">
                <span className="glyph">+</span>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="brief-row">
          <span className="brief-label">Must-exclude</span>
          <div className="brief-tags">
            {BRIEF.exclude.map((t) => (
              <span key={t} className="tag exclude">
                <span className="glyph">×</span>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            paddingTop: 6,
            borderTop: '1px dashed var(--line)',
          }}
        >
          {signals.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="brief-label" style={{ fontSize: 10 }}>
                {SIGNAL_LABELS[k]}
              </span>
              <span style={{ color: 'var(--ink)' }}>
                {typeof v === 'number' ? `${Math.round(v * 100)}%` : v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
