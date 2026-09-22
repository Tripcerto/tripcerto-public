import type { ComponentType } from 'react'
import { Hero } from '@/components/site/Hero'
import { HeroFlow } from '@/components/site/hero-variants/HeroFlow'
import { HeroLines } from '@/components/site/hero-variants/HeroLines'
import { HeroThreads } from '@/components/site/hero-variants/HeroThreads'

/* Review scaffolding: `?hero=lines|flow|threads` swaps the hero so the
   candidates can be compared on one page. Removed once one is chosen. */
const VARIANTS: Record<string, ComponentType> = {
  lines: HeroLines,
  flow: HeroFlow,
  threads: HeroThreads,
}

export function pickHero(search: string): ComponentType {
  const key = new URLSearchParams(search).get('hero')
  return (key && VARIANTS[key]) || Hero
}
