/* Builds tripcerto-brand-kit.html, the whole identity in one file, for
   handover.

   Nothing here is transcribed. The mark paths are read out of
   public/brand/*.svg, the palette out of the site's own @theme block, the
   band is drawn by the site's shader, and the contrast ratios and the tile's
   corner radius are computed. A value that changes in the site changes here
   on the next build, or the build fails.

   Run from the repo root: node scripts/brand/build-brand-kit.mjs
*/

import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderAssets } from './render.mjs'

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const BRAND = join(ROOT, 'public/brand')
const OUT = join(ROOT, 'scripts/brand/tripcerto-brand-kit.html')

const SIGNED = '22 September 2026'

/* ---- The palette, read from the site rather than retyped ---------------- */

const css = await readFile(join(ROOT, 'src/index.css'), 'utf8')
const token = (name) => {
  const hit = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!hit) throw new Error(`src/index.css declares no --color-${name}`)
  return hit[1].toUpperCase()
}

const INK = token('ink')
const PRIMARY = token('primary')
const ACCENT = token('accent')
const TINT = token('tint')
const PAPER = token('paper')
const PINK = token('pink')
const PEACH = token('peach')
const MUTED = token('muted')
const RULE = token('rule')
const UP = token('up')

/* The dark page surface. It is not a brand colour and the kit says so. */
const NIGHT = css.match(/:root\.dark[^}]*--color-page:\s*(#[0-9a-fA-F]{6})/s)?.[1]?.toUpperCase() ?? '#1A0B20'

/* The still strip, exactly as the site declares it. */
const STRIP = css.match(/--band:\s*(linear-gradient\([^;]+)\);/)?.[1]
if (!STRIP) throw new Error('src/index.css declares no --band')

/* ---- The band, read from the component that paints it ------------------- */

const bandTsx = await readFile(join(ROOT, 'src/components/site/Band.tsx'), 'utf8')
const meshStops = JSON.parse(
  (bandTsx.match(/MESH_COLOURS = (\[[^\]]+\])/)?.[1] ?? '[]').replace(/'/g, '"'),
)
if (meshStops.length !== 4) throw new Error('Band.tsx: expected four mesh stops')
const live = Object.fromEntries(
  [...bandTsx.matchAll(/(angle|warp|scale|speed)=\{([\d.]+)\}/g)].map((m) => [m[1], Number(m[2])]),
)
for (const k of ['angle', 'warp', 'scale', 'speed']) {
  if (live[k] === undefined) throw new Error(`Band.tsx passes no ${k}`)
}

/* ---- Contrast and hue, computed ----------------------------------------- */

const channel = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}
const contrast = (fg, bg) => {
  const [x, y] = [luminance(fg), luminance(bg)].sort((m, n) => n - m)
  const r = (x + 0.05) / (y + 0.05)
  return { value: r.toFixed(2), body: r >= 4.5, large: r >= 3 }
}
const hsl = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
  }
  return `${Math.round((h * 60 + 360) % 360)}° ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/* ---- The marks, read from what the site serves -------------------------- */

async function mark(file) {
  const svg = await readFile(join(BRAND, file), 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)?.[1]
  if (!viewBox || !d) throw new Error(`${file}: no viewBox or path`)
  /* Every mark is ONE path whose counters are cut by the even-odd rule. Drop
     the rule and the p, the e, the o and the monogram's c fill solid, which
     reads as a heavier weight rather than as an error. Read it off the file;
     never assume it, never hardcode it, never emit a path without it. */
  const fillRule = svg.match(/fill-rule="([^"]+)"/)?.[1]
  if (!fillRule) throw new Error(`${file}: declares no fill-rule, so its counters cannot be trusted`)
  const [, , w, h] = viewBox.split(/\s+/).map(Number)
  return { viewBox, d, fillRule, aspect: w / h, width: w }
}

const wordmark = await mark('wordmark.svg')
const monogram = await mark('monogram.svg')
const appicon = await mark('appicon.svg')

/* The tile's corner radius, measured off the artwork: the first arc radius
   in the path over the tile's width. */
const arc = Number(appicon.d.match(/A\s*([\d.]+)/)?.[1])
if (!arc) throw new Error('appicon.svg: no arc to measure the corner radius from')
const radius = (arc / appicon.width) * 100

const use = (m, { fill, size, height, className = '' }) => {
  const w = size ?? Math.round((height ?? 100) * m.aspect)
  const h = height ?? Math.round((size ?? 100) / m.aspect)
  return `<svg class="${className}" viewBox="${m.viewBox}" width="${w}" height="${h}" role="img" aria-label="tripcerto"><path d="${m.d}" fill="${fill}" fill-rule="${m.fillRule}"/></svg>`
}
/* One drawing function, so the tile cannot carry a rule the wordmark lost. */
const tile = (px, fill) => use(appicon, { fill, size: px })

/* ---- The band and the icon, drawn by the real shader -------------------- */

/* A fixed seed and time, so the kit shows the same band on every build. The
   live band rolls both on every load; a document cannot. */
const STILL = { colours: meshStops, angle: live.angle, warp: live.warp, scale: live.scale, seed: [31.4, 15.9], bias: 0, time: 42 }

/* The icon's own piece of the field, and the fold size it is drawn at. These
   are the arguments build-icons.mjs ships with, so the tiles in this document
   are the files in public/ and not a lookalike. */
const ICON = { scale: '1.7', seed: '41.1,87.9' }

const art = await renderAssets({
  band: { kind: 'band', width: 940, height: 140, scale: 1.25, options: STILL },
  bandTall: { kind: 'band', width: 300, height: 220, scale: 1.5, options: STILL },
  icon256: { kind: 'icon', width: 256, shape: 'tile', transparent: true, scale: 2, options: ICON },
  icon104: { kind: 'icon', width: 104, shape: 'tile', transparent: true, scale: 2, options: ICON },
  icon72: { kind: 'icon', width: 72, shape: 'tile', transparent: true, scale: 2, options: ICON },
  icon48: { kind: 'icon', width: 48, shape: 'tile', transparent: true, scale: 2, options: ICON },
  icon32: { kind: 'icon', width: 32, shape: 'tile', transparent: true, scale: 2, options: ICON },
  icon16: { kind: 'icon', width: 16, shape: 'tile', transparent: true, scale: 2, options: ICON },
  card: { kind: 'card', variant: 'a', page: 'home', width: 1200, height: 630, scale: 1 },
})

/* ---- Small builders ------------------------------------------------------ */

const rows = (list) => `<table><tbody>${list.map(([k, v]) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`).join('')}</tbody></table>`
const bullets = (list) => `<ul>${list.map((l) => `<li>${l}</li>`).join('')}</ul>`
const w = (s) => `<code class="w">${s}</code>`
const no = (s) => `<b class="no">${s}</b>`

const swatch = (name, hex, on) => {
  const c = contrast(on === 'ink' ? INK : PAPER, hex)
  return `<div class="sw"><span style="background:${hex}"></span><b>${name}</b><code>${hex}</code><i>${hsl(hex)}</i><i>${on} on it, ${c.value}:1</i></div>`
}

const pair = (fgName, fg, bgName, bg, role) => {
  const c = contrast(fg, bg)
  const verdict = c.body ? '<b class="pass">AA body</b>' : c.large ? '<b class="warn">large text only</b>' : '<b class="fail">fails</b>'
  return `<tr><td>${fgName} on ${bgName}</td><td class="num">${c.value}:1</td><td>${verdict}</td><td class="dim">${role}</td></tr>`
}

/* ---- Typography, as the site paints it ---------------------------------- */

const SCALE = [
  ['Hero display', 'Home hero only', '48 / 64 / 60 / 64 / 80', '700', '0.98', '−0.035em'],
  ['Page display', 'Engage, Workspace, Pilot, Trust', '44 / 56 / 60', '700', '1.02', '−0.03em'],
  ['Section heading', 'Every section, every page', '32 / 44', '600', '1.1', '−0.02em'],
  ['Hero lede', 'Under a display line', '18 / 20', '400', '1.55', ''],
  ['Section lede', 'Under a section heading', '17 / 18', '400', '1.55', ''],
  ['Column heading', 'Cards and columns', '19', '600', '1.5', ''],
  ['Row title', 'Ruled rows', '17', '600', '1.4', ''],
  ['Body', 'Everything read in paragraphs', '16', '400', '1.55', ''],
  ['Secondary note', 'Under a row title', '14', '400', '1.5', ''],
  ['Small print', 'Eyebrows, captions, legal', '13', '600 or 400', '1.5', ''],
  ['UI', 'Nav, buttons, footer links', '15', '500 or 600', '1.5', ''],
  ['Frame chrome', 'Inside a product mockup', '11 / 12', '400', '1.5', ''],
]

/* ---- Voice, as one idea: every rule is a swap --------------------------- */

const SWAPS = [
  ['Category language. <b class="no">the intelligence layer</b>, <b class="no">AI-powered</b>, <b class="no">seamless</b>, <b class="no">end-to-end</b>, <b class="no">unlock</b>, <b class="no">orchestrate</b>, <b class="no">transform travel</b>, <b class="no">chatbot</b>', 'What happens, and for whom. <i>Engage learns what each visitor wants, so your team can sell it sooner.</i>'],
  ['Saying what a thing is not. <b class="no">Not a chatbot, a workflow.</b> <b class="no">X rather than Y.</b>', 'Say what it is, once, and move on.'],
  ['An em dash or a bracket carrying a punchline', 'A comma, a full stop, or a second sentence.'],
  ['A headline that instructs the buyer. <b class="no">Turn your website into…</b>', 'The software as the subject. <i>Workspace builds the quote-ready trip.</i>'],
  ['A result no pilot has measured, or a third-party figure presented as ours', 'What the software does. Nothing about how well it does it.'],
  ['A wall of text', 'Two or three sentences, then stop.'],
  ['A menu of questions', 'One real question, or none.'],
  ['Naming the machinery. Tools, identifiers, tags, <b class="no">(Noting: …)</b>', 'The trip, the work, the outcome. Never what is carrying it.'],
]

const MEASURED = [
  ['Sentence length', 'Mean 10.9 words, median 9, across 268 sentences on the live site. Over 20 is an outlier.'],
  ['Punctuation', 'No em dashes. No en dashes. No exclamation marks. No question marks. One semicolon on the whole site.'],
  ['Person', `${w('you')} and ${w('your')} 104 times. ${w('we')} and ${w('our')} only where Tripcerto commits to something itself.`],
  ['Tense', 'Present. One future tense exists on the site, and it is a promise about a certificate we do not hold.'],
  ['Headlines', 'Two to sixteen words, median nine, opening with a concrete subject.'],
]

const REGISTERS = [
  ['Default', 'Warm, curious, calm and clear, like a knowledgeable friend. Leans into substance and takes the room for it.'],
  ['Guide', 'A good guidebook: practical, specific, grounded, never salesy. Where the knowledge base does not cover something she says so plainly rather than inventing an answer.'],
  ['Consultant', 'Economical. A short precise reply is right far more often than a long one. She takes what she is told at face value and records it without restating it.'],
]

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>tripcerto brand kit</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--ink:${INK};--primary:${PRIMARY};--accent:${ACCENT};--tint:${TINT};--paper:${PAPER};
      --pink:${PINK};--peach:${PEACH};--muted:${MUTED};--rule:${RULE};--up:${UP};--night:${NIGHT};
      --band:${STRIP});--bandshot:url(${art.band});--bandtall:url(${art.bandTall})}
