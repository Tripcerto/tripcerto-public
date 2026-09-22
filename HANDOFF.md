# Handoff: tripcerto.com rebuild, 22 September 2026

Written by the Claude session that did the work, for whoever picks it up. Read
`~/Downloads/tripcerto-identity/` (Ember colours, cut-SVG marks),
`~/Downloads/Tripcerto-Website-Copy.pdf` (the five-page copy, strings by
reference) and Charlie's Positioning and Messaging Guide before touching copy.

## Where things are

- Repo `Tripcerto/tripcerto-public`, branch `claude/landing-ember`, pushed.
  No PR yet. Vercel auto-deploys `main`; the merge is Taylor's action, never
  the agent's.
- Dev server: `npm run dev -- --port 8091 --strictPort`. Port 8090 is taken by
  the monorepo's admin lab on Taylor's machine; do not use it.
- Gates: `npx tsc -b --noEmit`, `npm run lint`, `npx vitest run` (4 tests),
  `npm run build`. Run tsc from this repo or with its tsconfig path; a bare
  `tsc -b` from the monorepo worktree emits thousands of stray `.js` files.

## What is built

- `src/components/site/Nav.tsx`: a glass bar fixed from the top of the page
  (`bg-glass backdrop-blur-2xl`), links Engage · Workspace · Pilot · Trust, a
  moon/sun theme switch and Login on the right, a drawer below md whose rows
  sit directly under the bar inside the same glass. Its copy is paper while
  the hero is still under the bar or the page is dark, ink on a light page
  once the hero has scrolled past — an `IntersectionObserver` on `#hero` with
  the nav's height as the top root margin, and `useTheme`.
- Dark mode (Taylor, 22 Sep: "that dark glassy look"). The page surfaces are
  seven tokens in `src/index.css` — `page`, `body`, `dim`, `soft`, `line`,
  `card`, `link`, plus `glass` for the nav — and only those switch in dark
  mode; the brand colours (`ink`, `primary`, `tint`, `paper`…) never do, so
  the hero and the frames, which name brand colours and carry their own
  `dark:` classes, are untouched by the flip. Dark follows the system unless
  `<html>` carries `.light` or `.dark`; `index.html` applies the stored
  choice before first paint; `src/lib/theme.ts` reads and toggles it through
  a view transition cross-fade (0.5s) where the browser supports one. Every
  section uses the tokens (`bg-soft`, `text-dim`, `text-link`, the `glass`
  utility for panels), so a new page inherits the look by using them. The
  dark page is deep ink under a faint fixed wash of the band (`body::before`)
  so glass panels have something to blur.
- `src/components/site/Hero.tsx`: the hero Taylor chose on 22 September out of
  five candidates, all of which are now deleted. One viewport tall
  (`min-h-[100svh]`, content centred). The ground is the Ember strip from the
  identity pack — pink through coral into peach — warped by
  `src/components/ui/gradient-mesh.tsx`, a shader that domain-warps the ramp
  with drifting simplex noise so the colour itself rolls and folds; the still
  CSS strip underneath is the no-WebGL case. It is hand-written WebGL 1, not
  three.js: 5.97 kB instead of 518 kB. The context is created with
  `alpha: true` ON PURPOSE — three hardcoded that regardless of the flag you
  passed it, and an opaque canvas turns every undrawn frame (first paint, a
  resize, a lost context) into a black hole over the CSS strip. Frames are
  drawn synchronously inside the observer callbacks, which run before paint,
  and the ResizeObserver always redraws because setting `canvas.width` clears
  the buffer after that frame's draw. Context loss is handled here since the
  library is no longer doing it. Copy is paper (pill,
  headline, lede, link, `accent` button). Right of it, the two product frames,
  signed off by Taylor on 22 Sep after three candidates (real text, glyphs,
  mixed) and eight rounds on the glyph one.
- The frames, `src/components/site/frames/`. `HeroVisuals.tsx` is the
  composition: the Workspace window top right, the phone bottom left in front
  of it covering Stella's pane and hanging 12% below, both sized from the
  column so the pair keeps its shape from 375 to 1680, both rising together.
  `WorkspaceScreen.tsx` (in `WindowShell.tsx`, a glass window with a 4:3
  body, no title) and `PhoneScreen.tsx` (in `PhoneFrame.tsx`, 9:18.4) tell
  one trip without prose: bars for words, glyphs for meaning, only the
  numerals printed — the vocabulary is `glyphs.ts`, the data `story.ts`, and
  Stella is always her mark and one bar (`StellaLine.tsx`) in both. The phone
  is a conversation: two traveller bubbles, Stella's line, two activity cards
  cut from `SafariScene.tsx` (a drawn sunrise, balloons, an acacia and a
  giraffe; a real JPEG drops into the same slot), her two lines, typing dots.
  The window is the itemised list: quote and readiness up top, six rows with
  a kind icon, bars, a price and a status glyph, the gap row in coral with
  a one-shot pulse. Everything inside a frame sizes in `cqw` (the screen and
  the body are size containers), so it scales like a screenshot; the
  choreography is CSS (`animate-pop` and friends in `index.css`, each element
  timed by `--d`), nothing from JavaScript, and reduced motion shows the
  finished state. The phone's bezel and screen are PAINTED (`bg-band-frosted`
  / `bg-band-smoked`), not glass, because Taylor could see the window through
  them. In dark mode both frames are smoked ink glass. The same two screens
  sit in the Engage and Workspace sections.
