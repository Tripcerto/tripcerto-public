/* Builds tripcerto-identity-v3.html.

   V3 is V2 with everything that was not decided taken out, and the three
   things that were decided elsewhere put in.

   OUT of V2: the proof section, which was five base64 photographs of the
   original render with the new artwork stroked over them in #FF2D95 — an
   argument for the rebuild, made and won, and 893 of the file's 933 KB. With
   it go the three palettes that were never chosen, the geometry QA table and
   the lede that called colour "a set of options, not a decision".

   IN: typography, which V2 had no section for at all; how we write and how
   Stella speaks, which until now lived only in a partners README, an enforced
   test and a system prompt; and the icon and social set as built.

   The marks are not redrawn and not re-exported. Their path data is read out
   of public/brand/*.svg at build time and inlined once, so this file cannot
   disagree with what the site serves. Contrast ratios are computed here
   rather than asserted, for the same reason.

   Run from the repo root: node scripts/brand/build-identity-v3.mjs
*/

import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const BRAND = join(ROOT, 'public/brand')
const OUT = join(ROOT, 'scripts/brand/tripcerto-identity-v3.html')

const SIGNED = '22 September 2026'

/* ---- The palette, as src/index.css @theme carries it -------------------- */

const EMBER = {
  ink: '#2B1220',
  primary: '#FF5C6C',
  accent: '#FF7A5C',
  tint: '#FFF1EA',
}
const BAND = ['#E8437E', '#FF5C6C', '#FF9B7A']
const WORKING = {
  paper: '#FFFFFF',
  pink: '#E8437E',
  peach: '#FF9B7A',
  muted: '#6E5A60',
  rule: '#F0DCD4',
  up: '#1F9D63',
  night: '#1C0C15',
}

/* ---- Contrast, computed --------------------------------------------------
   WCAG 2.1 relative luminance. Printed beside each pairing so a colour that
   stops clearing 4.5:1 says so here rather than in an audit. */

const channel = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const contrast = (fg, bg) => {
  const r = ratio(fg, bg)
  return { value: r.toFixed(2), body: r >= 4.5, large: r >= 3 }
}

/* ---- The marks, read from what the site serves -------------------------- */

async function mark(file) {
  const svg = await readFile(join(BRAND, file), 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)?.[1]
  const evenodd = /fill-rule="evenodd"/.test(svg)
  if (!viewBox || !d) throw new Error(`${file}: no viewBox or path found`)
  const [, , w, h] = viewBox.split(/\s+/).map(Number)
  return { viewBox, d, evenodd, aspect: w / h }
}

const wordmark = await mark('wordmark.svg')
const monogram = await mark('monogram.svg')
const appicon = await mark('appicon.svg')

/* The tile's corner radius, measured off the artwork rather than quoted: the
   first arc radius in the app icon path over the tile's width. */
const arc = Number(appicon.d.match(/A\s*([\d.]+)/)?.[1])
const tileWidth = Number(appicon.viewBox.split(/\s+/)[2])
const radiusRatio = arc / tileWidth

const use = (m, { fill, size, height, className = '' }) => {
  const w = size ?? Math.round((height ?? 100) * m.aspect)
  const h = height ?? Math.round((size ?? 100) / m.aspect)
  return `<svg class="${className}" viewBox="${m.viewBox}" width="${w}" height="${h}" role="img" aria-label="tripcerto"><path d="${m.d}" fill="${fill}"${m.evenodd ? ' fill-rule="evenodd"' : ''}/></svg>`
}

/* The app icon rendered as a tile: the mark knocked out of a coral square,
   with the radius the artwork itself carries. */
const tile = (px, fill = EMBER.primary) =>
  `<svg viewBox="${appicon.viewBox}" width="${px}" height="${px}" role="img" aria-label="tripcerto"><path d="${appicon.d}" fill="${fill}" fill-rule="evenodd"/></svg>`

