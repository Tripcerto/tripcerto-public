import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { TYPE_ROLES } from '../src/lib/utils'

/* The type scale is the roles in src/index.css and nothing else. These hold
   it there: tailwind-merge knows every role the CSS declares, and no
   component outside the product frames sets a size, a weight, a case or a
   tracking of its own, which is how the site came to carry thirteen sizes. */

const SRC = join(import.meta.dirname, '../src')
const css = readFileSync(join(SRC, 'index.css'), 'utf8')

/* A role is a text-* utility that sets a size; text-shimmer, a colour, is not. */
const declared = [...css.matchAll(/^@utility text-([a-z]+) \{\n\s+font-size:/gm)].map((m) => m[1])

/* Every .tsx and .ts under src, but the frames, which are drawn to their own
   width and keep their own scale in frames/type.ts, and the tests. */
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === 'frames' ? [] : sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

/* A size from Tailwind's own scale or typed by hand, a weight, capitals, or
   letter-spacing. `text-[length:min(1em,…)]` is not a size: it only lets a
   title line shrink to fit a narrow phone. */
const HAND_SET = /\b(?:text-(?:xs|sm|base|lg|[2-9]?xl)|text-\[(?!length:min\()[^\]]+\]|font-(?:thin|light|normal|medium|semibold|bold|extrabold|black)|uppercase|lowercase|capitalize|tracking-\S+)(?=[\s'"`])/g

describe('the type scale', () => {
  it('declares its roles once, and tailwind-merge knows every one', () => {
    expect(declared).toEqual([...TYPE_ROLES])
  })

  it('is the only way text outside the frames is sized, weighted, cased or spaced', () => {
    const found = sources(SRC).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .flatMap((line, i) => [...line.matchAll(HAND_SET)].map((m) => `${relative(SRC, file)}:${i + 1} ${m[0]}`)),
    )
    expect(found).toEqual([])
  })
})
