import { cloneElement, type ReactElement } from 'react'
import { ICode, IDatabase, IHammer, ILink } from './icons'
import type { IconProps } from './icons'

interface Mode {
  icon: ReactElement<IconProps>
  label: string
  body: string
  soon?: boolean
}

const MODES: Mode[] = [
  {
    icon: <ILink />,
    label: 'Subdomain',
    body: 'Launch Stella on a branded planning URL like plan.yourbrand.com. We handle setup, theming, and deployment.',
  },
  {
    icon: <ICode />,
    label: 'Embed widget',
    body: 'Add Stella to your existing site with a simple script tag. Use it as a floating assistant or full-page planner.',
  },
  {
    icon: <IDatabase />,
    label: 'API + webhook',
    body: 'Send qualified briefs straight into your CRM, booking tools, or internal workflow.',
    soon: true,
  },
]

export function Integration() {
  return (
    <section id="integration">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">
            <span className="dot" />
            Integration
          </span>
          <h2 className="section-title">Three ways to launch. No rebuild required.</h2>
        </div>

        <div className="integration-lead">
          <span className="integration-lead-icon">
            <IHammer size={22} sw={1.5} />
          </span>
          <div>
            <h4>Built to fit your stack</h4>
            <p>
              Stella works alongside your current website, CRM, and sales process &mdash; so you can start capturing
              better leads without changing how your team operates.
            </p>
          </div>
        </div>

        <div className="integration-grid">
          {MODES.map((m) => (
            <div
              key={m.label}
              className="card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                opacity: m.soon ? 0.6 : 1,
              }}
            >
              <span style={{ color: 'var(--gold)' }}>{cloneElement(m.icon, { size: 22, sw: 1.5 })}</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{m.label}</h3>
              <p style={{ margin: 0, color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.5 }}>{m.body}</p>
              {m.soon ? (
                <span className="label-mono" style={{ marginTop: 'auto', color: 'var(--ink-muted)' }}>
                  Coming soon
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
