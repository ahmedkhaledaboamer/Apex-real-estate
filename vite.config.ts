import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Stable vendor chunks (client only): they rarely change, so returning visitors keep them cached across deploys. */
function vendorChunks(id: string) {
  if (!id.includes('node_modules')) return undefined
  if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
  if (id.includes('@tanstack')) return 'vendor-tanstack'
  if (/[\\/]node_modules[\\/](@reduxjs|react-redux|redux|immer|reselect|use-sync-external-store)[\\/]/.test(id)) return 'vendor-redux'
  return undefined
}

export default defineConfig({
  plugins: [
    // TanStack Start: file-based routing (generates src/routeTree.gen.ts), SSR, and static prerendering.
    // Must come before react().
    tanstackStart({
      prerender: {
        enabled: true,
        // Follow every <Link> from the pages it renders, so all property / project / article pages
        // are generated as static HTML without listing them by hand.
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
        // Filtered URLs (/buy?location=…) map to the same file as /buy — prerender the clean page only;
        // filters are applied in the browser from the URL.
        filter: (page) => !page.path.includes('?'),
      },
      // App shell for any URL that wasn't prerendered, written as /404.html — static hosts serve it for
      // unknown paths, the app boots and the router shows the right page (or the branded 404).
      // maskPath must not be "/", otherwise the shell takes the home page's slot and / is never prerendered.
      spa: { enabled: true, maskPath: '/app-shell', prerender: { outputPath: '/404' } },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    // Inline only truly tiny assets; photos stay as separate cacheable files.
    assetsInlineLimit: 2048,
  },
  environments: {
    client: {
      build: {
        rollupOptions: { output: { manualChunks: vendorChunks } },
      },
    },
  },
})
