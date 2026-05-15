import { IArrow } from './icons'

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="shell hero-shell">
        <div className="hero-spacer-top" />
        <div className="hero-content">
          <h1 className="hero-title">
            Travellers don&rsquo;t think in categories.{' '}
            <span style={{ color: 'var(--gold)' }}>Stella doesn&rsquo;t either.</span>
          </h1>
          <p className="hero-sub">
            Stella is an agentic AI that turns the way travellers actually talk &mdash; moods, must-haves,
            dealbreakers &mdash; into personalised suggestions that remove the friction from closing sales.
          </p>
          <div className="hero-ctas">
            <a href="#pilot" className="btn btn-primary btn-lg">
              Book a 20-min demo <IArrow size={15} />
            </a>
          </div>
        </div>
        <div className="hero-spacer-bottom" />
      </div>
    </section>
  )
}
