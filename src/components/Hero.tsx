import { ShinyText } from './ShinyText'
import { Threads } from './Threads'

const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
// Stable module-level colour array — inline literals churn Threads' effect deps
// and tear down the WebGL context every render. Darkened for the cream bg (§8a).
const THREADS_COLOR: [number, number, number] = [0.49, 0.33, 0.13]

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <Threads color={THREADS_COLOR} amplitude={2.0} distance={0.2} enableMouseInteraction />
      </div>
      <div className="hero-grad" aria-hidden="true" />
      <div className="shell hero-shell">
        <h1 className="hero-title">
          <span className="hero-line">Revenue is lost</span>
          <span className="hero-line">
            when information moves{' '}
            <ShinyText
              text="slowly"
              className="serif"
              color="#7d5520"
              shineColor="#b9832f"
              speed={4.5}
              delay={3.5}
              spread={110}
            />
            .
          </span>
        </h1>
        <p className="hero-tagline">Tripcerto helps companies move quickly and win more bookings.</p>
        <div className="hero-ctas">
          <a
            href={CALENDAR_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-pill btn-lg"
            data-track="book_demo_hero"
            data-track-kind="cta"
          >
            Book a demo <span className="arrow">→</span>
          </a>
          <a
            href="#how"
            className="btn btn-ghost btn-lg"
            data-track="see_how_it_works_hero"
            data-track-kind="cta"
          >
            See how it works
          </a>
        </div>
        <p className="hero-strip">
          Operators · OTAs · DMCs · TMCs · Accommodation · Experiences · Flights · Ground transport
        </p>
      </div>
    </section>
  )
}
