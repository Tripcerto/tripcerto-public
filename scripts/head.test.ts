import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/* What a crawler or an AI assistant reads about each page before it reads
   the page: the description, the canonical address, the structured data and
   llms.txt. The structured data and llms.txt repeat each page's description,
   so they are checked against it rather than trusted to be edited with it. */

const ROOT = join(import.meta.dirname, '..')
const SITE = 'https://www.tripcerto.com'
const read = (p: string) => readFileSync(p, 'utf8')

/* The pages are the build's entries, read from vite.config.ts as written:
   importing the config here resolves its URLs against jsdom's. */
const INPUT = read(join(ROOT, 'vite.config.ts')).match(/input: \{([\s\S]*?)\n {6}\}/)?.[1] ?? ''
const ENTRIES = [...INPUT.matchAll(/(\w+): fileURLToPath\(new URL\('\.\/([^']+)'/g)].map(([, name, file]) => {
  const path = file.replace(/index\.html$/, '').replace(/\/$/, '')
  return { name, html: read(join(ROOT, file)), url: `${SITE}/${path}` }
})

const description = (html: string) => html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]
const structured = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))

it('reads every entry, one for each page the sitemap lists', () => {
  expect(ENTRIES.length).toBeGreaterThan(0)
  expect(ENTRIES).toHaveLength(read(join(ROOT, 'public/sitemap.xml')).match(/<loc>/g)?.length ?? 0)
})

describe.each(ENTRIES)('the $name head', ({ html, url }) => {
  it('describes the page and names its address', () => {
    expect(description(html)?.length ?? 0).toBeGreaterThan(40)
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    expect(canonical?.replace(/\/$/, '')).toBe(url.replace(/\/$/, ''))
  })

  it('carries structured data that says what the description says', () => {
    for (const data of structured(html)) {
      const nodes = data['@graph'] ?? [data]
      for (const node of nodes) if (node.description) expect(node.description).toContain(description(html))
    }
  })
})

describe('the crawl files', () => {
  it('lists every page in the sitemap', () => {
    const sitemap = read(join(ROOT, 'public/sitemap.xml'))
    for (const { url } of ENTRIES) expect(sitemap).toContain(`<loc>${url}</loc>`)
  })

  it('gives every page in llms.txt the description the page carries', () => {
    const llms = read(join(ROOT, 'public/llms.txt'))
    expect(llms.startsWith('# Tripcerto\n')).toBe(true)
    for (const { html, url } of ENTRIES) {
      if (url === `${SITE}/`) {
        expect(llms).toContain(`\n${description(html)}\n`)
        continue
      }
      const line = llms.split('\n').find((l) => l.includes(`](${url}):`))
      expect(line?.split(`](${url}): `)[1]).toBe(description(html))
    }
  })

  it('keeps one IndexNow key at the root, whose content is its own name', () => {
    const keys = readdirSync(join(ROOT, 'public')).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
    expect(keys).toHaveLength(1)
    expect(read(join(ROOT, 'public', keys[0]))).toBe(keys[0].replace('.txt', ''))
  })

  it('points crawlers at the sitemap and shuts none out', () => {
    const robots = read(join(ROOT, 'public/robots.txt'))
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
    expect(robots).not.toMatch(/^Disallow: \/\s*$/m)
  })
})
