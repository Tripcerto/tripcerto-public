import { ShinyText } from './ShinyText'
import { Threads } from './Threads'
import { useTheme } from '../lib/theme'

const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
// Stable module-level colour arrays — inline literals churn Threads' effect deps
// and tear down the WebGL context every render. Dark gold reads on cream; a
// brighter gold is needed so the waves stay visible on the espresso dark bg.
const THREADS_COLOR_LIGHT: [number, number, number] = [0.49, 0.33, 0.13]
const THREADS_COLOR_DARK: [number, number, number] = [0.82, 0.6, 0.3]

export function Hero() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <Threads
          color={dark ? THREADS_COLOR_DARK : THREADS_COLOR_LIGHT}
          amplitude={3.0}
          distance={0.32}
          enableMouseInteraction
        />
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
              color={dark ? '#d8a44e' : '#7d5520'}
              shineColor={dark ? '#f4d488' : '#a8772a'}
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
