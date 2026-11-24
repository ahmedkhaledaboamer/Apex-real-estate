import { useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { motion } from '@/lib/motion'

import { MAP_CITIES, MAP_HEIGHT, MAP_WIDTH, type MapCityKey } from './mapData'

type Origin = { key: Exclude<MapCityKey, 'dubai'>; labelPos?: 'above' | 'below' | 'start' | 'end' }

const ORIGINS: Origin[] = [
  { key: 'london', labelPos: 'below' },
  { key: 'berlin', labelPos: 'above' },
  { key: 'moscow', labelPos: 'above' },
  { key: 'istanbul', labelPos: 'start' },
  { key: 'cairo', labelPos: 'below' },
  { key: 'riyadh', labelPos: 'start' },
  { key: 'karachi', labelPos: 'end' },
  { key: 'delhi', labelPos: 'above' },
  { key: 'mumbai', labelPos: 'below' },
]

const HUB = MAP_CITIES.dubai


/** Quadratic arc from a city to Dubai, bowed upwards (more for longer routes). */
function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  // Perpendicular, pointing "up" on screen.
  let nx = dy / len
  let ny = -dx / len
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  const bow = Math.min(len * 0.32, 150)
  return `M${x1} ${y1} Q${mx + nx * bow} ${my + ny * bow} ${x2} ${y2}`
}

/** Label placement relative to the dot; baseline keeps the gap constant at any font size. */
const LABEL_OFFSET: Record<NonNullable<Origin['labelPos']>, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end'; baseline: 'auto' | 'hanging' | 'middle' }> = {
  above: { dx: 0, dy: -10, anchor: 'middle', baseline: 'auto' },
  below: { dx: 0, dy: 10, anchor: 'middle', baseline: 'hanging' },
  start: { dx: -11, dy: 0, anchor: 'end', baseline: 'middle' },
  end: { dx: 11, dy: 0, anchor: 'start', baseline: 'middle' },
}

/** Dotted land map with animated arcs from key buyer markets into Dubai. */
export function ConnectionsMap({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const [dots, setDots] = useState<string | null>(null)

  // ~68 KB of land dots: fetched only in the browser, shortly before the map scrolls into view.
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    let cancelled = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        void import('./mapDots').then((m) => !cancelled && setDots(m.LAND_DOTS_PATH))
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className={className} role="img" aria-label="Map showing routes from London, Berlin, Moscow, Istanbul, Cairo, Riyadh, Karachi, New Delhi and Mumbai to Dubai">
      <defs>
        <linearGradient id={`${id}-arc`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#843F96" />
          <stop offset="1" stopColor="#3CB4E8" />
        </linearGradient>
        <radialGradient id={`${id}-fade`} cx="0.62" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Land (decorative; loaded in the browser when the map nears the viewport, fades in) */}
      {dots && (
        <path
          d={dots}
          stroke="#fff"
          strokeOpacity="0.34"
          strokeWidth="3"
          strokeLinecap="round"
          mask={`url(#${id}-mask)`}
          className="animate-fade-in"
        />
      )}

      {/* Routes */}
      {ORIGINS.map((o, i) => {
        const c = MAP_CITIES[o.key]
        const d = arcPath(c.x, c.y, HUB.x, HUB.y)
        const pathId = `${id}-route-${o.key}`
        const label = LABEL_OFFSET[o.labelPos ?? 'below']
        return (
          <g key={o.key}>
            <motion.path
              id={pathId}
              d={d}
              fill="none"
              stroke={`url(#${id}-arc)`}
              strokeWidth="1.6"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              initial={reduce ? false : { strokeDashoffset: 1, opacity: 0 }}
              whileInView={{ strokeDashoffset: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, delay: 0.15 * i, ease: [0.23, 1, 0.32, 1] }}
            />
            {/* Travelling light along the route */}
            {!reduce && (
              <circle r="3" fill="#3CB4E8">
                <animateMotion dur={`${3.2 + i * 0.35}s`} begin={`${1.2 + i * 0.3}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${3.2 + i * 0.35}s`} begin={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={c.x} cy={c.y} r="4.5" fill="#1e1828" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.5" />
            <text x={c.x + label.dx} y={c.y + label.dy} textAnchor={label.anchor} dominantBaseline={label.baseline} className="fill-white/70 text-[26px] font-medium sm:text-[19px] lg:text-[15px]">
              {c.label}
            </text>
          </g>
        )
      })}

      {/* Hub: Dubai */}
      <g>
        <circle cx={HUB.x} cy={HUB.y} r="16" fill="#3CB4E8" opacity="0.35" filter={`url(#${id}-glow)`} />
        {!reduce && (
          <circle cx={HUB.x} cy={HUB.y} r="7" fill="none" stroke="#3CB4E8" strokeWidth="1.5">
            <animate attributeName="r" values="7;22" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={HUB.x} cy={HUB.y} r="7" fill="#1e1828" stroke="#3CB4E8" strokeWidth="3" />
        <circle cx={HUB.x} cy={HUB.y} r="2.5" fill="#fff" />
        <text x={HUB.x} y={HUB.y + 20} textAnchor="middle" dominantBaseline="hanging" className="fill-white text-[32px] font-semibold sm:text-[24px] lg:text-[19px]">
          Dubai
        </text>
      </g>
    </svg>
  )
}
