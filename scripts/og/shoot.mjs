/* Renders the social cards to PNG.

   The card is an ES module page that reads brand artwork out of public/, so it
   is served over HTTP rather than opened from disk: Chrome refuses a module
   import on a file:// origin, and the SVGs would be cross-origin anyway.

   Usage, from the repo root:
     node scripts/og/shoot.mjs                  every variant, home copy
     node scripts/og/shoot.mjs --variant c      one variant
     node scripts/og/shoot.mjs --pick c         write public/og-image.png, the
                                                one card every page serves,
                                                from variant c's home copy
*/

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { mkdir, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/* Puppeteer is not a dependency of this repo — the cards are generated now
   and again on a developer's machine, and the site does not need a browser in
   its install. It is borrowed from the monorepo alongside it. */
const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const OUT = join(ROOT, 'scripts/og/out')
const PUBLIC = join(ROOT, 'public')

const VARIANTS = ['a', 'b', 'c', 'd', 'e']

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

function serve(root) {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      /* The card asks for paths under the repo root only; anything that
         normalises outside it is refused rather than read. */
      const asked = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
      /* The browser asks for /favicon.ico on every navigation whatever the
         page links to; it lives under public/ here, and a 404 would be
         reported as a page error and fail the run. */
      const path = asked === '/favicon.ico' ? '/public/favicon.ico' : asked
      const file = join(root, path)
      if (!file.startsWith(root)) {
        res.writeHead(403).end()
        return
      }
      try {
        const info = await stat(file)
        if (!info.isFile()) throw new Error('not a file')
      } catch {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => ready({ server, port: server.address().port }))
  })
}

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? null : args[i + 1]
}

const pick = flag('pick')
const only = flag('variant')

const { server, port } = await serve(ROOT)
const { default: puppeteer } = await import(PUPPETEER)

const browser = await puppeteer.launch({
  headless: true,
  args: [
    /* The band is WebGL; headless has no GPU, so ANGLE is pointed at the
       software rasteriser. Without this the shader silently does not run and
       the still CSS gradient is what gets photographed. */
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--force-color-profile=srgb',
    '--font-render-hinting=none',
    '--hide-scrollbars',
  ],
})

async function shoot(url, out, viewport = { width: 1200, height: 630 }) {
  const page = await browser.newPage()
  await page.setViewport({ ...viewport, deviceScaleFactor: 2 })
  const problems = []
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()))
  page.on('pageerror', (e) => problems.push(String(e)))

  await page.goto(url, { waitUntil: 'networkidle0' })
  /* The page publishes this once its fonts are measured, its artwork decoded
     and the band drawn; without it the shot catches fallback type. */
  await page.evaluate(() => window.cardReady)
  await new Promise((r) => setTimeout(r, 150))

  await page.screenshot({ path: out, type: 'png', fullPage: viewport.full === true })
  await page.close()

  if (problems.length) console.error(`  ! ${out}\n    ${problems.join('\n    ')}`)
  const { size } = await stat(out)
  console.log(`  ${out.replace(ROOT + '/', '')}  ${(size / 1024).toFixed(0)} kB`)
  return problems
}

await mkdir(OUT, { recursive: true })
const failures = []

if (pick) {
  if (!VARIANTS.includes(pick)) throw new Error(`--pick must be one of ${VARIANTS.join(', ')}`)
  console.log(`Writing public/og-image.png from variant ${pick}:`)
  failures.push(
    ...(await shoot(`http://127.0.0.1:${port}/scripts/og/card.html?v=${pick}&page=home`, join(PUBLIC, 'og-image.png'))),
  )
} else {
  const list = only ? [only] : VARIANTS
  console.log('Rendering card options:')
  for (const v of list) {
    failures.push(...(await shoot(`http://127.0.0.1:${port}/scripts/og/card.html?v=${v}`, join(OUT, `card-${v}.png`))))
  }
  /* The review sheets read the PNGs just written, so they come second. */
  console.log('Rendering review sheets:')
  for (const v of list) {
    failures.push(
      ...(await shoot(`http://127.0.0.1:${port}/scripts/og/preview.html?v=${v}`, join(OUT, `preview-${v}.png`), {
        width: 1160,
        height: 900,
        full: true,
      })),
    )
  }
}

await browser.close()
server.close()

/* A card that logged an error is a card whose band or fonts may be missing,
   and it looks plausible either way, so the run fails rather than reporting
   files written. */
if (failures.length) {
  console.error(`\n${failures.length} page error(s) — the output is not trustworthy.`)
  process.exit(1)
}
console.log('\nDone.')
