import { Tent } from 'lucide-react'
import type { Glyph } from '@/components/site/frames/glyphs'
import { BalloonGlyph } from '@/components/site/frames/SafariScene'

/* The icon on each of the phone's recommendation cards, by kind. */
export const KIND_ICON = {
  Stay: Tent,
  Experience: BalloonGlyph,
} as const satisfies Record<string, Glyph>
