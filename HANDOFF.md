# Handoff: tripcerto.com rebuild, 22 September 2026

Written by the Claude session that did the work, for whoever picks it up. Read
`~/Downloads/tripcerto-identity/` (Ember colours, cut-SVG marks),
`~/Downloads/Tripcerto-Website-Copy.pdf` (the five-page copy, strings by
reference) and Charlie's Positioning and Messaging Guide before touching copy.

## Where things are

- Repo `Tripcerto/tripcerto-public`, branch `claude/landing-ember`, pushed.
  Commits, oldest first: `c5ead06` home rebuilt in Ember on the Stripe layout ·
  `2c19dae` shader waves, Pilot into the nav, glass nav, new headline ·
  `8aa4049` hero takes the split layout, loses the pill · `7e9637d` three
  line-based candidates · `5f05c5e` blur knobs · `b66890c` `7d48df8` `b65f960`
  `4005af3` wave path tuning. No PR yet. Vercel auto-deploys `main`; the merge
  is Taylor's action, never the agent's.
- Dev server: `npm run dev -- --port 8091 --strictPort`. Port 8090 is taken by
  the monorepo's admin lab on Taylor's machine; do not use it.
- Gates, all green at `4005af3`: `npx tsc -b`, `npm run lint`,
  `npx vitest run` (13 tests), `npm run build`. Run tsc from this repo or with
  its tsconfig path; a bare `tsc -b` from the monorepo worktree emits
  thousands of stray `.js` files.

## What is built

- `src/components/site/Nav.tsx`: glass from the top of the page
  (`bg-paper/80 backdrop-blur-2xl`), links Engage · Workspace · Pilot · Trust,
  Login alone on the right, mobile menu. Taylor moved Pilot into the nav; the
  PDF had it as a pill.
- `src/components/site/Hero.tsx`: split layout Taylor chose (copy left, window
  tilted four degrees with the phone straight in front, no pill). Takes a
  `background` prop so an effect can be swapped without touching the layout.
  Default background is the waves (below).
- `src/components/ui/floating-lines.tsx`: React Bits FloatingLines shader
  ported to strict TypeScript on three.js. Light mode is our own: a stroke
  with `lineWidth`, `lineBlur`, `lineOpacity` composited over a transparent
  canvas. Extra knobs: `mirror` (flip, pointer bend flips with it), `swirl`
  (0 straight tilt, 1 the original curl), `sameDirection` (top wave runs with
  the others). Pointer read from `window`; loop pauses off-screen; reduced
  motion gets a still frame; no WebGL means no canvas.
