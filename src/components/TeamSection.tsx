import { MemberCard } from './MemberCard'

const MEMBERS = [
  {
    initials: 'CP',
    name: 'Charlie Potter',
    role: 'Chief Executive Officer',
    bio: 'Commercial lead, focused on travel operators, partnerships and go-to-market.',
    linkedin: 'https://www.linkedin.com/in/charlie-p-94383329/',
  },
  {
    initials: 'TS',
    name: 'Taylor Styles',
    role: 'Chief Technology Officer',
    bio: "Product and engineering lead, building Stella's orchestration, matching and integration layer.",
    linkedin: 'https://www.linkedin.com/in/taystyles/',
  },
  {
    initials: 'NC',
    name: 'Nigel Clarke',
    role: 'Non-Executive Director',
    bio: 'Travel, growth and board advisor, supporting commercial strategy.',
    linkedin: 'https://www.linkedin.com/in/nigelclarke100/',
  },
]

export function TeamSection() {
  return (
    <section id="company" className="band-close">
      <div className="shell">
        <div className="section-header reveal">
          <span className="eyebrow">
            <span className="dot" />
            Who we are
          </span>
          <h2 className="section-title">A small team building serious infrastructure.</h2>
          <p className="section-sub">
            Travel and engineering operators who&rsquo;ve felt the friction first-hand — now building the
            layer that removes it.
          </p>
        </div>
        <div className="team-grid">
          {MEMBERS.map((m, i) => (
            <MemberCard key={m.name} index={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  )
}
