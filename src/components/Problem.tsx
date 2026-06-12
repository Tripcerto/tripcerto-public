import { AssetChips } from './AssetChips'
import { DelayStat } from './DelayStat'
import { StatCard } from './StatCard'

export function Problem() {
  return (
    <section id="problem" className="band-revenue">
      <div className="shell">
        <div className="section-header reveal" style={{ maxWidth: 840 }}>
          <span className="eyebrow">
            <span className="dot" />
            The problem
          </span>
          <h2 className="section-title">
            You aren&rsquo;t delivering value <span className="serif">quick enough</span>.
          </h2>
          <p className="section-sub" style={{ maxWidth: 720 }}>
            Travel companies already hold the knowledge that wins bookings. The problem is that it sits
            fragmented across websites, teams, suppliers, inventory and CRM &mdash; moving by hand at the
            exact moment a traveller&rsquo;s intent is highest.
          </p>
        </div>

        <AssetChips />
        <DelayStat />

        <div className="stats reveal" style={{ marginTop: 18 }}>
          <StatCard
            theme="Personalisation"
            kpi="5–15%"
            gloss="Revenue uplift personalisation typically drives, alongside 10–30% higher marketing ROI."
            src="McKinsey · personalisation research"
          />
          <StatCard
            theme="Ease"
            kpi="~70%"
            gloss="Average online customer journey abandonment — 18% leave because the process is too long or complicated."
            src="Baymard Institute · 50 studies"
          />
          <StatCard
            theme="Trust"
            kpi="68%"
            gloss="Of travellers won't trust AI alone to complete a booking — 89% want AI involved, but only 12% are comfortable letting it decide."
            src="68% Expedia Group · 89/12% Booking.com"
          />
        </div>
      </div>
    </section>
  )
}
