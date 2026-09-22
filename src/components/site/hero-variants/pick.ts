import type { ComponentType } from 'react'
import { Hero } from '@/components/site/Hero'

/* Review scaffolding: `?hero=<name>` swaps the hero so the candidates can be
   compared on one page. Removed once one is chosen. */
const VARIANTS: Record<string, ComponentType> = {}

export function pickHero(search: string): ComponentType {
  const key = new URLSearchParams(search).get('hero')
  return (key && VARIANTS[key]) || Hero
}
