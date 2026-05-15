import { IArrow } from './icons'

const META: Array<{ k: string; v: string }> = [
  { k: "What you'll see", v: 'Live white-label sandbox' },
  { k: 'Time to launch', v: '1 week (subdomain) · 6 weeks (full)' },
  { k: 'Pilot terms', v: '90 days · fixed-fee · published exit' },
  { k: 'Your data', v: 'Yours · never co-mingled · CSV/JSON export' },
]

const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'

export function PilotCTA() {
  return (
    <section id="pilot">
      <div className="shell">
        <div className="pilot-panel">
          <div className="pilot-grid-bg" />
          <div className="pilot-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <span className="eyebrow">
                <span className="dot" />
                Pilot programme · open
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(34px, 3.6vw, 48px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.022em',
                  fontWeight: 500,
                  textWrap: 'balance',
                }}
              >
                Book a 20-minute demo
              </h2>
              <p style={{ margin: 0, color: 'var(--ink-dim)', fontSize: 17, maxWidth: '52ch' }}>
                See Stella turn a real chat into a qualified brief, in your branding. Yours to keep at the end.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={CALENDAR_BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  Book a demo <IArrow size={15} />
                </a>
                <a href={MAILTO_CONTACT} className="btn btn-ghost btn-lg">
                  Contact us
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {META.map((row) => (
                <div
                  key={row.k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px dashed var(--line)',
                    fontSize: 13.5,
                  }}
                >
                  <span className="label-mono">{row.k}</span>
                  <span style={{ color: 'var(--ink)' }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
