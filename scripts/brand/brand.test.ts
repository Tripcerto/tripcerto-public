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
