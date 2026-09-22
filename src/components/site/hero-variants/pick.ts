import type { ComponentType } from 'react'
import { Hero } from '@/components/site/Hero'
import { HeroAurora } from '@/components/site/hero-variants/HeroAurora'
import { HeroParticles } from '@/components/site/hero-variants/HeroParticles'
import { HeroSilk } from '@/components/site/hero-variants/HeroSilk'

/* Review scaffolding: `?hero=aurora|silk|particles` swaps the hero so the
   candidates can be compared on one page. Removed once one is chosen. */
const VARIANTS: Record<string, ComponentType> = {
  aurora: HeroAurora,
  silk: HeroSilk,
  particles: HeroParticles,
}

export function pickHero(search: string): ComponentType {
  const key = new URLSearchParams(search).get('hero')
  return (key && VARIANTS[key]) || Hero
}
