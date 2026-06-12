import { Fragment } from 'react'
import { DgmNode } from './diagram/DgmNode'
import { DgmConnector } from './diagram/DgmConnector'
import { FanConnector } from './diagram/FanConnector'
import { VerticalsRow } from './VerticalsRow'

const STAGES = [
  {
    no: 'Understand',
    blocks: [
      { nt: 'Preferences Identified', meta: 'Criteria signals extracted from user input' },
      { nt: 'Immediate Responses', meta: 'Powered by your expert content' },
    ],
  },
  {
    no: 'Personalise',
    blocks: [
      { nt: 'Personal Suggestions', meta: 'Preferences inform personalisation' },
      { nt: 'Build trust', meta: 'Reasons grounded in understanding' },
    ],
  },
  {
    no: 'Convert',
    blocks: [
      { nt: 'Customer-defined trip profiles', meta: 'Created by them, informed by you' },
      {
        nt: 'Your Preferred Product',
        meta: 'Total control over what is offered.',
      },
    ],
  },
]

const OUTS = [
  { nt: 'Automation', ns: 'Qualified briefs to your inbox — CRM and webhook sync on the roadmap.' },
  { nt: 'Higher ROI', ns: 'Same spend, less friction, more opportunities.' },
  { nt: 'More Sales', ns: 'Personalisation + speed = higher conversions.' },
]

export function LayerDiagram() {
  return (
    <figure
      className="dgm dgm-layer reveal"
      role="img"
      aria-label="The Tripcerto layer: a traveller's journey enters, passes through Understand, Personalise and Convert stages inside your isolated environment, and produces automation, higher ROI and more sales."
    >
      <div className="dgm-frame">
        {/* TIER 1 — customer journey in */}
        <div className="layer-tier">
          <div className="layer-tier-head">
            <span className="dgm-lane-label is-pos">
              <i className="tick" />
              Customer Journey In
            </span>
          </div>
          <div className="layer-row ins-row">
            <DgmNode variant="owned">
              <span className="nt">Traveller planning journey</span>
              <span className="ns">Travel planning spans dozens of touchpoints.</span>
            </DgmNode>
            <DgmConnector dir="v" className="input-vconn" />
            <DgmNode variant="owned">
              <span className="nt">Your branded surface</span>
              <span className="ns">
                Stella, in your branding — capturing intent the moment a visitor arrives.
              </span>
            </DgmNode>
          </div>
        </div>

        <DgmConnector dir="v" className="layer-vconn always" />

        {/* TIER 2 — the layer */}
        <div className="layer-core">
          <span className="layer-core-tag">Tripcerto platform</span>
          <div className="layer-stages">
            {STAGES.map((s, i) => (
              <Fragment key={s.no}>
                {i > 0 && <DgmConnector dir="h" className="stage-conn" />}
                <div className="layer-stage">
                  <span className="stage-no">{s.no}</span>
                  <div className="stage-blocks">
                    {s.blocks.map((b) => (
                      <DgmNode key={b.nt} variant="layer">
                        <span className="nt">{b.nt}</span>
                        <span className="dgm-meta">{b.meta}</span>
                      </DgmNode>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <FanConnector />
        <DgmConnector dir="v" className="layer-vconn" />

        {/* TIER 3 — value created */}
        <div className="layer-tier">
          <div className="layer-tier-head">
            <span className="dgm-lane-label is-pos">
              <i className="tick" />
              What Value Tripcerto Creates
            </span>
          </div>
          <div className="layer-row outs-row">
            {OUTS.map((o) => (
              <DgmNode key={o.nt} variant="owned">
                <span className="nt">{o.nt}</span>
                <span className="ns">{o.ns}</span>
              </DgmNode>
            ))}
          </div>
        </div>

        <VerticalsRow />
      </div>
    </figure>
  )
}
