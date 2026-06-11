import { Fragment } from 'react'
import { DgmNode } from './diagram/DgmNode'
import { DgmConnector } from './diagram/DgmConnector'

const NODES = [
  {
    variant: 'owned' as const,
    label: 'Your business data',
    meta: 'Rates · content · inventory · CRM history · conversations',
  },
  {
    variant: 'env' as const,
    label: 'Private partner environment',
    meta: 'Isolated schema · access controls · approved content · audit & export',
  },
  {
    variant: 'layer' as const,
    label: 'Tripcerto platform',
    meta: 'Extraction · retrieval · scoring · matching',
  },
  {
    variant: 'owned' as const,
    label: 'Your outputs',
    meta: 'Qualified briefs · inbox delivery · analytics · export',
  },
]

export function BoundaryDiagram() {
  return (
    <figure
      className="dgm dgm-boundary reveal"
      role="img"
      aria-label="Private data boundary. Your business data enters a private partner environment with isolated schema and access controls, is processed by the Tripcerto platform, and leaves as your outputs. No shared training, no cross-partner pooling, exportable at any time."
    >
      <div className="dgm-frame">
        <div className="boundary-stack">
          {NODES.map((n, i) => (
            <Fragment key={n.label}>
              {i > 0 && <DgmConnector dir="v" long />}
              <DgmNode variant={n.variant}>
                <span className="dgm-lane-label is-pos">
                  <i className="tick" />
                  {n.label}
                </span>
                <span className="dgm-meta">{n.meta}</span>
              </DgmNode>
            </Fragment>
          ))}
        </div>
      </div>
    </figure>
  )
}
