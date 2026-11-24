import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS } from '@/mocks/communities'

import { pct } from './CalculatorUI'
import { CHART } from './charts'

/** Communities that have a published gross yield, highest first. */
export const YIELD_COMMUNITIES = COMMUNITY_DETAILS.filter((c): c is typeof c & { yieldPct: number } => c.yieldPct !== null).sort(
  (a, b) => b.yieldPct - a.yieldPct,
)

type SortKey = 'yield' | 'ppsf'

/** Table of community gross yields with optional sorting by yield and price / sq ft. */
export function CommunityYieldTable({ sortable = false, className }: { sortable?: boolean; className?: string }) {
  const currency = useCurrency()
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'yield', dir: 'desc' })

  const rows = useMemo(() => {
    const val = (c: (typeof YIELD_COMMUNITIES)[number]) => (sort.key === 'yield' ? c.yieldPct : (c.ppsf ?? -1))
    return [...YIELD_COMMUNITIES].sort((a, b) => (sort.dir === 'desc' ? val(b) - val(a) : val(a) - val(b)))
  }, [sort])

  const head = (key: SortKey, label: string) => {
    if (!sortable) return label
    const active = sort.key === key
    const Icon = !active ? ArrowUpDown : sort.dir === 'desc' ? ArrowDown : ArrowUp
    return (
      <button
        type="button"
        onClick={() => setSort({ key, dir: active && sort.dir === 'desc' ? 'asc' : 'desc' })}
        className={cn('inline-flex items-center gap-1 font-semibold transition-colors duration-150 hover:text-aura', active && 'text-plum')}
      >
        {label} <Icon className="size-3.5" />
      </button>
    )
  }
  const ariaSort = (key: SortKey) => (sortable && sort.key === key ? (sort.dir === 'desc' ? 'descending' : 'ascending') : undefined)

  return (
    <div className={cn('overflow-x-auto rounded-[16px] bg-white shadow-soft', className)}>
      <table className="w-full min-w-[640px] text-[14px]">
        <caption className="sr-only">Gross rental yield and price per square foot by community{sortable ? ', sortable' : ''}</caption>
        <thead>
          <tr className="border-b border-line/70 text-[12px] text-muted">
            <th scope="col" className="px-5 py-4 text-start font-semibold md:px-6">Community</th>
            <th scope="col" aria-sort={ariaSort('yield')} className="px-3 py-4 text-start font-semibold">
              {head('yield', 'Gross yield')}
            </th>
            <th scope="col" aria-sort={ariaSort('ppsf')} className="px-3 py-4 text-end font-semibold">
              {head('ppsf', 'Price / sq ft')}
            </th>
            <th scope="col" className="px-3 py-4 text-end font-semibold">Avg rent 1 bed</th>
            <th scope="col" className="px-3 py-4 text-end font-semibold">Avg rent 2 bed</th>
            <th scope="col" className="px-5 py-4 md:px-6">
              <span className="sr-only">Guide</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {rows.map((c) => (
            <tr key={c.slug} className="transition-colors duration-150 hover:bg-mist/50">
              <th scope="row" className="px-5 py-3.5 text-start md:px-6">
                <Link to="/communities/$communitySlug" params={{ communitySlug: c.slug }} className="font-semibold text-plum hover:text-aura">
                  {c.name}
                </Link>
                <span className="block text-[12px] font-normal text-muted">{c.tag}</span>
              </th>
              <td className="px-3 py-3.5">
                <span className="flex items-center gap-3">
                  <span className="w-12 font-bold text-plum tabular-nums">{pct(c.yieldPct)}</span>
                  <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="hidden h-1.5 w-20 sm:block rtl:-scale-x-100" aria-hidden="true">
                    <rect width="100" height="6" rx="3" fill={CHART.line} fillOpacity="0.55" />
                    <rect width={(c.yieldPct / 8) * 100} height="6" rx="3" fill={CHART.aura} />
                  </svg>
                </span>
              </td>
              <td className="px-3 py-3.5 text-end tabular-nums">
                {c.ppsf ? (
                  <>
                    {formatPrice(c.ppsf, currency)}
                    {c.approx && <span className="text-muted" title="Earlier snapshot">*</span>}
                  </>
                ) : (
                  <span className="text-muted">n/a</span>
                )}
              </td>
              <td className="px-3 py-3.5 text-end tabular-nums">{c.avgRent1Bed ? formatPrice(c.avgRent1Bed, currency) : <span className="text-muted">n/a</span>}</td>
              <td className="px-3 py-3.5 text-end tabular-nums">{c.avgRent2Bed ? formatPrice(c.avgRent2Bed, currency) : <span className="text-muted">n/a</span>}</td>
              <td className="px-5 py-3.5 text-end md:px-6">
                <Link
                  to="/communities/$communitySlug"
                  params={{ communitySlug: c.slug }}
                  aria-label={`${c.name} community guide`}
                  className="inline-grid size-8 place-items-center rounded-full bg-mist text-indigo transition-colors duration-150 hover:bg-plum hover:text-white"
                >
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line/70 px-5 py-3 text-[12px] text-muted md:px-6">
        Gross yields and prices from the Apex Aura data pack; rents are indicative annual figures. * Earlier snapshot. Past performance is not a guide to
        future returns.
      </p>
    </div>
  )
}

/** Horizontal bar chart of community gross yields, each bar linking to the community guide. */
export function YieldBarChart({ className }: { className?: string }) {
  const max = Math.ceil(Math.max(...YIELD_COMMUNITIES.map((c) => c.yieldPct)))
  return (
    <figure aria-label="Gross rental yield by community" className={cn('rounded-[16px] bg-white p-6 shadow-soft md:p-8', className)}>
      <ul className="grid gap-4">
        {YIELD_COMMUNITIES.map((c, i) => (
          <li key={c.slug}>
            <Link to="/communities/$communitySlug" params={{ communitySlug: c.slug }} className="group grid gap-1.5">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-semibold text-plum group-hover:text-aura">{c.name}</span>
                <span className="text-[15px] font-bold text-plum tabular-nums">{pct(c.yieldPct)}</span>
              </span>
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-full rtl:-scale-x-100" aria-hidden="true">
                <rect width="100" height="10" rx="5" fill={CHART.line} fillOpacity="0.55" />
                <rect width={(c.yieldPct / max) * 100} height="10" rx="5" fill={i === 0 ? CHART.aura : CHART.indigo} />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <figcaption className="mt-5 text-[12px] text-muted">Gross yield, data pack §4. Communities without a published yield are not shown.</figcaption>
    </figure>
  )
}
