import { Threads } from './Threads'

const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
// Stable module-level colour array (same churn fix as Hero). Darkened for cream (§8a).
const THREADS_COLOR_PILOT: [number, number, number] = [0.55, 0.39, 0.18]

export function PilotCTA() {
  return (
    <section id="pilot" className="pilot band-close">
      <div className="pilot-bg" aria-hidden="true">
        <Threads color={THREADS_COLOR_PILOT} amplitude={1.8} distance={0.3} enableMouseInteraction />
      </div>
      <div className="shell">
        <div className="pilot-panel">
          <span className="eyebrow">
            <span className="dot" />
            Pilot programme · open
          </span>
          <h2 className="pilot-title">Move information faster. Win more bookings.</h2>
          <p className="pilot-sub">
            Watch Stella turn a real chat into a qualified, matched brief — in your branding. Yours to keep
            at the end.
          </p>
          <div className="pilot-ctas">
            <a
              href={CALENDAR_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-pill btn-lg"
              data-track="book_demo_pilot"
              data-track-kind="cta"
            >
              Book a demo <span className="arrow">→</span>
            </a>
            <a
              href={MAILTO_CONTACT}
              className="btn btn-ghost btn-lg"
              data-track="contact_us_pilot"
              data-track-kind="cta"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
