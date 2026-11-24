import { createFileRoute } from '@tanstack/react-router'

/**
 * Build-time only: the SPA shell is prerendered from this path into /404.html (see vite.config.ts).
 * Static hosts serve that file for any URL without a prerendered page; the app then boots and the
 * router renders the real route — or the branded 404. Nothing links here, so it is never crawled.
 */
export const Route = createFileRoute('/app-shell')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex' }] }),
  component: () => null,
})
