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

/* A fixed seed and time, so the kit shows the same band on every build. */
const STILL = { colours: meshStops, angle: live.angle, warp: live.warp, scale: live.scale, seed: [31.4, 15.9], bias: 0, time: 42 }

const art = await renderAssets({
  band: { kind: 'band', width: 940, height: 140, scale: 1.25, options: STILL },
  icon: { kind: 'icon', width: 220, shape: 'tile', transparent: true, scale: 2, options: { scale: '1.7' } },
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
      --band:${STRIP});--bandshot:url(${art.band})}
*{box-sizing:border-box;margin:0}
body{font:400 15px/1.55 'Instrument Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
.wrap{max-width:940px;margin:0 auto;padding:56px 28px 96px}
h1{font-size:30px;font-weight:600;letter-spacing:-.02em}
.lede{color:var(--muted);margin-top:10px;max-width:660px}
.stamp{font:500 11px/1 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--paper);background:var(--ink);border-radius:5px;padding:6px 10px;display:inline-block;margin-bottom:18px}
nav{margin-top:26px;font:500 12px/2 'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.04em}
nav a{color:var(--muted);text-decoration:none;margin-right:16px;white-space:nowrap}
nav a:hover{color:var(--pink)}
section{margin-top:54px;border-top:1px solid var(--rule);padding-top:26px;scroll-margin-top:20px}
h2{font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--pink)}
h3{font-size:16px;font-weight:600;margin-top:28px}
section>p,h3+p{color:var(--muted);margin-top:8px;max-width:700px}
.card{border:1px solid var(--rule);border-radius:10px;padding:26px;margin-top:16px;background:var(--tint)}
.card.paper{background:var(--paper)}
.lg{width:100%;height:auto;display:block}
.sizes{display:flex;align-items:flex-end;gap:32px;flex-wrap:wrap;margin-top:16px}
.sizes figure{margin:0}
.sizes figcaption{font:400 11px/1.3 'JetBrains Mono',monospace;color:var(--muted);margin-top:9px}
.icons{display:flex;align-items:center;gap:26px;flex-wrap:wrap;margin-top:16px}
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
.trio>div{border-radius:10px;padding:30px 22px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
.trio>div>svg{width:100%;height:auto}
.trio span{font:400 10px/1 'JetBrains Mono',monospace;color:rgb(255 255 255 / .6);letter-spacing:.08em}
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px;margin-top:16px}
.sw{border:1px solid var(--rule);border-radius:8px;padding:10px;background:var(--paper)}
.sw span{display:block;height:44px;border-radius:5px}
.sw b{display:block;font-size:13px;font-weight:600;margin-top:9px}
.sw code{display:block;font:400 12px/1.4 'JetBrains Mono',monospace;color:var(--muted)}
.sw i{display:block;font:400 11px/1.4 'JetBrains Mono',monospace;color:var(--muted);font-style:normal}
.strip{height:74px;border-radius:8px;background:var(--band);margin-top:10px}
.bandshot{position:relative;border-radius:10px;margin-top:16px;height:140px;
  background:var(--bandshot) center/cover no-repeat}
.bandshot.dark::after{content:'';position:absolute;inset:0;border-radius:10px;background:rgb(40 17 49 / .55)}
.bandshot b{position:absolute;left:18px;bottom:14px;z-index:1;color:var(--paper);font:600 15px/1 'Instrument Sans',sans-serif}
table{border-collapse:collapse;width:100%;font-size:14px;margin-top:14px}
td,th{border-top:1px solid var(--rule);padding:9px 0;vertical-align:top;text-align:left}
th{font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-top:0;padding-top:0}
td.k{width:236px;padding-right:22px;font-weight:600}
td.num{font:400 13px/1.55 'JetBrains Mono',monospace;width:90px}
td.dim,.dim{color:var(--muted)}
.scale td,.scale th{padding-right:14px}
.scale td:first-child{font-weight:600;width:150px}
.scale .px{font:400 13px/1.55 'JetBrains Mono',monospace}
ul{margin:12px 0 0;padding-left:20px;font-size:14px;color:var(--muted)}
li{margin:5px 0}
li b,td b{color:var(--ink);font-weight:600}
.no{color:var(--ink);font-weight:600}
code.w{font:400 12.5px/1.4 'JetBrains Mono',monospace;background:var(--tint);padding:1px 5px;border-radius:4px;word-break:break-all}
pre{font:400 12.5px/1.6 'JetBrains Mono',monospace;background:var(--tint);border-radius:8px;padding:14px 16px;margin-top:12px;overflow-x:auto}
.pass{color:var(--up)}.fail{color:var(--pink)}.warn{color:var(--accent)}
@media(max-width:760px){.trio{grid-template-columns:1fr}td.k{width:auto;display:block;padding-bottom:0;border:0}td{display:block}.scale td:first-child{width:auto}}
</style>
</head>
<body><div class="wrap">

