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
  { id: 's16', name: 'scale 1.6', params: { scale: 1.6 } },
  { id: 's17', name: 'scale 1.7', params: { scale: 1.7 } },
  { id: 's18', name: 'scale 1.8', params: { scale: 1.8 } },
  { id: 's20', name: 'scale 2.0', params: { scale: 2.0 } },
  { id: 's14', name: 'scale 1.4', params: { scale: 1.4 }, note: 'The lower end of the range, for reference.' },
]

const SIZES = [180, 120, 64, 32]
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
  const qs = new URLSearchParams({ g: 'mesh', s: String(size), shape: 'tile', ...Object.fromEntries(Object.entries(recipe.params).map(([k, v]) => [k, String(v)])) })
  await tab.goto(`http://127.0.0.1:${port}/scripts/og/icon-variants.html?${qs}`, { waitUntil: 'networkidle0' })
  await tab.evaluate(() => window.cardReady)
  const buf = await tab.screenshot({ type: 'png', encoding: 'base64', omitBackground: true })
  await tab.close()
  return `data:image/png;base64,${buf}`
}

const images = {}
for (const r of RECIPES) {
  images[r.id] = {}
  for (const s of SIZES) images[r.id][s] = await shot(r, s)
  console.log(`  ${r.id}: ${SIZES.length} renders`)
}

const params = (p) => Object.entries(p).map(([k, v]) => `${k}=${v}`).join('&')

const sheet = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1080px;font:400 15px/1.5 'Instrument Sans',sans-serif;color:#281131;background:#fff;padding:40px 44px 48px}
h1{font-size:27px;font-weight:700;letter-spacing:-.02em;padding-bottom:16px;border-bottom:2px solid #281131}
.lede{color:#685A6E;font-size:15px;margin-top:14px;max-width:760px}
.row{margin-top:30px;padding-top:22px;border-top:1px solid #F0DCD4}
h2{font-size:19px;font-weight:600}
.params{font:500 12px/1.4 'JetBrains Mono',monospace;color:#FF5C6C;margin-top:5px}
.note{color:#685A6E;font-size:14px;margin-top:5px}
.line{display:flex;align-items:flex-end;gap:28px;margin-top:18px}
figure{margin:0;text-align:center}
figure img{display:block;border-radius:0}
figcaption{font:400 10px/1.3 'JetBrains Mono',monospace;color:#685A6E;margin-top:8px}
.home{margin-left:8px;padding-left:28px;border-left:1px solid #F0DCD4;display:flex;gap:20px;align-items:flex-end}
.springboard{background:#1A0B20;padding:14px;border-radius:18px}
.springboard img{width:76px;height:76px;border-radius:17px}
.springboard figcaption{color:#C9B6BC;margin-top:7px}
</style>
<h1>The fold, between 1.4 and 2.0</h1>
<p class="lede">The sweep's own parameters, only scale moving: warp 0.26, bias -0.06, seed and time fixed, no blur. Drawn as the artwork's rounded tile to match the sweep. The files that ship stay square, because iOS and Android round them themselves.</p>
${RECIPES.map(
  (r) => `<div class="row">
  <h2>${r.name}</h2>
  <p class="params">${params(r.params)}</p>
  ${r.note ? `<p class="note">${r.note}</p>` : ''}
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
