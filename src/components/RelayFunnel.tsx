import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { DgmNode } from './diagram/DgmNode'
import { DgmConnector } from './diagram/DgmConnector'

type RelayNode = { nt: string; impact: ReactNode; variant?: 'owned' | 'layer' | 'plain' }

const LANE_A: RelayNode[] = [
  { nt: 'Online form submission', impact: <><b>Most</b> never convert</> },
  { nt: 'Manual lead distribution', impact: 'Hours lost before first reply' },
  { nt: 'Sales outreach', impact: 'The reply lands cold' },
  { nt: 'Consultation & discovery', impact: 'Days of back-and-forth' },
  { nt: 'Supplier inventory packaged', impact: 'More waiting, more drop-off' },
  { nt: 'Proposal sent', impact: 'Intent has gone cold' },
]

const LANE_B: RelayNode[] = [
  { nt: 'Instant response', impact: <><b>Up to 391%</b> more likely to convert</>, variant: 'owned' },
  { nt: 'Preferences & intent captured', impact: 'Understood, not re-keyed', variant: 'layer' },
  { nt: 'Personalised inventory suggestions', impact: 'Relevant answers in seconds', variant: 'layer' },
  { nt: 'Customer-led personalisation', impact: 'Trust builds early', variant: 'layer' },
  { nt: 'Customer-led qualification', impact: 'A warm, qualified brief', variant: 'layer' },
  { nt: 'Revenue opportunity accelerated', impact: 'Booked while intent is warm', variant: 'owned' },
]

function Track({ nodes }: { nodes: RelayNode[] }) {
  return (
    <div className="relay-track">
      {nodes.map((n, i) => (
        <Fragment key={n.nt}>
          {i > 0 && <DgmConnector dir="h" />}
          <DgmNode variant={n.variant ?? 'plain'}>
            <span className="nt">{n.nt}</span>
            <span className="relay-impact">{n.impact}</span>
          </DgmNode>
        </Fragment>
      ))}
    </div>
  )
}

export function RelayFunnel() {
  return (
    <figure
      className="dgm dgm-relay reveal"
      role="img"
      aria-label="Two funnels compared. The traditional funnel loses leads to delay at every manual handoff. Tripcerto's connected funnel keeps the lead warm and converts more."
    >
      <div className="dgm-frame">
        <div className="relay-lane">
          <div className="relay-tag">
            <span className="dgm-lane-label">
              <i className="tick" />
              Today
            </span>
            <b>Traditional funnel</b>
            <em className="relay-time">
              ~3 days <small>per enquiry</small>
            </em>
          </div>
          <Track nodes={LANE_A} />
        </div>

        <div className="relay-lane is-pos">
          <div className="relay-tag">
            <span className="dgm-lane-label is-pos">
              <i className="tick" />
              With Tripcerto
            </span>
            <b>Connected funnel</b>
            <em className="relay-time good">
              minutes <small>per enquiry</small>
            </em>
          </div>
          <Track nodes={LANE_B} />
        </div>

        <figcaption className="dgm-cap">
          <b>Same demand. Less leakage.</b>
        </figcaption>
      </div>
    </figure>
  )
}