const sw = (name, hex, on) => {
  const fg = on === 'ink' ? EMBER.ink : WORKING.paper
  const c = contrast(fg, hex)
  return `<div class="sw"><span style="background:${hex}"></span><b>${name}</b><code>${hex}</code><i>${on} on it, ${c.value}:1</i></div>`
}

const rows = (list) =>
  `<table><tbody>${list.map(([k, v]) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`).join('')}</tbody></table>`

const bullets = (list) => `<ul>${list.map((l) => `<li>${l}</li>`).join('')}</ul>`

/* ---- The document ------------------------------------------------------- */

const onTint = contrast(EMBER.ink, EMBER.tint)
const primaryOnTint = contrast(EMBER.primary, EMBER.tint)
const mutedOnTint = contrast(WORKING.muted, EMBER.tint)
const pinkOnTint = contrast(WORKING.pink, EMBER.tint)
const inkOnBand = contrast(EMBER.ink, BAND[1])
const paperOnBand = contrast(WORKING.paper, BAND[1])
const paperOnNight = contrast(WORKING.paper, WORKING.night)

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>tripcerto — identity v3</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--ink:${EMBER.ink};--primary:${EMBER.primary};--accent:${EMBER.accent};--tint:${EMBER.tint};
      --paper:${WORKING.paper};--pink:${WORKING.pink};--peach:${WORKING.peach};--muted:${WORKING.muted};
      --rule:${WORKING.rule};--up:${WORKING.up};--night:${WORKING.night};
      --band:linear-gradient(100deg,${BAND[0]} 0%,${BAND[1]} 50%,${BAND[2]} 100%)}
*{box-sizing:border-box;margin:0}
body{font:400 15px/1.55 'Instrument Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);
     -webkit-font-smoothing:antialiased}
.wrap{max-width:940px;margin:0 auto;padding:56px 28px 96px}
h1{font-size:30px;font-weight:600;letter-spacing:-.02em}
.lede{color:var(--muted);margin-top:10px;max-width:640px}
.stamp{font:500 11px/1 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;
       color:var(--paper);background:var(--ink);border-radius:5px;padding:6px 10px;display:inline-block;margin-bottom:18px}
section{margin-top:56px;border-top:1px solid var(--rule);padding-top:26px}
h2{font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--pink)}
h3{font-size:16px;font-weight:600;margin-top:28px}
section > p, h3 + p{color:var(--muted);margin-top:8px;max-width:680px}
.card{border:1px solid var(--rule);border-radius:10px;padding:26px;margin-top:16px;background:var(--tint)}
.card.paper{background:var(--paper)}
.card.dark{background:var(--night);border-color:transparent}
.card.band{background:var(--band);border-color:transparent}
.lg{width:100%;height:auto;display:block}
.sizes{display:flex;align-items:flex-end;gap:34px;flex-wrap:wrap;margin-top:16px}
.sizes figure{margin:0}
.sizes figcaption{font:400 11px/1.3 'JetBrains Mono',monospace;color:var(--muted);margin-top:9px}
.icons{display:flex;align-items:center;gap:26px;flex-wrap:wrap;margin-top:16px}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.duo>div{border-radius:10px;padding:26px;display:flex;align-items:center;justify-content:center}
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px;margin-top:16px}
.sw{border:1px solid var(--rule);border-radius:8px;padding:10px;background:var(--paper)}
.sw span{display:block;height:44px;border-radius:5px}
.sw b{display:block;font-size:13px;font-weight:600;margin-top:9px}
.sw code{display:block;font:400 12px/1.4 'JetBrains Mono',monospace;color:var(--muted)}
.sw i{display:block;font:400 11px/1.4 'JetBrains Mono',monospace;color:var(--muted);font-style:normal}
.bandbar{height:64px;border-radius:8px;background:var(--band);margin-top:16px}
table{border-collapse:collapse;width:100%;font-size:14px;margin-top:14px}
td{border-top:1px solid var(--rule);padding:9px 0;vertical-align:top}
td.k{width:230px;padding-right:22px;font-weight:600}
ul{margin:12px 0 0;padding-left:20px;font-size:14px;color:var(--muted)}
li{margin:5px 0}
li b, td b{color:var(--ink);font-weight:600}
.no{color:var(--ink);font-weight:600}
code.w{font:400 12.5px/1.4 'JetBrains Mono',monospace;background:var(--tint);padding:1px 5px;border-radius:4px}
.pass{color:var(--up);font-weight:600}
.fail{color:var(--pink);font-weight:600}
@media(max-width:760px){.duo{grid-template-columns:1fr}td.k{width:auto;display:block;padding-bottom:0;border:0}td{display:block}}
</style>
</head>
<body><div class="wrap">

<span class="stamp">Signed off ${SIGNED}</span>
<h1>tripcerto — identity v3</h1>
<p class="lede">Everything in this file is decided. Implement from it. It replaces v2, which carried
three palettes we did not choose and a section proving the new artwork against the original render.
Both are settled, so neither is repeated here.</p>

<section>
<h2>1 · The marks</h2>
<p>Three pieces of drawn artwork. The wordmark cannot be set in Instrument Sans or in any other face.
None of the three may be redrawn, restretched or recoloured beyond the two fills below.</p>

<h3>The wordmark</h3>
<p>The primary identifier. Use it wherever there is room.</p>
<div class="card">${use(wordmark, { fill: EMBER.ink, size: 880, className: 'lg' })}</div>
<div class="duo">
  <div style="background:var(--night)">${use(wordmark, { fill: WORKING.paper, size: 340 })}</div>
  <div style="background:var(--band)">${use(wordmark, { fill: WORKING.paper, size: 340 })}</div>
</div>

<h3>The monogram and the app icon</h3>
<p>The monogram is the wordmark's <code class="w">t</code> and <code class="w">c</code> locked together,
for places too tight for the wordmark. The app icon is that monogram knocked out of a square tile.</p>
<div class="card icons">
  ${use(monogram, { fill: EMBER.ink, height: 84 })}
  ${tile(104, EMBER.primary)}
  ${tile(104, EMBER.ink)}
  ${tile(104, EMBER.accent)}
</div>

<h3>Held at small sizes</h3>
<div class="card sizes">
  ${[300, 170, 104, 72].map((w) => `<figure>${use(wordmark, { fill: EMBER.ink, size: w })}<figcaption>${w}px</figcaption></figure>`).join('')}
</div>
<div class="card sizes">
  ${[72, 48, 32, 16].map((s) => `<figure>${tile(s)}<figcaption>${s}px</figcaption></figure>`).join('')}
  <figure>${use(monogram, { fill: EMBER.ink, height: 44 })}<figcaption>44px</figcaption></figure>
  <figure>${use(monogram, { fill: EMBER.ink, height: 24 })}<figcaption>24px</figcaption></figure>
</div>

<h3>Rules</h3>
${rows([
  ['Primary identifier', 'The wordmark. The monogram is for compact environments only, never as a substitute where the wordmark fits.'],
  ['Clear space', 'The diameter of the dot on the <code class="w">i</code>, on all four sides.'],
  ['Wordmark minimum', '120px wide. 72px is the floor for small use, and below that use the monogram.'],
  ['Monogram minimum', '16px.'],
  ['Fills', `Ink <code class="w">${EMBER.ink}</code> on light grounds, white on ink, on coral and on the band. No other fill, no gradient inside a mark, no outline, no shadow.`],
  ['App icon corner radius', `${(radiusRatio * 100).toFixed(1)}% of the tile, carried in the artwork. Do not re-round it: iOS and Android apply their own mask on top.`],
  ['One artwork per mark', 'There is no separate small-size drawing. The same path serves every size; the rows above are the same file at different widths.'],
])}
</section>

<section>
<h2>2 · Colour — Ember</h2>
<p>Four colours and a band. Pink through coral into peach.</p>
<div class="swatches">
  ${sw('ink', EMBER.ink, 'white')}
  ${sw('primary', EMBER.primary, 'white')}
  ${sw('accent', EMBER.accent, 'white')}
  ${sw('tint', EMBER.tint, 'ink')}
</div>
<div class="bandbar"></div>
<p style="margin-top:10px"><code class="w">linear-gradient(100deg, ${BAND[0]} 0%, ${BAND[1]} 50%, ${BAND[2]} 100%)</code></p>

<h3>The working set</h3>
<p>The rest of what the site paints with, all derived from the four above.</p>
<div class="swatches">
  ${sw('paper', WORKING.paper, 'ink')}
  ${sw('pink', WORKING.pink, 'white')}
  ${sw('peach', WORKING.peach, 'ink')}
  ${sw('muted', WORKING.muted, 'white')}
  ${sw('rule', WORKING.rule, 'ink')}
  ${sw('up', WORKING.up, 'white')}
  ${sw('night', WORKING.night, 'white')}
</div>

<h3>What clears, and what does not</h3>
<p>Computed from the hex values above, not quoted. 4.5:1 is the bar for body text, 3:1 for large text.</p>
${rows([
  ['Ink on tint', `<span class="pass">${onTint.value}:1</span>. Body text.`],
  ['Muted on tint', `<span class="pass">${mutedOnTint.value}:1</span>. Secondary text.`],
  ['Pink on tint', `<span class="${pinkOnTint.body ? 'pass' : 'fail'}">${pinkOnTint.value}:1</span>. This is the link colour, and it sits under the 4.5:1 body bar. A known exception we have accepted, not an oversight. Large text, glyphs and UI are fine; a paragraph set in it is not.`],
  ['Primary on tint', `<span class="fail">${primaryOnTint.value}:1</span>. <b>A fill colour.</b> Buttons, chips, the gap row, the tile. Never words on cream.`],
  ['Ink on the band', `<span class="${inkOnBand.body ? 'pass' : 'fail'}">${inkOnBand.value}:1</span> at the band's midpoint.`],
  ['White on the band', `<span class="${paperOnBand.body ? 'pass' : 'fail'}">${paperOnBand.value}:1</span> at the midpoint. Headlines and the wordmark carry it. Body copy on the band does not.`],
  ['White on night', `<span class="pass">${paperOnNight.value}:1</span>. Dark mode.`],
])}
<p style="margin-top:14px">White is never a page surface. The light page is the cream tint, and white
appears over it only as a glass wash.</p>
</section>