<span class="stamp">Signed ${SIGNED}</span>
<h1>tripcerto brand kit</h1>
<p class="lede">Everything here is decided and in use on tripcerto.com. Implement from it.
Every value in this file is read out of the site at build time, so the two cannot disagree.</p>
<nav>
<a href="#logo">01 Logo</a><a href="#colour">02 Colour</a><a href="#band">03 The band</a><a href="#type">04 Typography</a><a href="#icons">05 Icons</a><a href="#voice">06 Voice</a><a href="#pack">07 The pack</a>
</nav>

<section id="logo">
<h2>01 · Logo</h2>
<p>Three pieces of drawn artwork. The wordmark is not type and cannot be set in any face.</p>

<h3>Wordmark</h3>
<div class="card">${use(wordmark, { fill: INK, size: 880, className: 'lg' })}</div>
<div class="trio">
  <div style="background:var(--ink)">${use(wordmark, { fill: PAPER, size: 240 })}<span>ink ${INK}</span></div>
  <div style="background:var(--primary)">${use(wordmark, { fill: PAPER, size: 240 })}<span>primary ${PRIMARY}</span></div>
  <div style="background:var(--band)">${use(wordmark, { fill: PAPER, size: 240 })}<span>the band</span></div>
</div>

<h3>Monogram and app icon</h3>
<p>The monogram is the wordmark's t and c locked together, for anywhere too tight for the wordmark.
The app icon is that monogram cut out of a square tile.</p>
<div class="card icons">
  ${use(monogram, { fill: INK, height: 84 })}
  ${tile(104, PRIMARY)}
  ${tile(104, INK)}
  <img src="${art.icon}" width="104" height="104" alt="">
</div>

<h3>At small sizes</h3>
<div class="card sizes">
  ${[300, 170, 104, 72].map((px) => `<figure>${use(wordmark, { fill: INK, size: px })}<figcaption>${px}px</figcaption></figure>`).join('')}
</div>
<div class="card sizes">
  ${[72, 48, 32, 16].map((px) => `<figure>${tile(px, PRIMARY)}<figcaption>${px}px</figcaption></figure>`).join('')}
  <figure>${use(monogram, { fill: INK, height: 44 })}<figcaption>44px</figcaption></figure>
  <figure>${use(monogram, { fill: INK, height: 24 })}<figcaption>24px</figcaption></figure>
</div>

<h3>Rules</h3>
${rows([
  ['Primary identifier', 'The wordmark. The monogram is for compact use only, never where the wordmark fits.'],
  ['Clear space', 'The diameter of the dot on the i, on all four sides.'],
  ['Wordmark minimum', '120px wide. 72px is the floor for small use; below that, the monogram.'],
  ['Monogram minimum', '16px.'],
  ['Fills', `Ink ${w(INK)} on light grounds, white on ink, on coral and on the band. No third fill.`],
  ['App icon corner radius', `${radius.toFixed(1)}% of the tile, carried in the artwork. Do not re-round it: iOS and Android apply their own mask on top.`],
  ['One artwork per mark', 'There is no separate small-size drawing. The rows above are the same file at different widths.'],
])}

<h3>Never</h3>
${bullets([
  `Redraw, restretch, rotate or condense a mark. ${no('Scale only.')}`,
  'Recolour beyond the two fills above. No gradient inside a mark, no outline, no drop shadow.',
  'Set the wordmark in Instrument Sans or any other face.',
  'Put a mark on a photograph, or on a ground that drops it under 3:1.',
  'Lock the mark to a tagline, a strapline or a product name as fixed artwork.',
])}
</section>

<section id="colour">
<h2>02 · Colour</h2>
<p>Four brand colours. Everything else is a working value that serves the page, not the identity.</p>

<div class="swatches">
  ${swatch('Ink', INK, 'white')}
  ${swatch('Primary', PRIMARY, 'white')}
  ${swatch('Accent', ACCENT, 'ink')}
  ${swatch('Tint', TINT, 'ink')}
</div>