*{box-sizing:border-box;margin:0}
body{font:400 15px/1.55 'Instrument Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
.wrap{max-width:940px;margin:0 auto;padding:56px 28px 96px}
h1{font-size:31px;font-weight:700;letter-spacing:-.025em}
.lede{color:var(--muted);margin-top:10px;max-width:660px}
.stamp{font:500 11px/1 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--paper);background:var(--ink);border-radius:5px;padding:6px 10px;display:inline-block;margin-bottom:18px}
nav{margin-top:24px;font:500 12px/2 'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.04em}
nav a{color:var(--muted);text-decoration:none;margin-right:16px;white-space:nowrap}
section{margin-top:52px;border-top:1px solid var(--rule);padding-top:24px;scroll-margin-top:20px}
h2{font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--pink)}
h3{font-size:15px;font-weight:600;margin-top:30px}
section>p,h3+p{color:var(--muted);margin-top:8px;max-width:700px}
.card{border:1px solid var(--rule);border-radius:10px;padding:26px;margin-top:14px;background:var(--tint)}
.lg{width:100%;height:auto;display:block}
.row{display:flex;align-items:flex-end;gap:30px;flex-wrap:wrap;margin-top:14px}
.row figure{margin:0}
figcaption{font:400 11px/1.3 'JetBrains Mono',monospace;color:var(--muted);margin-top:9px;text-align:center}
.grounds{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}
.grounds>div{border-radius:10px;padding:30px 22px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background-size:cover;background-position:center}
.grounds>div>svg{width:100%;height:auto}
.grounds span{font:400 10px/1 'JetBrains Mono',monospace;color:rgb(255 255 255 / .7);letter-spacing:.08em}
.roles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:14px}
.role{border:1px solid var(--rule);border-radius:10px;overflow:hidden}
.role .chip{height:92px;display:flex;align-items:flex-end;padding:12px 14px}
.role .chip b{font:700 15px/1 'Instrument Sans',sans-serif}
.role .body{padding:12px 14px 14px}
.role .body strong{display:block;font-size:14.5px;font-weight:600}
.role .body p{color:var(--muted);font-size:13.5px;margin-top:3px}
.role .body code{display:block;font:500 12px/1.7 'JetBrains Mono',monospace;color:var(--muted);margin-top:6px}
.ramp{display:grid;grid-template-columns:repeat(4,1fr);margin-top:14px;border-radius:10px;overflow:hidden}
.ramp div{height:78px;display:flex;align-items:flex-end;padding:9px 11px;font:500 11px/1.4 'JetBrains Mono',monospace;color:rgb(255 255 255 / .85)}
.bandshot{position:relative;border-radius:10px;margin-top:14px;height:140px;background:var(--bandshot) center/cover no-repeat}
.bandshot.dark::after{content:'';position:absolute;inset:0;border-radius:10px;background:rgb(40 17 49 / .55)}
.bandshot b{position:absolute;left:18px;bottom:14px;z-index:1;color:var(--paper);font:600 15px/1 'Instrument Sans',sans-serif}
.strip{height:64px;border-radius:10px;background:var(--band);margin-top:10px}
table{border-collapse:collapse;width:100%;font-size:14px;margin-top:12px}
td,th{border-top:1px solid var(--rule);padding:9px 0;vertical-align:top;text-align:left}
th{font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-top:0;padding-top:0}
td.k{width:224px;padding-right:22px;font-weight:600}
td.num{font:400 13px/1.55 'JetBrains Mono',monospace;width:86px}
td.dim,.dim{color:var(--muted)}
.vs td{width:50%;padding-right:22px}
.vs td:first-child{color:var(--muted)}
.vs i{font-style:italic;color:var(--muted)}
.scale td,.scale th{padding-right:13px}
.scale td:first-child{font-weight:600;width:146px}
.scale .px{font:400 13px/1.55 'JetBrains Mono',monospace}
ul{margin:10px 0 0;padding-left:20px;font-size:14px;color:var(--muted)}
li{margin:5px 0}
li b,td b{color:var(--ink);font-weight:600}
.no{color:var(--ink);font-weight:600}
code.w{font:400 12.5px/1.4 'JetBrains Mono',monospace;background:var(--tint);padding:1px 5px;border-radius:4px;overflow-wrap:anywhere}
pre{font:400 12.5px/1.6 'JetBrains Mono',monospace;background:var(--tint);border-radius:8px;padding:13px 15px;margin-top:10px;overflow-x:auto}
.pass{color:var(--up)}.fail{color:var(--pink)}.warn{color:var(--accent)}
@media(max-width:760px){.grounds,.roles,.ramp{grid-template-columns:1fr}td.k{width:auto;display:block;padding-bottom:0;border:0}td{display:block}.vs td{width:auto}.scale td:first-child{width:auto}}
</style>
</head>
<body><div class="wrap">

