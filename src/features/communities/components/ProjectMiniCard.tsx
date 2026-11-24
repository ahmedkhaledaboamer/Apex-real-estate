import { Link } from '@tanstack/react-router'
import { CalendarClock } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import type { OffPlanProjectDetail } from '@/types'
import { srcSetOf } from '@/assets/images'

/** Compact off-plan project card linking to the project page. */
export function ProjectMiniCard({ project: p }: { project: OffPlanProjectDetail }) {
  const currency = useCurrency()
  return (
    <Link
      to="/off-plan/$projectSlug"
      params={{ projectSlug: p.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-soft transition-shadow duration-200 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img decoding="async" src={p.image} srcSet={srcSetOf(p.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
        <span className="absolute top-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-plum shadow-soft">{p.status}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12.5px] font-semibold text-aura">{p.developer}</p>
        <h3 className="mt-1 font-display text-[26px] leading-tight font-semibold text-plum">{p.name}</h3>
        <p className="mt-1 text-[14px] text-muted">{p.summary}</p>
        <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line/70 pt-4">
          <div>
            <p className="text-[12px] text-muted">From</p>
            <p className="text-[18px] font-bold text-plum">{formatPrice(p.fromAed, currency)}</p>
          </div>
          <div className="text-end text-[13px] text-ink/80">
            <p className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-4 text-muted" aria-hidden="true" /> Handover {p.handover}
            </p>
            <p className="text-muted">{p.plan} payment plan</p>
          </div>
        </div>
        </div>
      </div>
    </Link>
  )
}