- Hero wave config in `Hero.tsx`: `TOP_WAVE` and `BOTTOM_WAVE` (`y` height at
  centre, positive up; `rotate` tilt in radians, negative descends to the
  right under mirror), no middle wave, `swirl` 0, `mirror` on, `sameDirection`.
  Current path (22 Sep, late): both bands enter LOW on the left and rise to
  the right, and the shader now weights every family equally in both modes
  (the original's 0.85/0.75 light and 0.2/1/0.1 dark multipliers are gone);
  `glowSpread` and `glowHaze` tune the dark-mode glow. Taylor asked for the
  bottom-left-to-top-right sweep on EVERY candidate, so `lines` (angle now
  negative), `flow` (baseAngle negative), `threads` (box tilted) and `band`
  all rise the same way.
- Four candidates behind `?hero=`, wired in
  `src/components/site/hero-variants/pick.ts`: `lines` (SVG, true parallel
  offsets of one master curve, seamless drift, geometry test),
  `flow` (canvas streamlines of a seeded noise field; `glow` and `glowOpacity`
  draw an in-canvas halo under each line, because a CSS blur on the canvas
  rasterised coarsely and Taylor read it as pixelated),
  `threads` (React Bits Threads on ogl, transparent, `lineBlur` and `distance`),
  `band` (`HeroBand.tsx`, its own layout: the whole hero is an Ember gradient
  band, pink to cream to white, lit by drifting radial lights and the
  FloatingLines shader in screen-blended glow mode; the headline is
  `text-inked` multiplied into the band; the Workspace window is glass with a
  translucent Stella pane and runs off the right edge, the phone in front).
  The first three are `<Hero background={...} />` plus a helper under
  `src/components/ui/`. On 22 Sep pm Taylor said of `band`: "This is getting
  close. I like this." It was built to his Stripe-home reference; he asked
  for the whole hero coloured (no diagonal), lighter, then no orange, then no
  peach or cream at all. `?tone=coral|rose|wine|mist` (in `HeroBand.tsx`)
  offers four peach-free gradients from the palette, coral the default. The
  band's waves are TWO families on the two lines Taylor drew (22 Sep, late):
  `STEEP_WAVE` rising ~36 degrees from the bottom-left corner through the
  headline, `SHALLOW_WAVE` lower, rising ~21 degrees; layer opacity 0.55,
  `glowSpread` 0.003, no haze. He then said: stop updating the other
  candidates, `band` is the one being worked.
- `glass` (`HeroGlass.tsx`, `?hero=glass`) is the ONE copy of `band` he then
  asked for, combining two notes: Ember's peach as the base colour ("that
  pink is too brash", quoted from someone else) and the `flow` streamlines
  in place of the shader waves, rising bottom-left to top-right as thick,
  near-opaque white strands with a halo (`FlowField` gained an `angle` prop
  for it). No tone switch; `band` is untouched. Taylor then went off the
  strands ("too noisy") and the pink, and settled the ground on the Ember
  strip itself, pink through coral into peach (`--band`), with two faint
  diagonal sheens and no lines. Layout on his notes: phone overlapping
  Stella's pane of the window, the pair centred in its column and level with
  the copy, equal space above and below. Then (22 Sep, late): the sheens
  read as "white lines", so the ground became `src/components/ui/gradient-mesh.tsx`,
  a three.js shader that noise-warps the Ember stops so the gradient itself
  rolls (still CSS strip beneath for no-WebGL); the headline is solid ink
  ("black glass" then "just solid"); the nav is glass (`bg-white/30`, all
  variants); the hero container runs wider than the shell at xl/2xl with a
  16:9 window body so copy and visuals spread apart on desktop. Later still:
  the hero is one viewport tall (`min-h-[100svh]`, content centred); the
  phone is back on PIXEL widths (190/230/244/270) with the composition given
  a min-height so it never clips, and `aspect-[9/18]` so it is a touch
  shorter; the notch is a Dynamic Island (`PhoneFrame`, shared); `?text=light`
  inverts the copy to paper (pill, headline, lede, link, `accent` button) so
  Charlie can compare a white and a black version. Taylor asked about
  scroll-snap / orchestrated scrolling; the answer given was: no snap, a
  viewport-tall hero and CSS scroll-driven reveals (see the chat).
- The "Two products" section (H-3) was removed at Taylor's request on 22 Sep:
  Engage and Workspace sit straight under the hero, Opportunity follows them.
  "See how it works" scrolls to `#engage`; the footer tagline is H-1-A.
- Copy in `src/content/home.ts` by PDF reference, changed strings marked
  `// changed`. H-1-A is "Travel AI that turns research into bookings" (Taylor).
  The pill string was deleted at his request.
- `text-gradient` utility pads the bottom so descenders are not cut.
- Deleted this session: the SVG BackgroundPaths port, `motion`, the Aurora,
  Silk and Particles effects. `three` and `ogl` are dependencies.

## Taylor's taste, in his words and mine

- "The hero should look clean", "smooth", "more opaque", "not blurry", but
  also "too harsh" when strokes were crisp 2px lines. He wants drawn lines
  with white around them, not glows, washes or fields.
- He rejected: the SVG port ("jagged", "random lines"), Aurora, Silk,
  Particles ("I hate them all"), the shader's original glow ("illegible",
  "blurry"), the demo's middle wave (removed).
- He liked: the Particles LAYOUT (now Hero), the idea of the original lines
  done smoothly, waves entering from the left.
- Last state of mind: "still not very happy with a lot of these", and his
  favourite was cut off mid-sentence. Ask him which before deleting any
  candidate. Once he picks: that effect becomes the default background, the
  other candidates, their helpers and `pick.ts` plus the `pickHero` call in
  `App.tsx` are deleted, and unused dependencies (`ogl` or `three`) go.
- He does not want screenshots sent to him during tuning; he watches the
  page and says what to change. He gives changes one at a time, fast.

## Traps met

- GLSL: `half` is reserved; the shader failed to compile silently and only
  the console said so. Check the browser console after every shader edit.
- three.js `Clock` is deprecated; use `Timer` (`update()` then `getDelta()`).
- jsdom has no WebGL, ResizeObserver or 2D context: every effect returns
  early without them; `src/test/setup.ts` mocks `matchMedia` and
  `IntersectionObserver` only.
- The React Bits demo configs assume black: on white, light mode floods the
  canvas and dark mode's `screen` blend vanishes. Densities must be our own.
- Tailwind v4: section grids need `grid-cols-1` before `md:` columns or the
  implicit track expands on phones; `mask-b-from-85%` fades the bottom.
- The session's image reader failed on every capture from midday, so visual
  checks after the Threads round were by console, DOM measurement and Taylor's
  own eyes. The next agent should look at the page itself at 1440 and 390
  before trusting the current wave angles.

## Still to do (from the original plan)

1. Taylor picks a hero background; remove the rest as above.
2. Wave 2: Engage, Workspace, Pilot, Trust pages from the PDF with the
   Guide's changes applied, as Vite multi-page entries (own HTML and meta),
   `vercel.json` already has `cleanUrls`; nav links go live.
3. Taylor's real Engage and Workspace screens for the frames (placeholders
   now), a new `public/og-image.png` in Ember (still the old cream one), a
   rewritten README.
4. Review wave (copy against the Guide; code, mobile, a11y), fixes, then ONE
   PR against `main`. Taylor merges.
