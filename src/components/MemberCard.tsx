import type { CSSProperties } from 'react'
import { ILinkedIn } from './icons'

interface MemberCardProps {
  initials: string
  name: string
  role: string
  bio: string
  linkedin: string
  index?: number
}

export function MemberCard({ initials, name, role, bio, linkedin, index = 0 }: MemberCardProps) {
  // `.member` is the scroll-reveal wrapper (staggered via --i); `.member-card`
  // owns the visual chrome + hover lift so the two transforms never collide.
  return (
    <div className="member reveal" style={{ '--i': index } as CSSProperties}>
      <article className="member-card">
        <div className="member-top">
          <div className="avatar" aria-hidden="true">
            {initials}
          </div>
          <span className="member-idx" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <span className="nm">{name}</span>
        <span className="rl">{role}</span>
        <p className="bio">{bio}</p>
        <a
          className="li"
          href={linkedin}
          target="_blank"
          rel="noopener"
          aria-label={`${name} on LinkedIn`}
        >
          <ILinkedIn className="li-ic" size={15} />
          <span>LinkedIn</span>
        </a>
      </article>
    </div>
  )
}
