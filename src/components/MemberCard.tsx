import { ILinkedIn } from './icons'

interface MemberCardProps {
  initials: string
  name: string
  role: string
  bio: string
  linkedin: string
}

export function MemberCard({ initials, name, role, bio, linkedin }: MemberCardProps) {
  return (
    <div className="member">
      <div className="avatar">{initials}</div>
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
    </div>
  )
}
