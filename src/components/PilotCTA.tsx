import { IArrow } from './icons'

const META: Array<{ k: string; v: string }> = [
  { k: 'Pilots available?', v: 'Yes' },
  { k: 'Time-to-launch', v: '6 weeks' },
  { k: 'Stack', v: 'Claude Sonnet · pgvector · Supabase' },
]

const MAILTO_DEMO = 'mailto:hello@tripcerto.com?subject=Tripcerto%20demo%20request'
const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'

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
                Book a 20-minute demo. Walk away with your white-label sandbox.
              </h2>
              <p style={{ margin: 0, color: 'var(--ink-dim)', fontSize: 17, maxWidth: '52ch' }}>
                Pilots run 90 days, fixed-fee, with a published exit clause. No public pricing &mdash; we calibrate to
                enquiry volume and inventory size.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={MAILTO_DEMO} className="btn btn-primary btn-lg">
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
