import { IArrow } from './icons'
import { Threads } from './Threads'

const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'

export function PilotCTA() {
  return (
    <section id="pilot">
      <div className="pilot-aurora-bg" aria-hidden="true">
        <Threads
          color={[1.0, 0.78, 0.42]}
          amplitude={1.8}
          distance={0.3}
          enableMouseInteraction
        />
      </div>
      <div className="shell">
        <div className="pilot-panel">
          <div className="pilot-lead">
            <span className="eyebrow">
              <span className="dot" />
              Pilot programme · open
            </span>
            <h2 className="pilot-title">Book a demo</h2>
            <p className="pilot-sub">
              See Stella turn a real chat into a qualified brief, in your branding. Yours to keep at the
              end.
            </p>
            <div className="pilot-ctas">
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
        </div>
      </div>
    </section>
  )
}
