import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

/**
 * Smooth, eased wheel scrolling (Lenis) for mouse/trackpad users.
 * - Loaded after mount (never blocks first paint or hydration).
 * - Off for touch devices (native momentum is better) and for prefers-reduced-motion.
 * - Nested scroll areas (dropdown lists, modals, the filter drawer) keep native scrolling.
 * - Pauses while a modal/lightbox locks the page (body overflow: hidden).
 */
export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduce) return

    let destroyed = false
    let cleanup = () => {}

    void import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        wheelMultiplier: 1,
        anchors: true,
        allowNestedScroll: true,
        prevent: (node) => !!node.closest?.('.leaflet-container, [role="dialog"], [role="listbox"]'),
      })

      // Shared with ScrollProgress ("back to top" uses the same easing).
      ;(window as Window & { __lenis?: typeof lenis }).__lenis = lenis

      // Modals and the photo viewer lock the page by setting body overflow; follow that.
      const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
      const mo = new MutationObserver(sync)
      mo.observe(document.body, { attributes: true, attributeFilter: ['style'] })

      cleanup = () => {
        mo.disconnect()
        lenis.destroy()
        delete (window as Window & { __lenis?: unknown }).__lenis
      }
    })

    return () => {
      destroyed = true
      cleanup()
    }
  }, [])

  return null
}
