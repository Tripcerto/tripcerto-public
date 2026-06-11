import { BoundaryDiagram } from './BoundaryDiagram'

export function DataControlSection() {
  return (
    <section id="data-control" className="band-proof">
      <div className="shell">
        <div className="dc-grid">
          <div className="dc-body reveal">
            <span className="eyebrow">
              <span className="dot" />
              Stay protected
            </span>
            <h2 className="section-title" style={{ marginTop: 16 }}>
              Deliver more. Risk less.
            </h2>
            <p>
              Your rates, content, inventory, booking history and customer conversations are what make your
              business different. Tripcerto turns them into an AI-native, higher-converting experience{' '}
              <b>inside your own environment</b> — not pooled across partners, not used to train shared
              models, and never handed to a big incumbent who could resell your edge back to the market.
            </p>
            <p className="dc-tagline">
              A seamless AI experience for your customers — <b>without the exposure</b>.
            </p>
            <div className="dc-guarantee">
              <span>No shared training</span>
              <span>No cross-partner pooling</span>
              <span>Exportable at any time</span>
            </div>
          </div>
          <BoundaryDiagram />
        </div>
      </div>
    </section>
  )
}