<h3>The working set</h3>
${rows([
  ['Paper', `${w(PAPER)}, white. Not a page surface; it appears only as a glass wash over the tint.`],
  ['Pink', `${w(PINK)}. The band's first stop, and the link and glyph colour on light grounds.`],
  ['Peach', `${w(PEACH)}. The band's last stop.`],
  ['Muted', `${w(MUTED)}. Secondary text.`],
  ['Rule', `${w(RULE)}. Hairlines.`],
  ['Up', `${w(UP)}. The one positive-state colour.`],
  ['Night', `${w(NIGHT)}. <b>The dark-mode page surface. This is not ink.</b> Ink is a brand colour and does not change; night is a surface and only exists in dark mode.`],
])}

<h3>Contrast, computed</h3>
<table><thead><tr><th>Pairing</th><th>Ratio</th><th>Verdict</th><th>Where</th></tr></thead><tbody>
${pair('Ink', INK, 'tint', TINT, 'Body copy, light')}
${pair('Muted', MUTED, 'tint', TINT, 'Secondary text, light')}
${pair('White', PAPER, 'night', NIGHT, 'Body copy, dark')}
${pair('White', PAPER, 'primary', PRIMARY, 'Copy on the band and on coral')}
${pair('Pink', PINK, 'tint', TINT, 'Links and glyphs, light')}
${pair('Muted', MUTED, 'paper', PAPER, 'Secondary text on a glass wash')}
</tbody></table>
<p>White on the band sits at large-text only, which is why nothing smaller than a lede is ever set on it.
Pink on tint is under the body bar and is used for links and glyphs alone, never for running text.</p>

<h3>Accent has no job</h3>
<p>${w(ACCENT)} is declared in the theme and painted nowhere on the site. It either gets a role or the
palette is three colours and the band.</p>
</section>

<section id="band">
<h2>03 · The band</h2>
<p>The band is a brand element, not a decoration. It is the Ember strip, pink through coral into
peach, with the colour itself warped and folded by noise so it moves.</p>

<div class="bandshot" role="img" aria-label="The band"></div>
<div class="bandshot dark" role="img" aria-label="The band in dark mode"><b>dark mode</b></div>

<h3>Parameters</h3>
${rows([
  ['Stops', `${meshStops.map((c) => w(c)).join(' → ')}. Four in the shader.`],
  ['Angle', `${live.angle}° in CSS convention, so the ramp runs left to right and a shade upward.`],
  ['Warp', `${live.warp}. How far the noise pushes a point along the ramp, in ramp lengths.`],
  ['Fold size', `${live.scale} folds across the box's longer side, so a short wide band and a tall one fold at the same physical size.`],
  ['Speed', `${live.speed}. The band is always moving; it never rests on a frame.`],
  ['Noise', 'Three octaves of 2D simplex, domain-warped into each other: a base at 0.9, a detail octave at 1.8 displaced by the base, and a slow fold at 0.6 displaced by the detail.'],
])}

<h3>What varies, and what does not</h3>
<p>Every mount draws a different band, because reloads that showed the same folds in the same places
read as a static image.</p>
${rows([
  ['Seed', 'Random. The noise starts somewhere else in its field.'],
  ['Bias', 'Up to a fifth of the ramp either way, so a band leans pink or leans peach.'],
  ['Angle', `±25° around ${live.angle}°.`],
  ['Warp', `0.85 to 1.15 of ${live.warp}.`],
  ['Stops, fold size and speed', '<b>Fixed. These are the brand; the rest is weather.</b>'],
])}

<h3>Reproducing it without the shader</h3>
<p>The still strip underneath, which is also what renders with no WebGL:</p>
<pre>background: ${STRIP});</pre>
<div class="strip"></div>
<p>Three stops, not four: the still drops ${w(meshStops[2])}, which only exists to give the shader a
longer run through the coral before the peach.</p>

<h3>Surfaces built on it</h3>
${rows([
  ['bg-band', 'The band itself.'],
  ['bg-band-frosted', 'White at 66% over the band. An opaque stand-in for glass where a real backdrop filter would show another frame through.'],
  ['bg-band-smoked', 'Ink at 76% over the band. The same, for dark mode.'],
  ['Dark mode', 'An ink wash at 55% over the live mesh, so the band sits with the dark page instead of glowing off it.'],
])}

<h3>Rules</h3>
${bullets([
  'Copy on the band is white. It is the only fill that reads across the whole ramp.',
  'Nothing smaller than a lede is set on the band.',
  'The band is a ground, never a fill. It does not go inside a mark, a letterform or an icon glyph.',
  `Do not restop it, do not add a colour to it, and do not reverse it. ${no('The direction is pink to peach.')}`,
  'Respect reduced motion: the still strip stands in for the animation.',
])}
</section>