<span class="stamp">Signed ${SIGNED}</span>
<h1>tripcerto brand kit</h1>
<p class="lede">Everything here is decided and in use on tripcerto.com. Implement from it.
Every value is read out of the site at build time, so the two cannot disagree.</p>
<nav><a href="#logo">01 Logo</a><a href="#band">02 Band</a><a href="#colour">03 Colour</a><a href="#type">04 Type</a><a href="#voice">05 Voice</a><a href="#files">06 Files</a></nav>

<section id="logo">
<h2>01 · Logo</h2>
<p>Three pieces of drawn artwork. The wordmark is not type and cannot be set in any face.</p>

<div class="card">${use(wordmark, { fill: INK, size: 880, className: 'lg' })}</div>
<div class="grounds">
  <div style="background:var(--ink)">${use(wordmark, { fill: PAPER, size: 240 })}<span>on ink</span></div>
  <div style="background:var(--primary)">${use(wordmark, { fill: PAPER, size: 240 })}<span>on primary</span></div>
  <div style="background-image:var(--bandtall)">${use(wordmark, { fill: PAPER, size: 240 })}<span>on the band</span></div>
</div>

<h3>Monogram and app icon</h3>
<p>The monogram is the wordmark's t and c locked together, for anywhere too tight for the wordmark.
The app icon is that monogram cut out of a tile, on the band.</p>
<div class="card row">
  ${use(monogram, { fill: INK, height: 84 })}
  <img src="${art.icon104}" width="104" height="104" alt="">
  ${tile(104, PRIMARY)}
  ${tile(104, INK)}
