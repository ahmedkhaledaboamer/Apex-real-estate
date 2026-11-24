import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="option"], [role="combobox"], [role="switch"], label, summary, input[type="checkbox"], input[type="radio"], input[type="range"]'
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]'

/**
 * Branded cursor: a small aura dot that tracks the pointer exactly, and a ring that follows with a
 * soft lag and grows over links/buttons. Desktop only (fine pointer + hover); the native cursor is
 * kept for touch devices, text fields and prefers-reduced-motion.
 *
 * Renders nothing on the server and on the hydration pass (state starts false), so it never affects
 * the prerendered HTML.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ok = window.matchMedia('(pointer: fine) and (hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(ok)
  }, [])

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    const d = dot.current
    const r = ring.current
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let shown = false
    let raf = 0

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (!shown) {
        shown = true
        rx = x
        ry = y
        root.classList.add('cursor-visible')
      }
      const t = e.target as Element | null
      const onText = !!t?.closest?.(TEXT)
      root.classList.toggle('cursor-on-text', onText)
      const hover = !onText && !!t?.closest?.(INTERACTIVE)
      r.classList.toggle('is-hover', hover)
      root.classList.toggle('cursor-hover', hover)
    }
    const down = () => r.classList.add('is-down')
    const up = () => r.classList.remove('is-down')
    const leave = () => {
      shown = false
      root.classList.remove('cursor-visible')
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
      root.classList.remove('has-custom-cursor', 'cursor-visible', 'cursor-on-text', 'cursor-hover')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
