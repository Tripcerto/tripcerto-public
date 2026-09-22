/* Renders the app icon on its three grounds, at the sizes it is actually met
   at, and lays them out as one sheet to choose from.

   Run from the repo root: node scripts/og/icon-sheet.mjs
*/

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const OUT = join(ROOT, 'scripts/og/out')

const GROUNDS = [
  { id: 'coral', name: 'Flat coral', note: 'What ships today. One colour, reads at 16px.' },
  { id: 'band', name: 'The band', note: 'The Ember ramp, pink through coral into peach.' },
  { id: 'mesh', name: 'The band, warped', note: "The hero's own shader, at a fixed seed." },
]
const SIZES = [512, 180, 64, 32, 16]

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

function serve(root) {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const asked = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
      /* Chrome asks for this on every navigation; a 404 would fail the run. */
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
const shot = async (g, s, pad = false) => {
  const tab = await browser.newPage()
  await tab.setViewport({ width: s, height: s, deviceScaleFactor: 2 })
  tab.on('pageerror', (e) => problems.push(`${g}@${s}: ${e}`))
  tab.on('console', (m) => m.type() === 'error' && problems.push(`${g}@${s}: ${m.text()}`))
  await tab.goto(`http://127.0.0.1:${port}/scripts/og/icon-variants.html?g=${g}&s=${s}${pad ? '&pad=1' : ''}`, {
    waitUntil: 'networkidle0',
  })
  await tab.evaluate(() => window.cardReady)
  const buf = await tab.screenshot({ type: 'png', encoding: 'base64' })
  await tab.close()
  return `data:image/png;base64,${buf}`
}

const images = {}
for (const g of GROUNDS) {
  images[g.id] = {}
  for (const s of SIZES) images[g.id][s] = await shot(g.id, s)
  images[g.id].mask = await shot(g.id, 512, true)
  console.log(`  ${g.id}: ${SIZES.length + 1} renders`)
}

const sheet = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1000px;font:400 15px/1.5 'Instrument Sans',sans-serif;color:#2B1220;background:#fff;padding:40px 44px 48px}
h1{font-size:26px;font-weight:600;letter-spacing:-.02em;padding-bottom:16px;border-bottom:2px solid #2B1220}
.row{margin-top:34px;padding-top:22px;border-top:1px solid #F0DCD4}
.row:first-of-type{border-top:0}
h2{font-size:19px;font-weight:600}
.note{color:#6E5A60;font-size:14px;margin-top:3px}
.line{display:flex;align-items:flex-end;gap:30px;margin-top:18px;flex-wrap:wrap}
figure{margin:0;text-align:center}
figure img{display:block;image-rendering:auto}
figcaption{font:400 10px/1.3 'JetBrains Mono',monospace;color:#6E5A60;margin-top:8px}
.mask{margin-left:16px;padding-left:30px;border-left:1px solid #F0DCD4}
.crop{position:relative;width:120px;height:120px}
.crop img{width:120px;height:120px;border-radius:50%}
</style>
<h1>App icon — three grounds</h1>
${GROUNDS.map(
  (g) => `<div class="row">
  <h2>${g.name}</h2><p class="note">${g.note}</p>
  <div class="line">
    ${SIZES.map((s) => `<figure><img src="${images[g.id][s]}" width="${s > 180 ? 180 : s}" height="${s > 180 ? 180 : s}"><figcaption>${s}px</figcaption></figure>`).join('')}
    <div class="mask"><figure><div class="crop"><img src="${images[g.id].mask}"></div><figcaption>maskable, cropped</figcaption></figure></div>
  </div>
</div>`,
).join('')}
`

const sheetFile = join(OUT, 'icon-sheet.html')
await writeFile(sheetFile, sheet)

const tab = await browser.newPage()
await tab.setViewport({ width: 1000, height: 900, deviceScaleFactor: 2 })
await tab.goto(`http://127.0.0.1:${port}/scripts/og/out/icon-sheet.html`, { waitUntil: 'networkidle0' })
await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: join(OUT, 'icon-sheet.png'), fullPage: true })
await tab.close()

await browser.close()
server.close()

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`\nscripts/og/out/icon-sheet.png  ${((await stat(join(OUT, 'icon-sheet.png'))).size / 1024).toFixed(0)} kB`)
