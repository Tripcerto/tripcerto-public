import type { ComponentType } from 'react'
import { BedDouble, Car, Check, Clock, Plane, Plus, TrendingUp, TriangleAlert } from 'lucide-react'
import { BalloonGlyph } from '@/components/site/frames/SafariScene'
import type { Kind, Status } from '@/components/site/frames/story'

/* The frames tell the trip without prose: bars stand for words, glyphs
   carry the meaning, and the only characters are the story's numerals.
   Every class here has its smoked counterpart for dark mode. */

export type Glyph = ComponentType<{ className?: string }>

export const KIND_GLYPH: Record<Kind, Glyph> = {
  stay: BedDouble,
  transfer: Car,
  activity: BalloonGlyph,
  flight: Plane,
  gap: TriangleAlert,
}

export const STATUS_GLYPH: Record<Status, Glyph> = {
  confirmed: Check,
  held: TrendingUp,
  pending: Clock,
  gap: Plus,
}

export const STATUS_TONE: Record<Status, string> = {
  confirmed: 'bg-up/15 text-up dark:bg-up dark:text-paper',
  held: 'bg-up/15 text-up dark:bg-up dark:text-paper',
  pending: 'bg-ink/[0.06] text-muted dark:bg-white/10 dark:text-paper/50',
  gap: 'bg-primary text-paper',
}

export const BAR = 'bg-ink/15 dark:bg-white/30'
export const BAR_FAINT = 'bg-ink/10 dark:bg-white/20'
