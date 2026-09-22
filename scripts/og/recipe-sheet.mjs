/* Four shader recipes for the warped app icon, rendered at the sizes the icon
   is actually met at.

   The four come from independent reads of the same question — how to take the
   smoke out of a 4.7-scale field inside a square tile — and they disagree on
   which lever does it: fold size, ramp displacement, optical blur, or the
   frequency the mark itself occupies.

   Run from the repo root: node scripts/og/recipe-sheet.mjs
*/

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const OUT = join(ROOT, 'scripts/og/out')

const RECIPES = [
  {
    id: 'shipped',
    name: 'Fold scale, the lighter blur',
    params: { scale: 1.0, warp: 0.12, bias: -0.06, time: 63, blur: 8, sat: 100 },
    note: 'One fold across the tile, with just enough blur to clean the ramp.',
  },
  {
    id: 'band-blur',
    name: 'Fold scale at the band blur — the set that is built',
    params: { scale: 1.0, warp: 0.12, bias: -0.06, time: 63, blur: 12, sat: 100 },
    note: "12px is what the Close pill uses — the one element standing on the band.",
  },
  {
    id: 'displacement',
    name: 'Displacement — hold the ramp monotone',
    params: { scale: 2.2, warp: 0.1, bias: 0, time: 63, blur: 16, sat: 110 },
    note: 'More folds, but too little warp for any of them to fold back.',
  },
  {
    id: 'optical',
    name: 'Optical — the hero field, blurred hard',
    params: { scale: 4.7, warp: 0.26, bias: -0.06, time: 63, blur: 32, sat: 115 },
    note: 'The hero untouched, with the frequencies taken out afterwards.',
  },
]

const SIZES = [512, 180, 64, 32]
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

function serve(root) {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const asked = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
      const path = asked === '/favicon.ico' ? '/public/favicon.ico' : asked
      const file = join(root, path)
      if (!file.startsWith(root)) return res.writeHead(403).end()
      try {
        if (!(await stat(file)).isFile()) throw new Error('missing')
      } catch {
        return res.writeHead(404).end()
      }
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => ready({ server, port: server.address().port }))
  })
}

await mkdir(OUT, { recursive: true })
const { server, port } = await serve(ROOT)
const { default: puppeteer } = await import(PUPPETEER)
const browser = await puppeteer.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb', '--hide-scrollbars'],
})

const problems = []
const shot = async (recipe, size) => {
  const tab = await browser.newPage()
  await tab.setViewport({ width: size, height: size, deviceScaleFactor: 2 })
  tab.on('pageerror', (e) => problems.push(`${recipe.id}@${size}: ${e}`))
  tab.on('console', (m) => m.type() === 'error' && problems.push(`${recipe.id}@${size}: ${m.text()}`))
  const qs = new URLSearchParams({ g: 'mesh', s: String(size), shape: 'square', mark: '0.76', ...Object.fromEntries(Object.entries(recipe.params).map(([k, v]) => [k, String(v)])) })
  await tab.goto(`http://127.0.0.1:${port}/scripts/og/icon-variants.html?${qs}`, { waitUntil: 'networkidle0' })
  await tab.evaluate(() => window.cardReady)
  const buf = await tab.screenshot({ type: 'png', encoding: 'base64' })
  await tab.close()
  return `data:image/png;base64,${buf}`
}

const images = {}
for (const r of RECIPES) {
  images[r.id] = {}
  for (const s of SIZES) images[r.id][s] = await shot(r, s)
  console.log(`  ${r.id}: ${SIZES.length} renders`)
}

const params = (p) => `scale ${p.scale} · warp ${p.warp} · bias ${p.bias} · blur ${p.blur} · sat ${p.sat}`

const sheet = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1080px;font:400 15px/1.5 'Instrument Sans',sans-serif;color:#2B1220;background:#fff;padding:40px 44px 48px}
h1{font-size:27px;font-weight:700;letter-spacing:-.02em;padding-bottom:16px;border-bottom:2px solid #2B1220}
.lede{color:#6E5A60;font-size:15px;margin-top:14px;max-width:760px}
.row{margin-top:30px;padding-top:22px;border-top:1px solid #F0DCD4}
h2{font-size:19px;font-weight:600}
.params{font:500 12px/1.4 'JetBrains Mono',monospace;color:#FF5C6C;margin-top:5px}
.note{color:#6E5A60;font-size:14px;margin-top:5px}
.line{display:flex;align-items:flex-end;gap:28px;margin-top:18px}
figure{margin:0;text-align:center}
figure img{display:block;border-radius:0}
figcaption{font:400 10px/1.3 'JetBrains Mono',monospace;color:#6E5A60;margin-top:8px}
.home{margin-left:8px;padding-left:28px;border-left:1px solid #F0DCD4;display:flex;gap:20px;align-items:flex-end}
.springboard{background:#1C0C15;padding:14px;border-radius:18px}
.springboard img{width:76px;height:76px;border-radius:17px}
.springboard figcaption{color:#C9B6BC;margin-top:7px}
</style>
<h1>The warped app icon — four recipes</h1>
<p class="lede">The same tile, the same seed and the same mark. Only the shader field changes. Right-hand plate is the icon at home-screen size on the dark page colour, with iOS's own rounding applied.</p>
${RECIPES.map(
  (r) => `<div class="row">
  <h2>${r.name}</h2>
  <p class="params">${params(r.params)}</p>
  <p class="note">${r.note}</p>
  <div class="line">
    ${SIZES.map((s) => `<figure><img src="${images[r.id][s]}" width="${s > 180 ? 168 : s}" height="${s > 180 ? 168 : s}"><figcaption>${s}px</figcaption></figure>`).join('')}
    <div class="home"><figure class="springboard"><img src="${images[r.id][180]}"><figcaption>home screen</figcaption></figure></div>
  </div>
</div>`,
).join('')}
`

await writeFile(join(OUT, 'recipe-sheet.html'), sheet)

const tab = await browser.newPage()
await tab.setViewport({ width: 1080, height: 900, deviceScaleFactor: 2 })
await tab.goto(`http://127.0.0.1:${port}/scripts/og/out/recipe-sheet.html`, { waitUntil: 'networkidle0' })
await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: join(OUT, 'recipe-sheet.png'), fullPage: true })
await tab.close()

await browser.close()
server.close()

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`\nscripts/og/out/recipe-sheet.png  ${((await stat(join(OUT, 'recipe-sheet.png'))).size / 1024).toFixed(0)} kB`)
