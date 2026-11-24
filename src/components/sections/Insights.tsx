import { ArrowRight, Download } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { ARTICLE_DETAILS } from '@/mocks/insights'
import { IMG, srcSetOf } from '@/assets/images'
import { Reveal, SectionHead } from '@/components/ui/Reveal'

/** Avg apartment AED / sq ft, Savills. Last point = Q3 2026 (1,817, down 4.8% QoQ). Earlier points indicative. */
const SERIES = [
  { q: 'Q3 25', v: 1745 },
  { q: 'Q4 25', v: 1802 },
  { q: 'Q1 26', v: 1868 },
  { q: 'Q2 26', v: 1908 },
  { q: 'Q3 26', v: 1817 },
]

export function Insights() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHead
          title="Market insights"
          sub="The Dubai market is stabilising: volumes are below the 2025 peak, ready homes are gaining share and leasing demand is at a record high."
          action={
            <Link to="/insights" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
              All insights <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          }
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Report — the primary item */}
        <Reveal>
          <article className="flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-soft">
            <div className="relative aspect-[21/9] overflow-hidden">
              <img decoding="async" src={IMG.report} srcSet={srcSetOf(IMG.report)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Dubai skyline at dusk" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="text-[13px] font-semibold text-aura">Quarterly report · Q3 2026</p>
              <h3 className="mt-2 font-display text-[30px] leading-tight font-semibold text-plum md:text-[36px]">
                Apartment prices ease 4.8% as ready homes reach 29% of sales
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <AreaChart />
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                  <div>
                    <dt className="text-[12px] text-muted">Avg apartment price</dt>
                    <dd className="text-[22px] font-bold text-plum">AED 1,817<span className="text-[13px] font-medium text-muted"> /sq ft</span></dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">Residential deals</dt>
                    <dd className="text-[22px] font-bold text-plum">~34,500</dd>
                  </div>
                </dl>
              </div>
              <p className="mt-3 text-[11.5px] text-muted">Source: Savills Dubai Residential Market Report Q3 2026.</p>

              <div className="mt-auto pt-6">
                <Link to="/insights/$articleSlug" params={{ articleSlug: ARTICLE_DETAILS[0].slug }} className="bg-aura-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold text-white transition-[filter] duration-150 hover:brightness-110">
                  <Download className="size-4" /> Download the full report
                </Link>
              </div>
            </div>
          </article>
        </Reveal>

        <ul className="grid gap-4">
          {ARTICLE_DETAILS.slice(0, 3).map((a, i) => (
            <li key={a.id} className="h-full">
              <Reveal delay={i * 0.04} className="h-full">
                <Link to="/insights/$articleSlug" params={{ articleSlug: a.slug }} className="group grid h-full grid-cols-[120px_1fr] gap-4 rounded-[16px] bg-white p-3 shadow-soft transition-shadow duration-200 hover:shadow-lift sm:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-auto lg:h-full lg:min-h-[135px]">
                    <img decoding="async" src={a.image} srcSet={srcSetOf(a.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]" />
                  </div>
                  <div className="flex min-w-0 flex-col py-1">
                    <p className="text-[12px] font-semibold text-aura">{a.category}</p>
                    <h4 className="mt-1 text-[16px] leading-snug font-semibold text-ink group-hover:text-plum">{a.title}</h4>
                    <p className="mt-auto pt-2 text-[12.5px] text-muted">
                      {a.date} · {a.read} read
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function AreaChart() {
  const w = 360
  const h = 120
  const min = 1700
  const max = 1940
  const pts = SERIES.map((d, i) => [(i / (SERIES.length - 1)) * w, h - ((d.v - min) / (max - min)) * h] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  const [lx, ly] = pts[pts.length - 1]
  return (
    <figure aria-label="Average apartment price per sq ft, Q3 2025 to Q3 2026">
      <svg viewBox={`0 -8 ${w} ${h + 16}`} className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="ins-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#563D96" stopOpacity="0.22" />
            <stop offset="1" stopColor="#563D96" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ins-area)" />
        <path d={line} fill="none" stroke="#563D96" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="5" fill="#fff" stroke="#843F96" strokeWidth="2.5" />
      </svg>
      <figcaption className="mt-2 flex justify-between text-[11px] text-muted">
        {SERIES.map((d) => (
          <span key={d.q}>{d.q}</span>
        ))}
      </figcaption>
    </figure>
  )
}