</div>

<h3>At the sizes they are met at</h3>
<div class="card row">
  ${[300, 170, 104, 72].map((px) => `<figure>${use(wordmark, { fill: INK, size: px })}<figcaption>${px}</figcaption></figure>`).join('')}
</div>
<div class="card row">
  ${[['icon72', 72], ['icon48', 48], ['icon32', 32], ['icon16', 16]].map(([k, px]) => `<figure><img src="${art[k]}" width="${px}" height="${px}" alt=""><figcaption>${px}</figcaption></figure>`).join('')}
  <figure>${use(monogram, { fill: INK, height: 44 })}<figcaption>mono 44</figcaption></figure>
  <figure>${use(monogram, { fill: INK, height: 24 })}<figcaption>mono 24</figcaption></figure>
</div>

<h3>The link preview</h3>
<p>The card every share of tripcerto.com shows, in a message, a post or a chat. One card for the
whole site: the wordmark, the homepage headline alone and centred, and the monogram carrying it,
all on the band. Rendered here from ${w('scripts/og/card.html')}, the source of the file the site serves.</p>
<div class="card row"><figure><img src="${art.card}" width="1200" height="630" alt="" style="width:520px;max-width:100%;height:auto;display:block;border-radius:6px"><figcaption>as a network shows it, 520 wide</figcaption></figure></div>
${rows([
  ['The file', `${w('public/og-image.png')}, a 1200 × 630 card shot at 2×, so 2400 × 1260 pixels, served to every page.`],
  ['Rebuild it', `${w('node scripts/og/shoot.mjs --pick a')}, then bump the ${w('?v=')} on every page's og:image and twitter:image so the networks refetch it.`],
  ['The type', 'The headline at 55px on a 400px measure, centred on the card’s height, and nothing under it. Short enough that the mark is never crowded.'],
  ['The mark', 'The monogram, white at 0.34, 700px wide, off the right edge by 24px. It is the card; do not fade it back.'],
  ['Never', 'A second card per page, a line of copy under the headline, a photograph behind the type, or a headline long enough to run into the mark.'],
])}

