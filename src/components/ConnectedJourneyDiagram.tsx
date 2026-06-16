import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ *
 * Connected-journey ecosystem map.
 * Desktop (>=1040px): the converging map — demand → distribution →
 * supply across the top, all fanning down into the Tripcerto layer.
 * Mobile (<1040px): a tributary stream — a central spine every actor
 * feeds into, flowing down into the same layer. Same data, two layouts;
 * only one is in the DOM's accessibility tree at a time (display toggle).
 * ------------------------------------------------------------------ */

type IconKey =
  | 'traveller' | 'ota' | 'tmc' | 'ta' | 'to' | 'dmc'
  | 'stays' | 'act' | 'gt' | 'air' | 'rail' | 'cruise'
  | 'cust' | 'prod' | 'comm' | 'flow' | 'db' | 'tick' | 'down'

const ICON_PATHS: Record<IconKey, ReactNode> = {
  traveller: (<><circle cx="12" cy="8" r="3.4" /><path d="M5.5 19a6.5 6.5 0 0113 0" /></>),
  ota: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>),
  tmc: (<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></>),
  ta: (<><circle cx="12" cy="12" r="9" /><polygon points="12 2 14.4 9.6 22 12 14.4 14.4 12 22 9.6 14.4 2 12 9.6 9.6" /></>),
  to: (<><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><path d="M9 3v15M15 6v15" /></>),
  dmc: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>),
  stays: (<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  act: (<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>),
  gt: (<><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
  air: (<><path d="M21 16l-9-9-9 4 4 1-3 3 2 2 3-3 1 4z" /><path d="M3 21l4-4" /></>),
  rail: (<><rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 11h16" /><path d="M8 3v8M16 3v8" /><path d="M7 17l-2 4M17 17l2 4" /><circle cx="9" cy="14.5" r="1" /><circle cx="15" cy="14.5" r="1" /></>),
  cruise: (<><path d="M2 20a9 9 0 0020 0" /><path d="M6 20V10l6-7 6 7v10" /><path d="M6 14h12" /><path d="M9 10h6" /></>),
  cust: (<><circle cx="12" cy="8" r="3.4" /><path d="M5.5 19a6.5 6.5 0 0113 0" /></>),
  prod: (<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />),
  comm: (<><path d="M3 3v18h18" /><path d="M7 14l3.5-3.5 3 3L19 8" /></>),
  flow: (<><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 12h8M16 6l-8 5M16 18l-8-5" /></>),
  db: (<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 5v4c0 1.66-4.03 3-9 3S3 10.66 3 9V5" /><path d="M21 9v4c0 1.66-4.03 3-9 3S3 14.66 3 13V9" /><path d="M21 13v4c0 1.66-4.03 3-9 3S3 18.66 3 17v-4" /></>),
  tick: (<path d="M5 12l5 5 9-10" />),
  down: (<path d="M12 5v14M6 13l6 6 6-6" />),
}

function CjIcon({ name, sw = 1.6 }: { name: IconKey; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  )
}

interface Actor { icon: IconKey; name: string; sub: string; origin?: boolean }
interface Zone { key: 'demand' | 'dist' | 'supply'; label: string; cards: Actor[] }

const ZONES: Zone[] = [
  { key: 'demand', label: 'Demand', cards: [
    { icon: 'traveller', name: 'Travellers', sub: 'Intent · Preferences · Needs · Behaviour', origin: true },
  ] },
  { key: 'dist', label: 'Distribution & Retail', cards: [
    { icon: 'ota', name: 'OTAs', sub: 'Online Travel Agencies' },
    { icon: 'tmc', name: 'TMCs', sub: 'Travel Management Companies' },
    { icon: 'ta', name: 'Travel Agents', sub: 'Retail & Advisors' },
    { icon: 'to', name: 'Tour Operators', sub: 'Packages & Itineraries' },
    { icon: 'dmc', name: 'DMCs', sub: 'Destination Management' },
  ] },
  { key: 'supply', label: 'Supply & Aggregation', cards: [
    { icon: 'stays', name: 'Stays', sub: 'Hotels · Resorts · Villas' },
    { icon: 'act', name: 'Activities', sub: 'Tours · Experiences' },
    { icon: 'gt', name: 'Ground Transport', sub: 'Transfers · Rides' },
    { icon: 'air', name: 'Air', sub: 'Airlines · NDCs · Consolidators' },
    { icon: 'rail', name: 'Rail', sub: 'Operators & Passes' },
    { icon: 'cruise', name: 'Cruise', sub: 'Lines & Operators' },
  ] },
]

const CAPS: { icon: IconKey; name: string; sub: string }[] = [
  { icon: 'cust', name: 'Customer Intelligence', sub: 'Understand intent sooner' },
  { icon: 'prod', name: 'Product Intelligence', sub: 'Match the right product faster' },
  { icon: 'comm', name: 'Commercial Intelligence', sub: 'Uncover opportunities, drive performance' },
  { icon: 'flow', name: 'Workflow Intelligence', sub: 'Orchestrate processes seamlessly' },
]

const OUTCOMES = [
  'Understand intent sooner',
  'Match the right product faster',
  'Orchestrate workflows seamlessly',
  'Increase conversion and revenue',
  'Deliver better experiences',
]

const ARIA_LABEL =
  'Where Tripcerto sits in the connected travel journey: demand (travellers), ' +
  'distribution and retail (OTAs, TMCs, travel agents, tour operators, DMCs) and ' +
  'supply and aggregation (stays, activities, ground transport, air, rail, cruise) ' +
  'all converge into the Tripcerto intelligence and orchestration layer — customer, ' +
  'product, commercial and workflow intelligence over one unified source of truth — ' +
  'producing commercial outcomes: understand intent sooner, match the right product ' +
  'faster, orchestrate workflows seamlessly, increase conversion and revenue and ' +
  'deliver better experiences.'

/* Desktop convergence fan: 12 card anchors fanning into a centre node. */
function ConvergenceFan() {
  const n = 12, w = 1200, h = 88, cx = w / 2
  const anchors = Array.from({ length: n }, (_, i) => {
    const x = 60 + i * ((w - 120) / (n - 1))
    const d = Math.abs(x - cx) / cx
    return {
      x: Math.round(x),
      op: (0.4 - d * 0.22).toFixed(2),
      sw: (1.4 - d * 0.55).toFixed(2),
      r: Math.max(0.6, 2.6 - d * 1.1).toFixed(1),
      no: (0.5 - d * 0.25).toFixed(2),
    }
  })
  return (
    <svg className="cj-fan" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {anchors.map((a, i) => (
        <path key={`p${i}`} d={`M${a.x},0 C${a.x},${Math.round(h * 0.6)} ${cx},${Math.round(h * 0.6)} ${cx},${h}`}
          stroke="var(--gold)" strokeOpacity={a.op} strokeWidth={a.sw} fill="none" />
      ))}
      {anchors.map((a, i) => (
        <circle key={`c${i}`} cx={a.x} cy={3} r={a.r} fill="var(--gold)" fillOpacity={a.no} />
      ))}
      <circle cx={cx} cy={h - 4} r={4} fill="var(--gold)" fillOpacity={0.7} />
    </svg>
  )
}

/* Flatten the zones into an alternating left/right tributary sequence. */
function streamRibs() {
  let i = 0
  return ZONES.map((zone) => ({
    label: zone.label,
    ribs: zone.cards.map((card) => ({ card, side: (i++ % 2 === 0 ? 'l' : 'r') as 'l' | 'r' })),
  }))
}

export function ConnectedJourneyDiagram() {
  return (
    <figure className="cj reveal" role="img" aria-label={ARIA_LABEL}>
      {/* DESKTOP — converging map */}
      <div className="cj-map">
        <div className="cj-eco">
          {ZONES.map((zone) => (
            <div key={zone.key} className={`cj-zone ${zone.key}`}>
              <div className="cj-zone-label">{zone.label}</div>
              <div className="cj-grid">
                {zone.cards.map((c) => (
                  <div key={c.name} className={`cj-card${c.origin ? ' is-origin' : ''}`}>
                    <span className="cj-ic"><CjIcon name={c.icon} /></span>
                    <span className="cj-cn">{c.name}</span>
                    <span className="cj-cs">{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ConvergenceFan />
      </div>

      {/* MOBILE — tributary stream */}
      <div className="cj-stream">
        <div className="cj-ribs">
          {streamRibs().map((zone) => (
            <div key={zone.label} className="cj-stream-zone">
              <div className="cj-stream-label"><span>{zone.label}</span></div>
              {zone.ribs.map(({ card, side }) => (
                <div key={card.name} className={`cj-rib ${side}`}>
                  <div className={`cj-rib-card${card.origin ? ' is-origin' : ''}`}>
                    <span className="cj-rib-ic"><CjIcon name={card.icon} /></span>
                    <span className="cj-rib-tx">
                      <span className="cj-rib-n">{card.name}</span>
                      <span className="cj-rib-s">{card.sub}</span>
                    </span>
                  </div>
                  <span className="cj-conn" />
                  <span className="cj-node" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cj-confluence"><span className="cj-confluence-node" /><CjIcon name="down" sw={1.8} /></div>
      </div>

      {/* SHARED — the layer, the unified pill, the outcomes */}
      <div className="cj-layer">
        <div className="cj-pid">
          <div className="cj-pwm">Tripcerto</div>
          <div className="cj-ptl">The Intelligence &amp; Orchestration Layer</div>
        </div>
        <div className="cj-caps">
          {CAPS.map((c) => (
            <div key={c.name} className="cj-cap">
              <span className="cj-cap-ic"><CjIcon name={c.icon} sw={1.8} /></span>
              <span className="cj-cap-n">{c.name}</span>
              <span className="cj-cap-s">{c.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cj-pill">
        <span className="cj-pill-ic"><CjIcon name="db" sw={1.8} /></span>
        <b>Unified Travel Intelligence</b>
        <span>— one source of truth that learns and grows across the ecosystem</span>
      </div>

      <div className="cj-outcomes">
        <span className="cj-out-head">Commercial outcomes</span>
        <div className="cj-out-list">
          {OUTCOMES.map((o) => (
            <span key={o} className="cj-oc"><CjIcon name="tick" sw={2.4} />{o}</span>
          ))}
        </div>
      </div>
    </figure>
  )
}
