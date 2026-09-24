// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import config, { renderPage } from '../vite.config'
import { home } from '../src/content/home'
import { engage } from '../src/content/engage'
import { workspace } from '../src/content/workspace'
import { pilot } from '../src/content/pilot'
import { faq } from '../src/content/faq'
import { about } from '../src/content/about'
import { trust } from '../src/content/trust'

/* Every page the build ships, rendered the way the build renders it: the
   HTML file's entry script, its default export, src/prerender.tsx. This
   file runs with no window and no document, so a page that reads either
   while it renders fails here, as it would fail the build. */

const ROOT = join(import.meta.dirname, '..')
const load = (id: string) => import(/* @vite-ignore */ join(ROOT, id))

const input = config.build?.rolldownOptions?.input
if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('vite.config.ts names its entries in an object')

/* The headline each page's h1 carries, by entry. */
const H1: Record<string, string> = {
  home: home.hero['H-1-A'],
  engage: engage.hero['E-1-A'],
  workspace: workspace.hero['W-1-A'],
  pilot: pilot.hero['P-1-A'],
  faq: faq.hero['F-1-A'],
  about: about.hero['A-1-A'],
  trust: trust.hero['T-1-A'].join(' '),
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
}

const ENTITY: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'" }

/* The text of every h1 in the markup, as a reader sees it. */
function headlines(markup: string) {
  return [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(([, inner]) =>
    inner
      .replace(/<[^>]*>/g, '')
      .replace(/&(?:amp|lt|gt|quot|#x27);/g, (entity) => ENTITY[entity])
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

it('has a headline for every entry the build ships', () => {
  expect(Object.keys(input).sort()).toEqual(Object.keys(H1).sort())
})

describe.each(Object.entries(input))('the %s page', (name, file) => {
  it('renders on the server with its one headline', async () => {
    expect('window' in globalThis).toBe(false)
    expect('document' in globalThis).toBe(false)
    const markup = await renderPage(file, load)
    expect(headlines(markup)).toEqual([H1[name]])
  })

  it('renders the nav, the page and the footer', async () => {
    const markup = await renderPage(file, load)
    expect(markup).toContain('<header')
    expect(markup).toContain('<main')
    expect(markup).toContain('<footer')
  })
})
