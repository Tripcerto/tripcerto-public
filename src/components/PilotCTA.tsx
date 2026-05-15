import { IArrow } from './icons'
import { SoftAurora } from './SoftAurora'

const MAILTO_CONTACT = 'mailto:hello@tripcerto.com'
const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'

export function PilotCTA() {
  return (
    <section id="pilot">
      <div className="shell">
        <div className="pilot-aurora-bg" aria-hidden="true">
          <SoftAurora
            color1="#c4923f"
            color2="#d6a85a"
            speed={0.6}
            scale={0.4}
            brightness={0.6}
            noiseFrequency={2.5}
            noiseAmplitude={2}
            bandHeight={0.5}
            bandSpread={0.9}
            octaveDecay={0.24}
            layerOffset={0}
            colorSpeed={0.9}
            enableMouseInteraction
            mouseInfluence={0.1}
          />
        </div>
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
