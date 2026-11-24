import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

/** Router factory used by TanStack Start on the server (prerender) and in the browser. */
export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
