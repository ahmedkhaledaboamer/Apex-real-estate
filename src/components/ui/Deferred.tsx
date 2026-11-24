import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { useIsHydrating } from '@/lib/hydration'

/**
 * Renders `children` only once the browser is idle after first paint, or when the placeholder
 * scrolls within `rootMargin` of the viewport — whichever comes first.
 *
 * Use for below-the-fold sections so the first render (and first layout) only covers what is on
 * screen. The placeholder reserves `minHeight` so the page height is roughly right meanwhile.
 *
 * Prerendered pages render the content straight away (server and hydration), so it is in the
 * static HTML for SEO and hydration matches; deferral only applies to client-side navigations.
 */
export function Deferred({
  children,
  minHeight = 600,
  rootMargin = '800px 0px',
}: {
  children: React.ReactNode
  minHeight?: number
  rootMargin?: string
}) {
  const hydrating = useIsHydrating()
  const [show, setShow] = useState(hydrating)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) return
    const el = ref.current
    let idleId: number | undefined
    let timer: number | undefined
    const reveal = () => setShow(true)

    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && reveal(), { rootMargin })
    if (el) io.observe(el)

    // Idle fallback so everything is mounted shortly after load (anchors, find-in-page, crawlers).
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    if (ric) idleId = ric(reveal, { timeout: 2500 })
    else timer = window.setTimeout(reveal, 1200)

    return () => {
      io.disconnect()
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (idleId !== undefined && cic) cic(idleId)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [show, rootMargin])

  // Suspense boundary: with lazily-loaded children, React keeps the prerendered HTML on screen and
  // hydrates this block only once its code arrives (progressive hydration) — the top of the page
  // becomes interactive sooner. On client navigations it shows the placeholder while loading.
  // Memoised: this component re-renders right after hydration (useIsHydrating flips), and a fresh
  // <Suspense> element would count as an update to a still-dehydrated boundary (React #421 →
  // client re-render). Returning the same element lets React bail out.
  const boundary = useMemo(
    () => <Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>{children}</Suspense>,
    [children, minHeight],
  )
  if (!show) return <div ref={ref} aria-hidden="true" style={{ minHeight }} />
  return boundary
}