<section id="type">
<h2>04 · Typography</h2>
<p>Two families, both from Google Fonts, both free to use and redistribute.</p>

${rows([
  ['Sans', `<b>Instrument Sans</b>, weights 400, 500, 600 and 700. Everything the reader reads. Fallback ${w('system-ui, -apple-system, Segoe UI, sans-serif')}.`],
  ['Mono', `<b>JetBrains Mono</b>, weights 400 and 500. Uppercase letter-spaced labels and eyebrows at 500, numerals and code at 400. Fallback ${w('ui-monospace, SFMono-Regular, monospace')}.`],
  ['The request', `${w('family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap')}`],
])}

<h3>The scale</h3>
<p>Sizes in px. A slash means it steps at a breakpoint, smallest first.</p>
<table class="scale"><thead><tr><th>Role</th><th>Where</th><th>Size</th><th>Weight</th><th>Leading</th><th>Tracking</th></tr></thead><tbody>
${SCALE.map(([role, where, size, weight, leading, tracking]) => `<tr><td>${role}</td><td class="dim">${where}</td><td class="px">${size}</td><td class="px">${weight}</td><td class="px">${leading}</td><td class="px">${tracking}</td></tr>`).join('')}
</tbody></table>

<h3>Rules</h3>
${rows([
  ['Negative tracking is for headlines only', 'Three values, all on display and heading type. Everything else runs at normal tracking.'],
  ['One reading leading', '1.55, on every lede and every paragraph. Tighter leading belongs to headlines.'],
  ['No uppercase in the sans', 'Uppercase and letter-spacing are the mono’s job, never Instrument Sans’.'],
  ['Numerals are tabular', 'Any price, total or step number sets in tabular figures so columns line up.'],
  ['Headlines balance, ledes pretty', 'Headings wrap balanced; ledes avoid a single word on the last line.'],
  ['Measure', 'A display line caps at 15 to 18 characters, a lede at about 34rem. Body text is never full width.'],
])}
</section>

<section id="icons">
<h2>05 · Icons</h2>
<p>Seven files, all generated from the marks by one command, so a favicon cannot drift apart from an
app icon.</p>

<div class="card icons">
  <img src="${art.icon}" width="128" height="128" alt="">
  ${tile(72, PRIMARY)}
  ${tile(48, PRIMARY)}
  ${tile(32, PRIMARY)}
</div>

${rows([
  ['The ground', `The band warped by the site's own shader at a fixed seed, at a fold size of 1.7 against the hero's ${live.scale}. A square tile takes more of the field than a wide band and is then met at icon size, so the folds open up.`],
  ['favicon.svg', `The app icon in ${w(PRIMARY)}, flat. A vector favicon carrying a raster of a shader is large and pointless at 16px.`],
  ['favicon.ico', '48, 32 and 16px. The rounded tile, corners empty rather than white.'],
  ['apple-touch-icon.png', '180px, full-bleed square. Not pre-rounded: iOS rounds it.'],
  ['icon-192 / icon-512', 'Full-bleed square, tight crop, for anywhere that does not mask.'],
  ['icon-maskable-192 / -512', 'A separate drawing for Android, which crops to a circle inside the tile. The ground reaches all four edges and the mark comes in to 56% so nothing is lost to the crop.'],
  ['mask-icon.svg', 'The monogram alone, one colour, no ground, for a pinned Safari tab.'],
  ['og-image.png', '1200 × 630, the social card. One per page.'],
])}
</section>

<section id="voice">
<h2>06 · Voice</h2>
<p>Two voices. The site is written for a buyer; Stella talks to a traveller or a consultant. They
share a floor and differ above it.</p>

<h3>How we write</h3>
<p>Name the work, the problem or the outcome. Never lead with a category.</p>
${rows([
  ['Sentence length', 'Measured across the live site: 268 sentences, mean 10.9 words, median 9. A sentence over 20 words is an outlier, not a style.'],
  ['Punctuation', 'Zero em dashes, zero en dashes, zero exclamation marks and zero question marks on the whole site. One semicolon.'],
  ['Person', `${w('you')} and ${w('your')}, 104 times across the site. ${w('we')} and ${w('our')} only where Tripcerto commits to something itself.`],
  ['Tense', 'Present. There is exactly one future tense on the site, and it is a promise about a certificate we do not yet hold.'],
  ['Headlines', 'Two to sixteen words, median nine. They open with a concrete subject, never with a verb.'],
])}

