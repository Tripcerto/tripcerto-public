import { ShinyText } from './ShinyText'
import { Threads } from './Threads'
import { useTheme } from '../lib/theme'

const CALENDAR_BOOKING = 'https://calendar.app.google/kQsnVUt2ABMxFwjw7'
// Stable module-level colour arrays — inline literals churn Threads' effect deps
// and tear down the WebGL context every render. Warm gold on cream; a brighter
// gold keeps the waves visible on the espresso dark bg.
const THREADS_COLOR_LIGHT: [number, number, number] = [0.62, 0.43, 0.13]
const THREADS_COLOR_DARK: [number, number, number] = [0.86, 0.64, 0.33]

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
          yOffset={0.12}
          enableMouseInteraction
        />
      </div>
      <div className="hero-grad" aria-hidden="true" />
      <div className="shell hero-shell">
        <div className="hero-center">
          <h1 className="hero-title">
            <span className="hero-line">Revenue is lost</span>
            <span className="hero-line">
              when information moves{' '}
              <ShinyText
                text="slowly"
                className="serif"
                color={dark ? '#e3b15c' : '#a8772a'}
                shineColor={dark ? '#fbe3a8' : '#e9c277'}
                speed={2.6}
                delay={1.2}
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
          </div>
        </div>
        <p className="hero-strip">
          Operators · OTAs · DMCs · TMCs · Accommodation · Experiences · Flights · Ground transport
        </p>
      </div>
    </section>
  )
}