- The "Two products" section (H-3) was removed at Taylor's request on 22 Sep:
  Engage and Workspace sit straight under the hero, Opportunity follows them.
  "See how it works" scrolls to `#engage`; the footer tagline is H-1-A.
- Copy in `src/content/home.ts` by PDF reference, changed strings marked
  `// changed`. H-1-A is "AI that makes complex travel easier to plan and sell"
  (Taylor, 22 Sep; he reworded it four times that afternoon, so check the file
  rather than any quote in this doc). It is also the <title>, the og
  and twitter titles, the og:image:alt and the webmanifest description — change
  all five together.
  The pill string was deleted at his request.
- Deleted once the hero was chosen: the four other candidates, `pick.ts` and
  the `?hero=` switch, the `?text=light` flag (`src/lib/review.ts`), the
  FloatingLines, FlowField, FlowPaths and Threads effects, the `ogl`
  dependency and the `text-gradient` and `text-inked` utilities. `three` stays
  for `gradient-mesh`; it is lazy-loaded, so the copy paints first, but it is
  518 kB of the build for one fullscreen quad and could be hand-rolled WebGL
  (it now is; see the hero above). The frames review page (`frames.html`) and
  the grey placeholders went with the sign-off.
  Earlier casualties: the SVG BackgroundPaths port, `motion`, the Aurora, Silk
  and Particles effects.

## Taylor's taste, in his words and mine

- "The hero should look clean", "smooth", "more opaque", "not blurry", but
  also "too harsh" when strokes were crisp 2px lines. He wants drawn lines
  with white around them, not glows, washes or fields.
- He rejected: the SVG port ("jagged", "random lines"), Aurora, Silk,
  Particles ("I hate them all"), the shader's original glow ("illegible",
  "blurry"), the demo's middle wave (removed).
- He liked: the Particles LAYOUT (now Hero), the idea of the original lines
  done smoothly, waves entering from the left.
- He picked the glass hero on the warped Ember strip with paper copy, and
  said to remove everything else. Done.
- On the frames: no prose, glyphs and bars ("it needs to look like two blank
  user messages"); the phone must not show the window through it; both
  frames animate at the same time; the chat sits at the bottom; nothing
  literal like "wow" or "profit" — a green delta and a coral gap say it.
- On the theme switch he rejected the circular reveal from the button
  ("does nothing then pops", then "I don't like that one"); a plain
  cross-fade of the whole page is what stayed.
- He does not want screenshots sent to him during tuning; he watches the
  page and says what to change. He gives changes one at a time, fast.

## Traps met

- GLSL: `half` is reserved; the shader failed to compile silently and only
  the console said so. Check the browser console after every shader edit.
- three.js `Clock` is deprecated; use `Timer` (`update()` then `getDelta()`).
- jsdom has no WebGL, ResizeObserver or 2D context: every effect returns
  early without them; `src/test/setup.ts` mocks `matchMedia` and
  `IntersectionObserver` only.
- Tailwind v4: section grids need `grid-cols-1` before `md:` columns or the
  implicit track expands on phones; `mask-b-from-85%` fades the bottom.
- The session's image reader failed on every capture from midday, so visual
  checks after the Threads round were by console, DOM measurement and Taylor's
  own eyes. The next agent should look at the page itself at 1440 and 390
  before trusting the current wave angles.

## Still to do (from the original plan)

1. CSS scroll-driven reveals for the sections below the hero (offered, not
   built). No scroll-snap — Taylor asked, and the answer was a viewport-tall
   hero and reveals instead.
2. Wave 2: Engage, Workspace, Pilot, Trust pages from the PDF with the
   Guide's changes applied, as Vite multi-page entries (own HTML and meta),
   `vercel.json` already has `cleanUrls`; nav links go live.
3. A new `public/og-image.png` in Ember (still the old cream one), a
   rewritten README. The frames are drawn, not captured, by decision; a
   real photo can replace the drawn scene in the activity cards if wanted.
4. Review wave (copy against the Guide; code, mobile, a11y), fixes, then ONE
   PR against `main`. Taylor merges.
