import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import { MessageCircle } from 'lucide-react'

export type Glyph = ComponentType<{ className?: string }>

/* The product's glyph where a frame names it: Engage, on what the
   itinerary marks as picked in the chat. */
export const PRODUCT_GLYPH = {
  Engage: MessageCircle,
} as const satisfies Record<string, LucideIcon>