<section>
<h2>3 · Typography</h2>
<p>Two faces, both from Google Fonts. v2 named no typography at all; this is the set in use.</p>
${rows([
  ['Instrument Sans', 'Everything that is words. Weights 400, 500, 600, 700.'],
  ['JetBrains Mono', 'Weights 400 and 500. Eyebrows, labels, figures, URLs, prices and code. Never body copy.'],
  ['The wordmark', 'Drawn artwork, related to Instrument Sans by shape only. It cannot be typed.'],
])}
<h3>The scale</h3>
${rows([
  ['Page headline', '56–72px, weight 600, line-height 1.06, letter-spacing −0.028em'],
  ['Section heading', '34–40px, weight 600, −0.02em'],
  ['Lede', '21–27px, weight 400, line-height 1.42'],
  ['Body', '15–16px, weight 400, line-height 1.55'],
  ['Eyebrow', 'Mono 500, 11–15px, uppercase, letter-spacing 0.14em'],
  ['Figures and prices', 'Mono 400, aligned to the type beside them'],
])}
</section>

<section>
<h2>4 · How we write</h2>
<p>These rules were spread across a partners README, an enforced test in the website repo and a
standing instruction. All of them, in one place.</p>

<h3>The rule</h3>
<p>Name the work, the problem or the outcome. Never lead with a category.</p>