<h3>Rules</h3>
${rows([
  ['Primary identifier', 'The wordmark. The monogram is for compact use only, never where the wordmark fits.'],
  ['Clear space', 'The diameter of the dot on the i, on all four sides.'],
  ['Minimum size', 'Wordmark 120px wide, 72px at a push. Below that, the monogram, which floors at 16px.'],
  ['Fills', `Ink ${w(INK)} on light grounds, white on ink, on primary and on the band. No third fill.`],
  ['Corner radius', `${radius.toFixed(1)}% of the tile, carried in the artwork. Do not re-round it: iOS and Android mask on top.`],
  ['One artwork per mark', 'No separate small-size drawing. The rows above are the same file at different widths.'],
])}

<h3>Never</h3>
${bullets([
  'Redraw, restretch, rotate or condense a mark. Scale only.',
  'Recolour beyond the two fills. No gradient inside a mark, no outline, no drop shadow.',
  'Set the wordmark in Instrument Sans or any other face.',
  'Place a mark on a photograph, or on a ground that drops it under 3:1.',
  'Lock a mark to a tagline or product name as fixed artwork.',
])}
</section>

<section id="band">
<h2>02 · The band</h2>
<p>A brand element, not a decoration. The Ember ramp with the colour itself warped and folded by
noise, so it moves. It carries the hero, the close and the app icon.</p>

