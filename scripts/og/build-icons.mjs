/* Regenerates the whole icon set from one chosen ground.

   Everything the site serves as an icon comes from here, so the set cannot
   drift apart: a favicon that is coral while the app icon is the band is the
   failure this script exists to prevent.

   Usage, from the repo root:
     node scripts/og/build-icons.mjs --ground coral
     node scripts/og/build-icons.mjs --ground band
     node scripts/og/build-icons.mjs --ground mesh --scale 1.7

   That last line is what the served set is built from. Only scale is passed:
   warp, bias, seed and time stay at the hero's own, and there is no blur,
   because lowering the fold size is what settles the tile and a blur on top
   of it flattens the surface the band is there to show.

   Writes:
     public/favicon.ico            48, 32, 16
     public/apple-touch-icon.png   180, full bleed
     public/icon-192.png           192, full bleed
     public/icon-512.png           512, full bleed
     public/icon-maskable-192.png  192, inset for Android's circular crop
     public/icon-maskable-512.png  512, inset
     public/favicon.svg            the vector one, for ground=coral or band only

   favicon.svg stays a flat fill for ground=mesh: an SVG favicon carrying a
   base64 raster of a shader is both large and pointless at 16px, so the mesh
   set keeps the coral vector and the rasters carry the band.
*/

import { createServer } from 'node:http'
import { createReadStream, readFileSync } from 'node:fs'
import { stat, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const PUBLIC = join(ROOT, 'public')

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const ground = flag('ground', 'coral')
if (!['coral', 'band', 'mesh'].includes(ground)) throw new Error(`--ground must be coral, band or mesh`)

/* Only meaningful for the mesh ground; harmless otherwise. */
const tune = new URLSearchParams()
for (const k of ['scale', 'warp', 'bias', 'time', 'blur', 'sat']) {
  const v = flag(k, null)
  if (v !== null) tune.set(k, v)
}

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

/* An ICO directory whose entries are whole PNG files. Every browser that is
   still asked for a .ico understands PNG-in-ICO, and it keeps this script
   free of a bitmap encoder. Width and height of 256 or more are stored as 0. */
function ico(pngs) {
  const count = pngs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)

  const entries = []
  let offset = 6 + count * 16
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

const { server, port } = await serve(ROOT)
const { default: puppeteer } = await import(PUPPETEER)
const browser = await puppeteer.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb', '--hide-scrollbars'],
})

const problems = []
/* The tight crop the shipped rasters use, and the inset the Android circle
   needs. Measured, not guessed: at 0.76 the mark's corners sit 241px from
   centre on a 512 tile against a 205px safe radius, so the maskable one has
   to come in. */
const MARK_FULL = 0.76
const MARK_MASKABLE = 0.56

async function render(size, { mark = MARK_FULL, shape = 'square', transparent = false } = {}) {
  const tab = await browser.newPage()
  /* deviceScaleFactor 1 with an explicit size, so the PNG is exactly the
     dimensions its filename claims. */
  await tab.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  tab.on('pageerror', (e) => problems.push(`${size} ${shape}: ${e}`))
  tab.on('console', (m) => m.type() === 'error' && problems.push(`${size} ${shape}: ${m.text()}`))
  const qs = new URLSearchParams(tune)
  qs.set('g', ground)
  qs.set('s', String(size))
  qs.set('shape', shape)
  qs.set('mark', String(mark))
  await tab.goto(`http://127.0.0.1:${port}/scripts/og/icon-variants.html?${qs}`, { waitUntil: 'networkidle0' })
  await tab.evaluate(() => window.cardReady)
  /* The rounded tile keeps its corners EMPTY rather than white; the square
     rasters stay opaque, because iOS composites a transparent touch icon
     onto black. */
  const buf = await tab.screenshot({ type: 'png', omitBackground: transparent })
  await tab.close()
  return Buffer.from(buf)
}

const write = async (name, data) => {
  await writeFile(join(PUBLIC, name), data)
  console.log(`  public/${name}  ${(data.length / 1024).toFixed(1)} kB`)
}

console.log(`Ground: ${ground}${tune.size ? ` (${tune})` : ''}`)

await write('apple-touch-icon.png', await render(180))
await write('icon-192.png', await render(192))
await write('icon-512.png', await render(512))
await write('icon-maskable-192.png', await render(192, { mark: MARK_MASKABLE }))
await write('icon-maskable-512.png', await render(512, { mark: MARK_MASKABLE }))

/* The ICO is the one raster nothing masks for us, so it carries the rounded
   tile with transparent corners, matching favicon.svg. */
const icoPngs = []
for (const size of [48, 32, 16]) {
  icoPngs.push({ size, data: await render(size, { shape: 'tile', transparent: true }) })
}
await write('favicon.ico', ico(icoPngs))

/* The vector favicon: a flat fill for coral, the still ramp for band. The
   mesh ground keeps coral here on purpose (see the header). */
const appicon = readFileSync(join(PUBLIC, 'brand/appicon.svg'), 'utf8')
if (ground === 'band') {
  const stops = ['#E8437E', '#FF5C6C', '#FF9B7A']
    .map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`)
    .join('')
  const withRamp = appicon
    .replace('<path', `<defs><linearGradient id="ramp" x1="-0.071" y1="0.399" x2="1.071" y2="0.601">${stops}</linearGradient></defs><path`)
    .replace(/fill="#[0-9A-Fa-f]{6}"/, 'fill="url(#ramp)"')
  if (!withRamp.includes('url(#ramp)')) throw new Error('favicon.svg: no fill was rewritten')
  await write('favicon.svg', Buffer.from(withRamp))
} else {
  const coral = appicon.replace(/fill="#[0-9A-Fa-f]{6}"/, 'fill="#FF5C6C"')
  if (!coral.includes('#FF5C6C')) throw new Error('favicon.svg: no fill was rewritten')
  await write('favicon.svg', Buffer.from(coral))
}

await browser.close()
server.close()

if (problems.length) {
  console.error(`\n${problems.length} problem(s) — the icons are not trustworthy:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log('\nDone. Bump ?v= in index.html and the four page entries if these are replacing served files.')