<h3>Never</h3>
${bullets([
  '<b class="no">intelligence layer</b>, <b class="no">seamless</b>, <b class="no">AI-powered</b>, <b class="no">chatbot</b>, <b class="no">orchestrate</b>, <b class="no">unlock</b>, <b class="no">transform travel</b>, <b class="no">end-to-end</b>. A test in the website repo fails the build on any of these in a headline.',
  'Creative, emotive, abstract or unnecessarily sophisticated language.',
  'Defining a thing by what it is not. <b class="no">"Not a chatbot, a workflow"</b>, <b class="no">"X rather than Y"</b>. This is the single tic that made the first drafts read as machine-written.',
  'A plain statement followed by an em dash or a bracket carrying a punchline.',
  'Headlines that instruct the buyer. The software is the subject, so no opener of <b class="no">turn</b>, <b class="no">answer</b>, <b class="no">use</b>, <b class="no">let</b>, <b class="no">add</b>, <b class="no">recommend</b> or <b class="no">pass</b>.',
  'Any result no pilot has measured, and any third-party statistic presented as ours.',
])}

<h3>Always</h3>
${bullets([
  'Two products, two jobs: Engage turns website research into qualified inquiries; Workspace turns a travel requirement into a quote structure.',
  'Works with the systems they already run. Never replaces them.',
  'The expert decides what goes to the customer.',
  'Plain words for anything technical, immediately, in the same sentence.',
])}
</section>

