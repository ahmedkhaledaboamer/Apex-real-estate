import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

import { srcSetOf } from '@/assets/images'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { DEVELOPER_PROFILES } from '@/mocks/developers'
import { PROJECT_DETAILS } from '@/mocks/projects'

const AUTOPLAY_MS = 3800

/**
 * Developer carousel: snap-scrolling cards with photo, wordmark and key facts.
 * Native horizontal scroll (touch swipe / trackpad) + arrows + progress bar; autoplays and pauses
 * on hover, focus or touch. RTL-aware; no autoplay with reduced motion.
 */
export function Developers() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)

  const rtl = () => (track.current ? getComputedStyle(track.current).direction === 'rtl' : false)

  /** Width of one card + gap, read from the DOM so it matches every breakpoint. */
  const step = () => {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return 0
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    return first.getBoundingClientRect().width + gap
  }

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const x = Math.abs(el.scrollLeft) // negative in RTL
    setProgress(max > 0 ? x / max : 0)
    setAtStart(x <= 2)
    setAtEnd(x >= max - 2)
  }, [])

  const go = useCallback((dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const sign = rtl() ? -1 : 1
    el.scrollBy({ left: dir * sign * step(), behavior: reduce ? 'auto' : 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  useEffect(() => {
    update()
    const el = track.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  // Autoplay only while the carousel is on screen (no background work when scrolled away).
  useEffect(() => {
    const el = track.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Autoplay: advance one card; loop back to the start at the end.
  useEffect(() => {
    if (reduce || paused || !onScreen) return
    const id = window.setInterval(() => {
      const el = track.current
      if (!el) return
      const max = el.scrollWidth - el.clientWidth
      if (Math.abs(el.scrollLeft) >= max - 2) el.scrollTo({ left: 0, behavior: 'smooth' })
      else go(1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused, onScreen, go])

  return (
    <section aria-labelledby="dev-title" className="border-y border-line/70 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead
            title={<span id="dev-title">Selling for Dubai’s top developers</span>}
            sub="Launches and resales from the city’s most established master developers — every project DLD-registered."
            action={
              <div className="flex items-center gap-2">
                <Link to="/developers" className="me-2 hidden items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum sm:inline-flex">
                  All developers <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
                <ArrowButton label="Previous developers" disabled={atStart} onClick={() => go(-1)}>
                  <ChevronLeft className="size-5 rtl:rotate-180" />
                </ArrowButton>
                <ArrowButton label="Next developers" disabled={atEnd} onClick={() => go(1)}>
                  <ChevronRight className="size-5 rtl:rotate-180" />
                </ArrowButton>
              </div>
            }
          />
        </Reveal>
      </div>

      {/* Track bleeds to the screen edge on small screens; aligned to the container on large ones. */}
      <div
        className="mx-auto max-w-[1280px] md:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <ul
          ref={track}
          aria-label="Developers"
          className="flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 scrollbar-none md:scroll-px-0 md:gap-5 md:px-0"
        >
          {DEVELOPER_PROFILES.map((d) => {
            const projects = PROJECT_DETAILS.filter((p) => p.developerSlug === d.slug).length
            return (
              <li key={d.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3*1.25rem)/4)]">
                <Link
                  to="/developers/$developerSlug"
                  params={{ developerSlug: d.slug }}
                  className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[16px] bg-plum p-5 text-white shadow-soft transition-shadow duration-200 hover:shadow-lift"
                >
                  <img
                    src={d.image}
                    srcSet={srcSetOf(d.image)}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 46vw, 78vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />

                  <span className="absolute top-4 end-4 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-150 group-hover:bg-white group-hover:text-plum">
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </span>
                  {projects > 0 && (
                    <span className="absolute top-4 start-4 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-plum">
                      {projects} {projects === 1 ? 'launch' : 'launches'} listed
                    </span>
                  )}

                  <p className="text-[22px] font-bold tracking-[0.12em]">{d.name.toUpperCase()}</p>
                  <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-white/80">{d.signatureProjects.slice(0, 2).join(' · ')}</p>
                  <dl className="mt-4 flex gap-5 border-t border-white/20 pt-3 text-[12px]">
                    <div>
                      <dt className="text-white/60">Since</dt>
                      <dd className="text-[15px] font-semibold">{d.founded}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Delivered</dt>
                      <dd className="text-[15px] font-semibold">{d.deliveredUnits} units</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Progress */}
        <div className="mx-5 mt-6 h-[3px] overflow-hidden rounded-full bg-mist md:mx-0" aria-hidden="true">
          <div
            className="bg-aura-gradient h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  )
}

function ArrowButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line text-plum transition-[background-color,border-color,color,opacity] duration-150 hover:border-plum hover:bg-plum hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}
