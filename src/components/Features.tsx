import { cloneElement, type ReactElement } from 'react'
import { IDatabase, IFilter, IGauge, IHandoff, ISpark, IUsers } from './icons'
import type { IconProps } from './icons'

interface Feature {
  icon: ReactElement<IconProps>
  title: string
  body: string
}

const ITEMS: Feature[] = [
  { icon: <ISpark />, title: 'Branded chat', body: 'Your colours, logo, voice. Stella becomes your AI assistant — not ours.' },
  { icon: <IFilter />, title: 'Qualified briefs', body: 'Must-have / nice-to-have / must-exclude. Every message tightens the fingerprint.' },
  { icon: <IDatabase />, title: 'Inventory scoring', body: "Your destinations, stays, and packages ranked against each traveller's fingerprint." },
  { icon: <IUsers />, title: 'Group planning', body: 'Travellers invite their group. Shared preferences feed one merged brief.' },
  { icon: <IHandoff />, title: 'CRM handoff', body: 'Briefs land in your inbox, HubSpot, Salesforce, or webhook. No copy-paste.\n\nComing soon.' },
  { icon: <IGauge />, title: 'Admin analytics', body: 'Sessions, drop-off, top-scored inventory, conversion. See what your audience wants.' },
]

export function Features() {
  return (
    <section id="features">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">
            <span className="dot" />
            Platform
          </span>
          <h2 className="section-title">Everything your sales and marketing teams need, without the noise.</h2>
        </div>
        <div className="features-grid">
          {ITEMS.map((it) => (
            <div key={it.title} className="feature-card">
              <span className="feature-icon">{cloneElement(it.icon, { size: 22, sw: 1.5 })}</span>
              <h3 className="feature-title">{it.title}</h3>
              <p className="feature-body">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
