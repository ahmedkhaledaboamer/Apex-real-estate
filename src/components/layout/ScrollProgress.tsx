import { ArrowUp } from 'lucide-react'
import { useEffect, useRef } from 'react'

const R = 22
const C = 2 * Math.PI * R

/**
 * Floating "back to top" button with a circular progress ring and the scrolled percentage.
 * Appears after the first screen; hover/focus swaps the percentage for an arrow. Sits above WhatsApp.
 *
 * Performance: scroll updates write straight to the DOM once per animation frame (no React
 * re-render while scrolling), and only when the value actually changed.
 */
export function ScrollProgress() {
  const btn = useRef<HTMLButtonElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    let lastPct = -1
    let lastVisible: boolean | null = null

    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((y / max) * 100))) : 0
      const visible = y > window.innerHeight * 0.6

      if (pct !== lastPct) {
        lastPct = pct
        if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - pct / 100))
        if (label.current) label.current.textContent = `${pct}%`
        btn.current?.setAttribute('aria-label', `Back to top (${pct}% scrolled)`)
      }
      if (visible !== lastVisible && btn.current) {
        lastVisible = visible
        btn.current.dataset.visible = String(visible)
        btn.current.tabIndex = visible ? 0 : -1
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return (
    <button
      ref={btn}
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={-1}
      data-visible="false"
      className="group pointer-events-none fixed end-[26px] bottom-[100px] z-40 grid size-[52px] translate-y-3 place-items-center rounded-full bg-white opacity-0 shadow-lift transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 active:scale-95 data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 print:hidden"
    >
      <svg viewBox="0 0 52 52" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="scroll-progress-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#843F96" />
            <stop offset="1" stopColor="#275BA8" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r={R} fill="none" stroke="#f2edf7" strokeWidth="3" />
        <circle
          ref={ring}
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="url(#scroll-progress-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <span ref={label} className="relative text-[12px] font-bold text-plum tabular-nums transition-opacity duration-150 group-hover:opacity-0 group-focus-visible:opacity-0">
        0%
      </span>
      <ArrowUp className="absolute size-5 text-aura opacity-0 transition-[opacity,translate] duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100" />
    </button>
  )
}
