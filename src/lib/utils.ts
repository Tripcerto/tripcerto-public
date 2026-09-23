import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* The type roles declared as utilities in src/index.css. tailwind-merge reads
   an unknown text-* class as a colour, so without this list it would let
   text-dim evict text-lede; named here, a role and a colour sit side by side
   and two roles on one element resolve to the last. */
export const TYPE_ROLES = ['display', 'heading', 'lede', 'subhead', 'copy', 'small', 'label', 'nav', 'action'] as const

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: [...TYPE_ROLES] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
