import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RUN } from '../src/components/site/frames/trip'

/* The Workspace frame's steps tick the moment the itinerary's entrance they
   wait on has finished, which the story's clock works out from RUN. This
   holds RUN to the durations the utilities actually run for. */

const css = readFileSync(join(import.meta.dirname, '../src/index.css'), 'utf8')

describe('the Workspace frame’s clock', () => {
  it.each(Object.entries(RUN))('runs animate-%s for as long as the clock allows (%ss)', (name, seconds) => {
    const hit = css.match(new RegExp(`@utility animate-${name} \\{\\n\\s+animation: ${name} ([\\d.]+)s`))
    expect(Number(hit?.[1])).toBe(seconds)
  })
})
