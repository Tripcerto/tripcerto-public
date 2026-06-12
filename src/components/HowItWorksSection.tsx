import { LayerDiagram } from './LayerDiagram'

export function HowItWorksSection() {
  return (
    <section id="how" className="band-product">
      <div className="shell">
        <div className="section-header reveal" style={{ maxWidth: 820 }}>
          <span className="eyebrow">
            <span className="dot" />
            Customer journey in. Commercial value out.
          </span>
          <h2 className="section-title">Move fast, sell more.</h2>
          <p className="section-sub" style={{ maxWidth: 740 }}>
            The intelligence layer between what travellers want and what you sell. Tripcerto helps travel
            businesses understand customers sooner, match them to the right products faster and convert more
            opportunities into bookings. The technology stays invisible. The commercial outcomes do not.
          </p>
        </div>

        <LayerDiagram />

        <p
          style={{
            marginTop: 34,
            textAlign: 'center',
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            fontWeight: 500,
            letterSpacing: '-.01em',
          }}
        >
          Give every visitor a relevant, personalised response instantly —{' '}
          <span style={{ color: 'var(--gold-ink)' }}>maximise every opportunity</span>.
        </p>
      </div>
    </section>
  )
}
