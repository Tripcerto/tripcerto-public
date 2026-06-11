import { Threads } from './Threads'
import { useTheme } from '../lib/theme'

const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
// Stable module-level colour arrays (same churn fix as Hero): dark gold on cream,
// brighter gold so the waves stay legible on the espresso dark bg.
const THREADS_COLOR_PILOT_LIGHT: [number, number, number] = [0.55, 0.39, 0.18]
const THREADS_COLOR_PILOT_DARK: [number, number, number] = [0.85, 0.62, 0.32]

export function PilotCTA() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <section id="pilot" className="pilot band-close">
      <div className="pilot-bg" aria-hidden="true">
        <Threads
          color={dark ? THREADS_COLOR_PILOT_DARK : THREADS_COLOR_PILOT_LIGHT}
          amplitude={1.8}
          distance={0.3}
          enableMouseInteraction
        />
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
