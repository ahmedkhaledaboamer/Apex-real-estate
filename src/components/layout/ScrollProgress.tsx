import { ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const R = 22
const C = 2 * Math.PI * R

type LenisLike = { scrollTo: (target: number, opts?: { duration?: number }) => void }

/**
 * Floating "back to top" button with a circular progress ring and the scrolled percentage.
 * Appears after the first screen; hover/focus swaps the percentage for an arrow.
 * Sits above the WhatsApp button. Uses Lenis' eased scroll when it is active.
 * Renders nothing on the server/hydration pass (state starts hidden).
 */
export function ScrollProgress() {
  const [visible, setVisible] = useState(false)
  const [pct, setPct] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const update = () => {
      raf.current = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const y = window.scrollY
      setPct(max > 0 ? Math.min(100, Math.max(0, Math.round((y / max) * 100))) : 0)
      setVisible(y > window.innerHeight * 0.6)
    }
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const toTop = () => {
    const lenis = (window as Window & { __lenis?: LenisLike }).__lenis
    if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={`Back to top (${pct}% scrolled)`}
      tabIndex={visible ? 0 : -1}
      className={`group fixed end-[26px] bottom-[100px] z-40 grid size-[52px] place-items-center rounded-full bg-white/95 shadow-lift backdrop-blur transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 active:scale-95 print:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
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
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="url(#scroll-progress-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct / 100)}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>
      <span className="relative text-[12px] font-bold text-plum tabular-nums transition-opacity duration-150 group-hover:opacity-0 group-focus-visible:opacity-0">
        {pct}%
      </span>
      <ArrowUp className="absolute size-5 text-aura opacity-0 transition-[opacity,translate] duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100" />
    </button>
  )
}
