import { RelayFunnel } from './RelayFunnel'

export function JourneySection() {
  return (
    <section id="journey" className="band-revenue">
      <div className="shell">
        <div className="section-header reveal" style={{ maxWidth: 820 }}>
          <span className="eyebrow">
            <span className="dot" />
            Traditional vs Tripcerto
          </span>
          <h2 className="section-title">Same product. More effective customer journey.</h2>
          <p className="section-sub">
            Every enquiry travels the same path. In the traditional funnel each handoff adds delay — and
            every delay cools the lead. Tripcerto connects the steps, so the traveller gets value while
            their intent is still warm.
          </p>
        </div>
        <RelayFunnel />
      </div>
    </section>
  )
}