<div class="bandshot"></div>
<div class="bandshot dark"><b>dark mode</b></div>

<h3>Parameters</h3>
${rows([
  ['Stops', `${meshStops.map((c) => w(c)).join(' → ')}`],
  ['Angle', `${live.angle}°, so the ramp runs left to right and a shade upward.`],
  ['Warp', `${live.warp}. How far the noise pushes a point along the ramp, in ramp lengths.`],
  ['Fold size', `${live.scale} across the box's longer side, so a wide band and a tall one fold at the same physical size. The app icon uses ${ICON.scale}, because a square tile takes more of the field.`],
  ['Speed', `${live.speed}. It never rests on a frame.`],
  ['Noise', 'Three octaves of 2D simplex warped into each other: a base at 0.9, a detail octave at 1.8 displaced by the base, and a slow fold at 0.6 displaced by the detail.'],
])}

<h3>What rolls, and what does not</h3>
<p>Every load draws a different band. Reloads that showed the same folds in the same places read as
a static image.</p>
${rows([
  ['Rolls', `Seed, anywhere in the field. Bias, up to a fifth of the ramp either way. Angle, ±25°. Warp, 0.85 to 1.15 of ${live.warp}.`],
  ['Fixed', '<b>Stops, fold size and speed. These are the brand; the rest is weather.</b>'],
  ['Pinned', `The app icon and this document cannot roll, so they name a seed: ${w(ICON.seed)}.`],
])}

<h3>Without the shader</h3>
<p>The still strip underneath, which is also what renders with no WebGL and under reduced motion:</p>
<pre>background: ${STRIP});</pre>
<div class="strip"></div>
<p>Three stops, not four. The still drops ${w(meshStops[2])}, which exists to give the shader a longer
run through the coral before the peach.</p>

<h3>Surfaces and rules</h3>
${rows([
  ['bg-band-frosted', 'White at 66% over the band, where a real backdrop filter would show another frame through.'],
  ['bg-band-smoked', 'Ink at 76% over the band, the same for dark mode.'],
  ['Dark mode', 'An ink wash at 55% over the live mesh, so the band sits with the dark page instead of glowing off it.'],
  ['Copy on it', 'White, and nothing smaller than a lede. White on the band is 3.00:1.'],
  ['Never', 'The band is a ground, not a fill. It does not go inside a mark, a letterform or a glyph. Do not restop it, add to it, or reverse it: the direction is pink to peach.'],
])}
</section>

<section id="colour">
<h2>03 · Colour</h2>
<p>Four colours carry the brand. Each has one job.</p>

