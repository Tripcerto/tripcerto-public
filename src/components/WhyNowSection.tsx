import { StatCard } from './StatCard'

export function WhyNowSection() {
  return (
    <section className="band-proof" id="why-now">
      <div className="shell">
        <div className="section-header reveal" style={{ maxWidth: 860, marginBottom: 40 }}>
          <span className="eyebrow">
            <span className="dot" />
            Why now
          </span>
          <h2 className="section-title">
            Customer expectations are shifting — and your competitors are moving to meet them.
          </h2>
          <p className="section-sub" style={{ maxWidth: 760 }}>
            Travellers increasingly expect instant, AI-guided answers — and they are choosing the brands
            that meet them. The window to meet that expectation under your own brand is open now.
          </p>
        </div>

        <div className="stats reveal">
          <StatCard
            theme="Demand"
            kpi="89%"
            gloss="Of travellers want AI involved in planning their trips."
            src="Booking.com · global AI sentiment"
          />
          <StatCard
            theme="Channel shift"
            kpi="55%"
            gloss="Year-on-year rise in AI-referred traffic converting on travel sites."
            src="Contentsquare · 2026"
          />
          <StatCard
            theme="Preference"
            kpi="80%"
            gloss="Of consumers prefer brands that offer personalised experiences."
            src="Deloitte Digital"
          />
        </div>

        <p className="why-now-close reveal">
          The opportunity is not AI replacing specialists. It is giving your team qualified context — under
          your brand — while travellers' intent is still warm, before a competitor does it first.
        </p>
      </div>
    </section>
  )
}
