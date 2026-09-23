import { existsSync, readFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { createServer, type Connect, type ResolvedConfig, type ViteDevServer } from 'vite'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* The dev server and `vite preview` answer the clean URLs Vercel serves in
   production (vercel.json: cleanUrls), so /engage is engage/index.html
   here too: from the source root in dev, from the build in preview. */
function rewriteCleanUrls(dir: string): Connect.NextHandleFunction {
  return (req, _res, next) => {
    const path = (req.url ?? '').split('?')[0]
    if (path !== '/' && !extname(path) && existsSync(join(dir, path, 'index.html'))) {
      req.url = `${path.replace(/\/$/, '')}/index.html${req.url?.slice(path.length) ?? ''}`
    }
    next()
  }
}

function cleanUrls(): Plugin {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use(rewriteCleanUrls(server.config.root))
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteCleanUrls(resolve(server.config.root, server.config.build.outDir)))
    },
  }
}

const ROOT = '<div id="root"></div>'
const MODULE_SCRIPT = /<script type="module" src="([^"]+)"><\/script>/g

type Load = (id: string) => Promise<Record<string, unknown>>

/* The markup for the page an HTML file loads. The file's one module script
   is the page's entry, whose default export is the page it hydrates
   (src/boot.tsx); src/prerender.tsx renders that same export, so the
   markup and the tree that takes it over are one import. `load` imports a
   module by its URL from the root, through Vite or the test runner. */
export async function renderPage(file: string, load: Load): Promise<string> {
  const scripts = [...readFileSync(file, 'utf8').matchAll(MODULE_SCRIPT)].map(([, src]) => src)
  if (scripts.length !== 1) throw new Error(`${file} needs exactly one module script, its entry; it has ${scripts.length}`)
  const [script] = scripts
  const { default: page } = await load(script)
  if (typeof page !== 'function') throw new Error(`${script} must export its page as its default export`)
  const { render } = await load('/src/prerender.tsx')
  if (typeof render !== 'function') throw new Error('src/prerender.tsx must export render')
  try {
    return await render(page)
  } catch (error) {
    throw new Error(`${file} could not be rendered`, { cause: error })
  }
}

/* Every page ships with its markup already in #root, so crawlers that run
   no scripts, and readers without them, get the whole page; the browser
   hydrates it. The dev server renders the same way, so development
   hydrates what production does. The build fails on a page that throws or
   renders nothing. */
function prerender(): Plugin {
  let config: ResolvedConfig
  let pages: string[] = []
  /* The build has no dev server to load TSX through, so it runs its own
     while the pages are written. */
  let renderer: ViteDevServer | undefined

  async function close() {
    await renderer?.close()
    renderer = undefined
  }

  return {
    name: 'prerender',
    configResolved(resolved) {
      config = resolved
      const input = resolved.build.rolldownOptions.input ?? []
      pages = (typeof input === 'string' ? [input] : Array.isArray(input) ? input : Object.values(input)).map((file) => resolve(file))
    },
    async buildStart() {
      if (config.command !== 'build') return
      renderer = await createServer({
        configFile: config.configFile ?? false,
        root: config.root,
        mode: config.mode,
        logLevel: 'warn',
        appType: 'custom',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
      })
    },
    async buildEnd(error) {
      if (error) await close()
    },
    async closeBundle() {
      await close()
    },
    transformIndexHtml: {
      async handler(html, { filename, server }) {
        /* The dev server also serves pages that are not the site's, such as
           the LinkedIn banner; those are left as they are. */
        if (!pages.includes(resolve(filename))) return
        const from = server ?? renderer
        if (!from) throw new Error(`No renderer is running for ${filename}`)
        const parts = html.split(ROOT)
        if (parts.length !== 2) throw new Error(`${filename} needs exactly one empty ${ROOT} for its page`)
        const markup = await renderPage(filename, (id) => from.ssrLoadModule(id))
        return parts.join(`<div id="root">${markup}</div>`)
      },
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanUrls(), prerender(), react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  /* One HTML entry per page, each with its own title and meta. */
  build: {
    /* Breakpoints ship as min-width queries: Safari and iOS before 16.4 do not
       parse range syntax (width >= 40rem), and would lose every breakpoint. */
    cssTarget: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        engage: fileURLToPath(new URL('./engage/index.html', import.meta.url)),
        workspace: fileURLToPath(new URL('./workspace/index.html', import.meta.url)),
        pilot: fileURLToPath(new URL('./pilot/index.html', import.meta.url)),
        trust: fileURLToPath(new URL('./trust/index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./legal/privacy/index.html', import.meta.url)),
        terms: fileURLToPath(new URL('./legal/terms/index.html', import.meta.url)),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: './src/test/setup.ts',
    css: false,
    /* The brand gate sits beside the generator it checks rather than in src,
       because it reads files off disk and src is a browser-only project. */
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.{test,spec}.ts'],
  },
})
