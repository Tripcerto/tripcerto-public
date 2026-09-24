import { ArrowUpRight } from 'lucide-react'
import type { Founder } from '@/content/about'
import { cn } from '@/lib/utils'

/* A founder's portrait, or until the photograph is in public/team/ the
   founder's initials in paper on the band: the same disc either way, so
   dropping a photo in changes nothing around it. */
function Portrait({ name, photo, size }: { name: string; photo?: string; size: 'brief' | 'full' }) {
  const box = size === 'full' ? 'size-28 md:size-32' : 'size-20 md:size-24'
  if (photo) {
    return <img src={photo} alt={name} width={256} height={256} loading="lazy" decoding="async" className={cn(box, 'shrink-0 rounded-full object-cover')} />
  }
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
  return (
    <div aria-hidden className={cn(box, 'bg-band flex shrink-0 items-center justify-center rounded-full text-heading text-paper')}>
      {initials}
    </div>
  )
}

/* The two founders as tiles of the site's glass, side by side from md: the
   portrait, the name and the role beside it, then a line on the home page
   or the whole bio on About, and the founder's LinkedIn under it. */
export function Founders({ founders, detail }: { founders: readonly Founder[]; detail: 'brief' | 'full' }) {
  return (
    <ul role="list" className="mx-auto grid max-w-[64rem] grid-cols-1 gap-6 md:grid-cols-2">
      {founders.map((founder) => (
        <li key={founder.name} className="glass flex flex-col rounded-xl p-6 shadow-card md:p-8">
          <div className="flex items-center gap-5">
            <Portrait name={founder.name} photo={founder.photo} size={detail} />
            <div className="min-w-0">
              <h3 className="text-subhead">{founder.name}</h3>
              <p className="mt-0.5 text-small text-dim">{founder.role}</p>
            </div>
          </div>
          <p className="mt-5 text-copy text-dim">{detail === 'full' ? founder.bio : founder.line}</p>
          <a
            href={founder.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center gap-1 self-start pt-3 text-small text-link underline-offset-4 hover:underline"
          >
            LinkedIn
            <span className="sr-only">: {founder.name} (opens in a new tab)</span>
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
