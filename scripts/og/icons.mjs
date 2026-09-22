/* The icon set's two missing pieces.

   What ships already is right: favicon.svg is the app icon in coral, the ICO
   carries 16/32/48, and apple-touch-icon and the two manifest PNGs are the
   FULL-BLEED square tile, which is correct because iOS and Android apply
   their own mask and a pre-rounded tile would be rounded twice.

   Two things that set does not cover:

   1. MASKABLE. Android crops a manifest icon to a circle of 80% of the tile.
      The mark in icon-512.png spans 11.7%-88.1% across, so its corners sit
      241px from the centre against a 205px safe radius: the c loses its edge
      on any launcher that masks. A maskable icon is the same mark on the same
      coral, drawn small enough to survive the crop, declared separately so
      the unmasked contexts keep the tight one.

   2. SAFARI PINNED TAB. It wants a single-path monochrome SVG with no
      background; it ignores favicon.svg and falls back to a screenshot.

   Run from the repo root: node scripts/og/icons.mjs
*/

import { createServer } from 'node:http'
import { createReadStream, readFileSync } from 'node:fs'
import { writeFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const PUBLIC = join(ROOT, 'public')

const CORAL = '#FF5C6C'

/* The safe circle is 80% of the tile. A box of the monogram's aspect fits
   inside it when its half-diagonal reaches the radius, which puts the mark at
   64% of the tile's width rather than the 76% the unmasked icon uses. */
const MASKABLE_MARK_WIDTH = 0.64

const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' }

function serve(root) {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
      const file = join(root, path)
      if (!file.startsWith(root)) return res.writeHead(403).end()
      try {
        if (!(await stat(file)).isFile()) throw new Error('not a file')
      } catch {
        return res.writeHead(404).end()
      }
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => ready({ server, port: server.address().port }))
  })
}

const page = (size) => `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden}
  body{background:${CORAL};display:flex;align-items:center;justify-content:center}
  img{width:${Math.round(size * MASKABLE_MARK_WIDTH)}px;height:auto;display:block}
</style><img src="/public/brand/monogram-white.svg" alt="">
<script>window.cardReady=Promise.all([...document.images].map(i=>i.complete?null:new Promise(r=>i.onload=i.onerror=r)))</script>`

const { server, port } = await serve(ROOT)
const { default: puppeteer } = await import(PUPPETEER)
const browser = await puppeteer.launch({ headless: true, args: ['--force-color-profile=srgb', '--hide-scrollbars'] })

for (const size of [192, 512]) {
  const tab = await browser.newPage()
  await tab.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  await tab.setContent(page(size).replace('/public/brand/', `http://127.0.0.1:${port}/public/brand/`), {
    waitUntil: 'networkidle0',
  })
  await tab.evaluate(() => window.cardReady)
  const out = join(PUBLIC, `icon-maskable-${size}.png`)
  await tab.screenshot({ path: out, type: 'png' })
  await tab.close()
  console.log(`  public/icon-maskable-${size}.png  ${((await stat(out)).size / 1024).toFixed(0)} kB`)
}

await browser.close()
server.close()

/* Safari wants the mark alone, one colour, no ground: it applies the tab's
   own tint to whatever is opaque. */
const monogram = readFileSync(join(PUBLIC, 'brand/monogram.svg'), 'utf8')
const mask = monogram.replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#000000"')
if (mask === monogram) throw new Error('mask-icon: no fill was rewritten — check brand/monogram.svg')
await writeFile(join(PUBLIC, 'mask-icon.svg'), mask)
console.log(`  public/mask-icon.svg  ${(mask.length / 1024).toFixed(1)} kB`)

console.log('\nDone.')
