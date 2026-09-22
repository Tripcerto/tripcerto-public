/* Renders the live band and the app icon tile for the brand kit, so the
   document shows the shader rather than a still that approximates it.

   Both come out as PNG data URIs. The kit is one file that has to survive
   being emailed, so nothing it shows may be a link.
*/

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUPPETEER = '/Users/taystyles/dev/tripcerto/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

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

export async function renderAssets(jobs) {
  const { server, port } = await serve(ROOT)
  const { default: puppeteer } = await import(PUPPETEER)
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--force-color-profile=srgb',
      '--hide-scrollbars',
    ],
  })

  const problems = []
  const out = {}

  for (const [name, job] of Object.entries(jobs)) {
    const tab = await browser.newPage()
    tab.on('pageerror', (e) => problems.push(`${name}: ${e}`))
    tab.on('console', (m) => m.type() === 'error' && problems.push(`${name}: ${m.text()}`))
    /* An icon job gives one dimension, because the tile is square. */
    await tab.setViewport({ width: job.width, height: job.height ?? job.width, deviceScaleFactor: job.scale ?? 2 })

    if (job.kind === 'band') {
      const qs = new URLSearchParams({ w: String(job.width), h: String(job.height), o: JSON.stringify(job.options) })
      await tab.goto(`http://127.0.0.1:${port}/scripts/brand/band.html?${qs}`, { waitUntil: 'networkidle0' })
    } else {
      const qs = new URLSearchParams({ g: 'mesh', shape: job.shape ?? 'tile', s: String(job.width), ...job.options })
      await tab.goto(`http://127.0.0.1:${port}/scripts/og/icon-variants.html?${qs}`, { waitUntil: 'networkidle0' })
    }

    await tab.evaluate(() => window.cardReady)
    const buf = await tab.screenshot({ type: 'png', encoding: 'base64', omitBackground: job.transparent ?? false })
    await tab.close()
    out[name] = `data:image/png;base64,${buf}`
  }

  await browser.close()
  server.close()

  if (problems.length) throw new Error(`render: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`)
  return out
}