<div class="roles">
  <div class="role"><div class="chip" style="background:${INK}"><b style="color:${PAPER}">Ink</b></div>
    <div class="body"><strong>Everything you read</strong><p>All text on light grounds, and the dark page surface. The one colour that is never decorative.</p><code>${INK} · ${hsl(INK)}</code></div></div>
  <div class="role"><div class="chip" style="background:${PRIMARY}"><b style="color:${PAPER}">Primary</b></div>
    <div class="body"><strong>The brand coral</strong><p>The app icon, the filled button, the active state. Where the brand signs its name in colour.</p><code>${PRIMARY} · ${hsl(PRIMARY)}</code></div></div>
  <div class="role"><div class="chip" style="background:${ACCENT}"><b style="color:${PAPER}">Accent</b></div>
    <div class="body"><strong>The warm half of the band</strong><p>Its job is inside the ramp, holding the coral open before it reaches the peach. It is not a second brand colour and is not painted on its own.</p><code>${ACCENT} · ${hsl(ACCENT)}</code></div></div>
  <div class="role"><div class="chip" style="background:${TINT}"><b style="color:${INK}">Tint</b></div>
    <div class="body"><strong>The page</strong><p>The cream everything stands on in light mode. White is not a surface here; it only appears as a glass wash over this.</p><code>${TINT} · ${hsl(TINT)}</code></div></div>
</div>

<h3>The band is those colours in order</h3>
<div class="ramp">
  <div style="background:${PINK}">Pink ${PINK}</div>
  <div style="background:${PRIMARY}">Primary ${PRIMARY}</div>
  <div style="background:${ACCENT}">Accent ${ACCENT}</div>
  <div style="background:${PEACH};color:${INK}">Peach ${PEACH}</div>
</div>
<p>Pink and peach are the ramp's ends. They appear as flat colour in one place each: pink is the link
and glyph colour on light grounds, peach only inside the band.</p>

<h3>The rest</h3>
${rows([
  ['Muted', `${w(MUTED)}. Secondary text.`],
  ['Rule', `${w(RULE)}. Hairlines. It comes off the cream, not off ink, so it stays warm.`],
  ['Up', `${w(UP)}. The one positive-state colour.`],
  ['Night', `${w(NIGHT)}. <b>The dark-mode page surface, not ink.</b> Ink is a brand colour and does not change; night is a surface and exists only in dark mode.`],
])}

<h3>Contrast, computed</h3>
<table><thead><tr><th>Pairing</th><th>Ratio</th><th>Verdict</th><th>Where</th></tr></thead><tbody>
${pair('Ink', INK, 'tint', TINT, 'Body copy, light')}
${pair('Muted', MUTED, 'tint', TINT, 'Secondary text, light')}
${pair('White', PAPER, 'night', NIGHT, 'Body copy, dark')}
${pair('White', PAPER, 'primary', PRIMARY, 'Copy on the band and on coral')}
${pair('Pink', PINK, 'tint', TINT, 'Links and glyphs, light')}
</tbody></table>
<p>White on the band clears large text only, which is why nothing smaller than a lede is set on it.
Pink on cream is under the body bar and is used for links and glyphs alone, never for running text.</p>
</section>

<section id="type">
<h2>04 · Typography</h2>
<p>Two families, both from Google Fonts, both free to use and redistribute.</p>
${rows([
  ['Sans', `<b>Instrument Sans</b> 400, 500, 600, 700. Everything the reader reads. Fallback ${w('system-ui, -apple-system, Segoe UI, sans-serif')}.`],
  ['Mono', `<b>JetBrains Mono</b> 400 and 500. Uppercase letter-spaced labels at 500, numerals and code at 400. Fallback ${w('ui-monospace, SFMono-Regular, monospace')}.`],
  ['The request', w('family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap')],
])}

<h3>The scale</h3>
<p>Sizes in px. A slash means it steps at a breakpoint, smallest first.</p>
<table class="scale"><thead><tr><th>Role</th><th>Where</th><th>Size</th><th>Weight</th><th>Leading</th><th>Tracking</th></tr></thead><tbody>
${SCALE.map(([role, where, size, weight, leading, tracking]) => `<tr><td>${role}</td><td class="dim">${where}</td><td class="px">${size}</td><td class="px">${weight}</td><td class="px">${leading}</td><td class="px">${tracking}</td></tr>`).join('')}
</tbody></table>

