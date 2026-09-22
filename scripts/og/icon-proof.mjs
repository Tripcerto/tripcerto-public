/* The proof sheet for the icon set: it reads what is in public/ and lays the
   real bytes out, so what you look at is what the site serves rather than
   what a renderer would produce if asked again.

   Run from the repo root: node scripts/og/icon-proof.mjs
*/

import { createServer } from 'node:http'
import { createReadStream, readFileSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const PUBLIC = join(ROOT, 'public')
const OUT = join(ROOT, 'scripts/og/out')

const uri = (file) => `data:image/png;base64,${readFileSync(join(PUBLIC, file)).toString('base64')}`

/* Each ICO directory entry holds a whole PNG, so the sizes can be pulled back
   out and shown separately rather than leaving the browser to pick one. */
function icoEntries(file) {
  const data = readFileSync(join(PUBLIC, file))
  const count = data.readUInt16LE(4)
  const out = []
  for (let i = 0; i < count; i++) {
    const off = 6 + i * 16
    const size = data.readUInt8(off) || 256
    const bytes = data.readUInt32LE(off + 8)
    const start = data.readUInt32LE(off + 12)
    out.push({ size, uri: `data:image/png;base64,${data.subarray(start, start + bytes).toString('base64')}` })
  }
  return out.sort((a, b) => b.size - a.size)
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' }

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

const full = uri('icon-512.png')
const ico = icoEntries('favicon.ico')

const sheet = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1080px;font:400 15px/1.5 'Instrument Sans',sans-serif;color:#281131;background:#fff;padding:40px 44px 48px}
h1{font-size:27px;font-weight:700;letter-spacing:-.02em;padding-bottom:16px;border-bottom:2px solid #281131}
.row{margin-top:32px}
h2{font-size:19px;font-weight:600}
.note{color:#685A6E;font-size:14px;margin-top:4px;max-width:820px}
.line{display:flex;align-items:flex-end;gap:30px;margin-top:18px;flex-wrap:wrap}
figure{margin:0;text-align:center}
figure img{display:block}
figcaption{font:400 10px/1.3 'JetBrains Mono',monospace;color:#685A6E;margin-top:8px}
.crop img{border-radius:50%}
.plate{margin-top:20px;background:#1A0B20;border-radius:20px;padding:26px 30px}
.plate figcaption{color:#C9B6BC}
.plate .line{margin-top:0}
.ios img{border-radius:22.5%}
</style>
<h1>The icon set — what public/ holds</h1>

<div class="row">
  <h2>Full bleed — everywhere that masks for us</h2>
  <p class="note">apple-touch-icon 180, icon-192, icon-512. Square and opaque to the corner: iOS and Android round and mask their own way, and a tile that arrives pre-rounded is either rounded twice or shows its corners against the launcher.</p>
  <div class="line">
    <figure><img src="${uri('icon-512.png')}" width="180" height="180"><figcaption>icon-512</figcaption></figure>
    <figure><img src="${uri('icon-192.png')}" width="120" height="120"><figcaption>icon-192</figcaption></figure>
    <figure><img src="${uri('apple-touch-icon.png')}" width="90" height="90"><figcaption>apple-touch 180</figcaption></figure>
    <figure><img src="${full}" width="64" height="64"><figcaption>at 64</figcaption></figure>
    <figure><img src="${full}" width="32" height="32"><figcaption>at 32</figcaption></figure>
  </div>
</div>

<div class="row">
  <h2>Maskable — a different drawing, not a smaller one</h2>
  <p class="note">Android crops a manifest icon to a circle of 80% of the image. The ground reaches all four edges and the monogram sits at 56%, inside that circle. The right-hand pair is the crop applied.</p>
  <div class="line">
    <figure><img src="${uri('icon-maskable-512.png')}" width="180" height="180"><figcaption>maskable 512</figcaption></figure>
    <figure><img src="${uri('icon-maskable-192.png')}" width="120" height="120"><figcaption>maskable 192</figcaption></figure>
    <figure class="crop"><img src="${uri('icon-maskable-512.png')}" width="180" height="180"><figcaption>circle crop</figcaption></figure>
    <figure class="crop"><img src="${uri('icon-maskable-192.png')}" width="120" height="120"><figcaption>circle crop</figcaption></figure>
  </div>
</div>

<div class="row">
  <h2>favicon.ico — the one raster nothing masks</h2>
  <p class="note">So it carries the artwork's own rounded tile, with the corners empty rather than white, matching favicon.svg.</p>
  <div class="line">
    ${ico.map((e) => `<figure><img src="${e.uri}" width="${e.size}" height="${e.size}"><figcaption>${e.size}</figcaption></figure>`).join('')}
  </div>
</div>

<div class="plate">
  <div class="line">
    <figure class="ios"><img src="${full}" width="120" height="120"><figcaption>home screen</figcaption></figure>
    <figure class="ios"><img src="${full}" width="60" height="60"><figcaption>settings row</figcaption></figure>
    <figure class="crop"><img src="${uri('icon-maskable-512.png')}" width="120" height="120"><figcaption>masked launcher</figcaption></figure>
    <figure><img src="${ico[0].uri}" width="48" height="48"><figcaption>ico 48 on ink</figcaption></figure>
  </div>
</div>
`

await writeFile(join(OUT, 'icon-proof.html'), sheet)

const { server, port } = await serve(ROOT)
const { default: puppeteer } = await import(PUPPETEER)
const browser = await puppeteer.launch({ headless: true, args: ['--force-color-profile=srgb', '--hide-scrollbars'] })
const problems = []
const tab = await browser.newPage()
tab.on('pageerror', (e) => problems.push(String(e)))
tab.on('console', (m) => m.type() === 'error' && problems.push(m.text()))
await tab.setViewport({ width: 1080, height: 900, deviceScaleFactor: 2 })
await tab.goto(`http://127.0.0.1:${port}/scripts/og/out/icon-proof.html`, { waitUntil: 'networkidle0' })
await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: join(OUT, 'icon-proof.png'), fullPage: true })
await tab.close()
await browser.close()
server.close()

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`scripts/og/out/icon-proof.png  ${((await stat(join(OUT, 'icon-proof.png'))).size / 1024).toFixed(0)} kB`)
