import type { LucideIcon } from 'lucide-react'
import { BadgePoundSterling, ClipboardCheck, Compass, Handshake, Megaphone, ServerCog } from 'lucide-react'
import type { home } from '@/content/home'

export type Role = (typeof home.audience.roles)[number]['role']

export const ROLE_GLYPH: Record<Role, LucideIcon> = {
  Sales: Handshake,
  Marketing: Megaphone,
  Operations: ClipboardCheck,
  Technology: ServerCog,
  Finance: BadgePoundSterling,
  'The travel expert': Compass,
}