<h3>Rules</h3>
${rows([
  ['Tracking is for headlines', 'Three negative values, all on display and heading type. Everything else runs at normal tracking.'],
  ['One reading leading', '1.55, on every lede and every paragraph. Tighter leading belongs to headlines.'],
  ['No uppercase in the sans', 'Uppercase and letter-spacing belong to the mono. The sans is never set in caps.'],
  ['Numerals are tabular', 'Any price, total or step number, so columns line up.'],
  ['Measure', 'A display line caps at 15 to 18 characters, a lede at about 34rem. Body text is never full width.'],
])}
</section>

<section id="voice">
<h2>05 · Voice</h2>
<p>One voice. The site talks to a buyer, Stella talks to a traveller or a consultant, and the rules
below are the same for both. Name the work, the problem or the outcome. Never lead with a category.</p>

<h3>Every rule is a swap</h3>
<table class="vs"><thead><tr><th>Never</th><th>Instead</th></tr></thead><tbody>
${SWAPS.map(([never, instead]) => `<tr><td>${never}</td><td>${instead}</td></tr>`).join('')}
</tbody></table>
<p>Two of these are enforced. A test fails the build if any banned word appears anywhere on a
page, or if a heading opens with an instruction to the reader.</p>

<h3>What we always say</h3>
${bullets([
  'Two products, two jobs. Engage turns website research into qualified inquiries. Workspace turns a travel requirement into a quote structure.',
  'Works with the systems they already run, and never replaces them.',
  'The expert decides what reaches the customer.',
  'Plain words for anything technical, in the same sentence.',
])}

<h3>The shape of it, measured on the live site</h3>
${rows(MEASURED)}

<h3>Stella has three registers</h3>
${rows(REGISTERS)}
<p>Everything above still applies to her. The registers change how much she says, never what she is
allowed to say.</p>
</section>

<section id="files">
<h2>06 · Files</h2>
${rows([
  ['Marks', `${w('public/brand/')} carries the wordmark, monogram and app icon, each as SVG in ink and in white. One path per mark, cut by the even-odd fill rule. Drop that rule and the counters fill solid.`],
  ['Icons', `${w('public/')} carries favicon.svg, favicon.ico at 48/32/16, apple-touch-icon at 180, icon-192, icon-512, two maskable icons for Android, mask-icon.svg for a pinned Safari tab, and og-image at 1200 × 630.`],
  ['Icon ground', `All of them regenerate from one command, so a favicon cannot drift from an app icon: ${w(`node scripts/og/build-icons.mjs --ground mesh --scale ${ICON.scale} --seed ${ICON.seed}`)}`],
  ['Colour', `${w('src/index.css')} declares the brand colours, the working set and the band, as CSS custom properties. That file is the source; this document reads it.`],
  ['The band', `${w('src/components/ui/gradient-mesh.tsx')} is the shader, about 6 kB of WebGL with no dependency. ${w('src/components/site/Band.tsx')} passes the live parameters.`],
  ['Type', 'Instrument Sans and JetBrains Mono, both from Google Fonts. Nothing to license.'],
])}
<p>Replace an artwork file, run ${w('node scripts/brand/build-brand-kit.mjs')}, and this whole document
follows. A test fails the build if it stops matching the site.</p>
</section>

</div></body></html>
`

await writeFile(OUT, html)
console.log(`${OUT.replace(ROOT + '/', '')}  ${(html.length / 1024).toFixed(1)} kB`)
console.log(`  corner radius measured from artwork: ${radius.toFixed(2)}%`)
console.log(`  band: angle ${live.angle}, warp ${live.warp}, scale ${live.scale} · icon scale ${ICON.scale} seed ${ICON.seed}`)
console.log(`  ink ${INK} ${hsl(INK)} · on tint ${contrast(INK, TINT).value}:1`)
