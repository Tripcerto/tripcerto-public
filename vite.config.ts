import { existsSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* The dev server answers the clean URLs Vercel serves in production
   (vercel.json: cleanUrls), so /engage is engage/index.html here too. */
function cleanUrls(): Plugin {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url ?? '').split('?')[0]
        if (path !== '/' && !extname(path) && existsSync(join(server.config.root, path, 'index.html'))) {
          req.url = `${path.replace(/\/$/, '')}/index.html${req.url?.slice(path.length) ?? ''}`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanUrls(), react(), tailwindcss()],
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
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