<section>
<h2>5 · How Stella speaks</h2>
<p>Stella is the conversational engine inside both products. The site is written for a buyer. Stella
talks to a traveller or a consultant, so her register is her own.</p>
${rows([
  ['Default', 'Warm, curious, calm and clear. A knowledgeable friend, not a travel brochure and not an AI assistant.'],
  ['Soft but opinionated', 'She has a view. Where the fit is still emerging she frames it as tentative rather than withholding it.'],
  ['Guide register', 'Practical, specific and grounded, like a good guidebook. Never salesy.'],
  ['DMC register', 'Brisk and professional, a colleague working the same trip alongside them.'],
  ['Never an em dash', 'Commas, full stops or semicolons. This is a hard rule in the prompt and four tests enforce it.'],
  ['Never the machinery', 'No tool names, no UI, no backend, no tags. She says what happened, not how.'],
  ['Never a menu', 'No funnel questions. One real question at a time, and never a wall of text.'],
])}
</section>

<section>
<h2>6 · Icons and social</h2>
${rows([
  ['favicon.svg', 'The app icon in coral. The one every modern browser reads.'],
  ['favicon.ico', '48, 32 and 16px, for browsers that still ask.'],
  ['apple-touch-icon.png', '180px, full-bleed square. Deliberately not pre-rounded: iOS rounds it.'],
  ['icon-192 / icon-512', 'Full-bleed square, the tight crop, for contexts that do not mask.'],
  ['icon-maskable-192 / -512', 'The same mark drawn at 60% of the tile so it survives Android cropping a manifest icon to a circle of 80%. The tight icon does not: its corners sit 241px out against a 205px safe radius.'],
  ['mask-icon.svg', 'The monogram alone, one colour, no ground, for a pinned Safari tab.'],
  ['og-image.png', 'The social card, 1200 × 630. One per page.'],
])}
</section>

<section>
<h2>7 · What is in the pack</h2>
${rows([
  ['Marks', 'wordmark, monogram and app icon, each as SVG in ink and in white.'],
  ['Icons', 'the seven files above, generated from the marks.'],
  ['Colour', `the four Ember values, the band's three stops and the working set, as CSS custom properties in the website repo's <code class="w">src/index.css</code>.`],
  ['Type', 'Instrument Sans and JetBrains Mono, both from Google Fonts. Nothing to license.'],
])}
<p style="margin-top:16px">Every mark is declared once at the top of this file and drawn from that one
declaration. A revision replaces one path and the whole document follows.</p>
</section>

</div></body></html>
`

await writeFile(OUT, html)
console.log(`${OUT.replace(ROOT + '/', '')}  ${(html.length / 1024).toFixed(1)} kB`)
console.log(`  app icon corner radius measured from artwork: ${(radiusRatio * 100).toFixed(2)}%`)
console.log(`  ink on tint ${onTint.value}:1 · primary on tint ${primaryOnTint.value}:1 · white on band ${paperOnBand.value}:1`)
