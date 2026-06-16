import { ConnectedJourneyDiagram } from './ConnectedJourneyDiagram'

export function ConnectedJourneySection() {
  return (
    <section id="ecosystem" className="band-revenue">
      <div className="shell">
        <div className="section-header reveal" style={{ maxWidth: 820 }}>
          <span className="eyebrow">
            <span className="dot" />
            Where Tripcerto sits
          </span>
          <h2 className="section-title">
            Tripcerto <span className="serif">orchestrates</span> the connected journey
          </h2>
          <p className="section-sub" style={{ maxWidth: 660 }}>
            Information moves seamlessly between consumers, retailers, distributors, suppliers and
            aggregators.
          </p>
        </div>
        <ConnectedJourneyDiagram />
      </div>
    </section>
  )
}
