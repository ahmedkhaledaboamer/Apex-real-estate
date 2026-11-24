import { useSyncExternalStore } from 'react'

/**
 * Pages are prerendered to static HTML, then hydrated in the browser.
 *
 * `useIsHydrating()` is true while a component renders on the server or hydrates server HTML,
 * and false for any client-only render (client navigation, modals, re-renders after hydration).
 *
 * It is per component, so it is correct even for route chunks that load after the root layout
 * has already hydrated. Typical use: `const [x] = useState(() => hydrating ? serverValue : clientValue)`,
 * or derive "server-identical" values while hydrating and switch right after.
 */
const noopSubscribe = () => () => {}

/**
 * Search params as seen by prerendered pages. Static HTML is generated without a query string
 * (/buy?beds=2 is served /buy's HTML), so while hydrating return `{}` — identical to the server —
 * and the real params right after hydration (React re-renders automatically).
 */
export function useHydrationSafeSearch<T extends object>(search: T): Partial<T> {
  return useIsHydrating() ? {} : search
}

export function useIsHydrating(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => false, // client render
    () => true, // server render + hydration
  )
}
