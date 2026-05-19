import { IArrow } from './icons'
import { ShinyText } from './ShinyText'
import { Threads } from './Threads'

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <Threads
          color={[0.769, 0.573, 0.247]}
          amplitude={2.0}
          distance={0.2}
          enableMouseInteraction
        />
      </div>
      <div className="shell hero-shell">
        <div className="hero-spacer-top" />
        <div className="hero-content">
          <h1 className="hero-title">
            Travellers don&rsquo;t think in categories.{' '}
            <ShinyText
              text="Stella doesn’t either."
              color="#c4923f"
              shineColor="#d6a85a"
              speed={4.5}
              delay={3.5}
              spread={110}
            />
          </h1>
          <p className="hero-sub">
            Stella is an agentic AI that turns the way travellers actually talk &mdash; vibes, must-haves,
            dealbreakers &mdash; into behavioural data that removes the friction from closing sales.
          </p>
          <div className="hero-ctas">
            <a
              href="https://calendar.app.google/kQsnVUt2ABMxFwjw7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              data-track="book_demo_hero"
              data-track-kind="cta"
            >
              Book a demo <IArrow size={15} />
            </a>
          </div>
        </div>
        <div className="hero-spacer-bottom" />
      </div>
    </section>
  )
}
