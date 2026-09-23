import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/* The marks and the brand kit, checked against each other and against the
   theme, because the failures here are the ones that look like design rather
   than like a bug and so survive a read-through.

   The one that got out: the kit drew the wordmark without the even-odd fill
   rule. The counters of the p, the e and the o filled solid, which reads as a
   heavier weight rather than as an error, and it shipped. */

const ROOT = join(import.meta.dirname, '../..')
const BRAND = join(ROOT, 'public/brand')
const KIT = join(ROOT, 'scripts/brand/tripcerto-brand-kit.html')

const MARKS = ['wordmark', 'monogram', 'appicon']

const read = (p: string) => readFileSync(p, 'utf8')

describe('the marks', () => {
  it.each(MARKS)('%s.svg is one path that declares its fill rule', (name) => {
    const svg = read(join(BRAND, `${name}.svg`))
    expect(svg.match(/<path/g) ?? []).toHaveLength(1)
    expect(svg).toMatch(/fill-rule="evenodd"/)
  })

  it.each(MARKS)('%s-white.svg is the same drawing in white', (name) => {
    const ink = read(join(BRAND, `${name}.svg`))
    const white = read(join(BRAND, `${name}-white.svg`))
    const path = (s: string) => s.match(/<path[^>]*\sd="([^"]+)"/)?.[1]
    expect(path(white)).toBe(path(ink))
    expect(white).toMatch(/fill="#FFFFFF"/i)
    expect(white).toMatch(/fill-rule="evenodd"/)
  })
})

describe('the favicon', () => {
  it('fills the cut tc with paper, drawn under the tile and inside its edge', () => {
    /* The artwork's tc is a hole. In a browser tab a hole shows the tab bar,
       so on a dark one the tc read black (23 Sep). */
    const svg = read(join(ROOT, 'public/favicon.svg'))
    const tile = read(join(BRAND, 'appicon.svg')).match(/\sd="([^"]+)"/)?.[1] ?? ''
    const outline = tile.slice(0, tile.indexOf('Z') + 1)
    const paper = svg.match(/<g transform="translate\(([\d.]+) \1\) scale\((0\.\d+)\)"><path d="([^"]+)" fill="#FFFFFF"\/><\/g>/)
    expect(paper, 'no paper under the tile').toBeTruthy()
    expect(paper?.[3]).toBe(outline)
    expect(svg.indexOf(paper?.[0] ?? '')).toBeLessThan(svg.indexOf(`d="${tile}"`))
    const scale = Number(paper?.[2])
    expect(scale).toBeLessThan(1)
    const side = Number(svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) [\d.]+"/)?.[1])
    expect(Number(paper?.[1]), 'paper off centre').toBeCloseTo((side * (1 - scale)) / 2, 6)
  })
})

describe('the brand kit', () => {
  const kit = read(KIT)

  it('draws no mark without a fill rule', () => {
    /* Every <svg aria-label="tripcerto"> in the kit is a mark. A path inside
       one that carries no fill-rule is a filled counter waiting to happen. */
    const marks = kit.match(/<svg[^>]*aria-label="tripcerto"[^>]*>.*?<\/svg>/g) ?? []
    expect(marks.length).toBeGreaterThan(0)
    const bare = marks.filter((m: string) => !/<path[^>]*fill-rule=/.test(m))
    expect(bare).toEqual([])
  })

  it('states the palette the theme actually declares', () => {
    const css = read(join(ROOT, 'src/index.css'))
    const token = (name: string) =>
      css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toUpperCase()

    /* A hand-edit of the generated file, or a token moved without rebuilding
       it, both land here rather than in front of a partner. */
    for (const name of ['ink', 'primary', 'accent', 'tint', 'pink', 'peach', 'muted', 'rule', 'up']) {
      const hex = token(name)
      expect(hex, `src/index.css declares no --color-${name}`).toBeTruthy()
      expect(kit, `the kit does not carry ${name} ${hex}`).toContain(hex)
    }
  })

  it('leads with the artwork, then the words', () => {
    /* The order is the point of the document: a reader meets the logo, the
       icon, the band and the colour before a paragraph of rules. */
    const ids = [...kit.matchAll(/<section id="([a-z]+)"/g)].map((m) => m[1])
    expect(ids).toEqual(['logo', 'band', 'colour', 'type', 'voice', 'files'])
  })

  it('shows the shader, not a still that approximates it', () => {
    /* The three grounds in the logo section and the two band plates all sit
       on a rendered frame. A CSS gradient there would be a different image
       from the one the site paints. */
    expect(kit).toMatch(/--bandshot:url\(data:image\/png/)
    expect(kit).toMatch(/--bandtall:url\(data:image\/png/)
    expect(kit).toContain('background-image:var(--bandtall)')
  })

  it('shows the app icon files, at the sizes they are met at', () => {
    const shown = [...kit.matchAll(/<img src="data:image\/png[^"]+" width="(\d+)"/g)].map((m) => Number(m[1]))
    for (const px of [104, 72, 48, 32, 16]) expect(shown).toContain(px)
  })

  it('names the same icon ground the shipped set is built from', () => {
    /* The tiles in the document are the files in public/ only while these
       agree. They are two places, so a test holds them together. */
    const command = kit.match(/node scripts\/og\/build-icons\.mjs --ground mesh --scale [\d.]+ --seed [\d.,]+/)?.[0]
    expect(command, 'the kit states no icon build command').toBeTruthy()
    expect(read(join(ROOT, 'scripts/og/build-icons.mjs'))).toContain(command as string)
  })

  it('carries no em dash, which is the rule it states', () => {
    /* The kit's own voice section bans them. A document that breaks its own
       rule in its own prose is not a rule. */
    expect(kit).not.toContain('—')
  })
})

describe('ink', () => {
  const css = read(join(ROOT, 'src/index.css'))
  const ink = css.match(/--color-ink:\s*(#[0-9a-fA-F]{6})/)?.[1] as string

  it('is a purple, not a brown', () => {
    /* A dark colour whose red channel leads its blue reads warm whatever its
       hue number says. Ink is the one colour on the site that has to stay on
       the cool side of that line, and it has been reported as brown three
       times. Blue leads red, or this fails. */
    const [r, , b] = [1, 3, 5].map((i) => parseInt(ink.slice(i, i + 2), 16))
    expect(b, `ink ${ink} has red ${r} against blue ${b}`).toBeGreaterThan(r)
  })

  it('is the same colour in the artwork as in the theme', () => {
    for (const name of MARKS) {
      expect(read(join(BRAND, `${name}.svg`)).toUpperCase()).toContain(ink.toUpperCase())
    }
  })
})