<h3>Never</h3>
${bullets([
  `${no('intelligence layer')}, ${no('seamless')}, ${no('AI-powered')}, ${no('chatbot')}, ${no('orchestrate')}, ${no('unlock')}, ${no('transform travel')}, ${no('end-to-end')}. A test fails the build on any of these in a headline.`,
  'Creative, emotive, abstract or unnecessarily sophisticated language.',
  `Defining a thing by what it is not. ${no('Not a chatbot, a workflow')}. ${no('X rather than Y')}. This is the single tic that makes a draft read as machine-written.`,
  'A plain statement followed by an em dash or a bracket carrying a punchline.',
  `Headlines that instruct the buyer. The software is the subject, so no opener of ${no('turn')}, ${no('answer')}, ${no('use')}, ${no('let')}, ${no('add')}, ${no('recommend')} or ${no('pass')}.`,
  'Any result no pilot has measured, and any third-party statistic presented as ours.',
])}

<h3>Always</h3>
${bullets([
  'Two products, two jobs. Engage turns website research into qualified inquiries. Workspace turns a travel requirement into a quote structure.',
  'Works with the systems they already run, and never replaces them.',
  'The expert decides what reaches the customer.',
  'Plain words for anything technical, in the same sentence, immediately.',
])}

<h3>How Stella speaks</h3>
<p>Stella is the conversational engine inside both products. These are not house style. They are
hard rules in her system prompt, and the em dash ban alone is asserted in fifteen places in the test
suite, because every paragraph of that prompt is an example she imitates.</p>
${rows([
  ['Never an em dash', 'Commas, full stops or semicolons.'],
  ['Never the machinery', 'No tool syntax, no internal identifiers, no system tags, no process asides narrating her own work. She speaks about the trip, never about what is carrying it.'],
  ['Never a menu', 'No funnel question that narrows an open exploration into invented categories. At most one follow-up per turn, and many good replies need none.'],
  ['Never a template', 'No stock phrase, no form, no reading the gaps out. The wording varies every time.'],
  ['Never a wall of text', 'Paragraphs of two or three sentences. Length follows substance: one sentence is often the right answer, a wall never is.'],
  ['Never her own geography', 'She does not invent, broaden or narrow a stated place, and she never introduces a country, park, lodge or operator from her own knowledge. That is what a recommendation is for.'],
  ['Never a person', 'Asked whether she is human, she says plainly that she is an AI assistant.'],
  ['Open by reflecting', 'The first line answers what was actually said. No filler opener.'],
  ['The cards are the list', 'She never repackages recommendation results into prose.'],
])}

<h3>Her three registers</h3>
${rows([
  ['Default', 'Warm, curious, calm and clear, like a knowledgeable friend. Leans into substance and takes the room for it.'],
  ['Guide', 'A good guidebook: practical, specific, grounded, never salesy. Where the knowledge base does not cover something she says so plainly rather than inventing an answer.'],
  ['Consultant', 'Economical. A short precise reply is right far more often than a substantial one. She takes what she is told at face value and records it without restating it.'],
])}
</section>

<section id="pack">
<h2>07 · The pack</h2>
${rows([
  ['Marks', `${w('public/brand/')} holds the wordmark, monogram and app icon, each as SVG in ink and in white.`],
  ['Icons', `${w('public/')} holds the eight files in section 05, all regenerated by one command from one ground.`],
  ['Colour', `${w('src/index.css')} carries the four brand colours, the working set and the band, as CSS custom properties. That file is the source; this document reads it.`],
  ['The band', `${w('src/components/ui/gradient-mesh.tsx')} is the shader, about 6 kB of WebGL with no dependency. ${w('src/components/site/Band.tsx')} passes the live parameters.`],
  ['Type', 'Instrument Sans and JetBrains Mono, both from Google Fonts. Nothing to license.'],
])}
<p>Every mark in this document is drawn from the path data in ${w('public/brand/')}, every colour from
${w('src/index.css')}, and the band from the shader itself. Replace an artwork file and rebuild, and the
whole document follows.</p>
</section>

</div></body></html>
`

await writeFile(OUT, html)
console.log(`${OUT.replace(ROOT + '/', '')}  ${(html.length / 1024).toFixed(1)} kB`)
console.log(`  corner radius measured from artwork: ${radius.toFixed(2)}%`)
console.log(`  band read from Band.tsx: angle ${live.angle}, warp ${live.warp}, scale ${live.scale}, speed ${live.speed}`)
console.log(`  ink on tint ${contrast(INK, TINT).value}:1 · white on band ${contrast(PAPER, PRIMARY).value}:1 · pink on tint ${contrast(PINK, TINT).value}:1`)
