import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarClock } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { OffPlanProjectDetail } from '@/types'
import { srcSetOf } from '@/assets/images'

/** Status → dot colour. Same mapping as the home "New off-plan launches" section. */
export const STATUS_DOT: Record<string, string> = {
  Launching: 'bg-cyan',
  Selling: 'bg-success',
  'Last units': 'bg-aura',
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-plum', className)}>
      <span className={cn('size-1.5 rounded-full', STATUS_DOT[status] ?? 'bg-indigo')} />
      {status}
    </span>
  )
}

/**
 * Photo-led project card (visual twin of the home OffPlanLaunches card).
 * The whole card is clickable through the title link's overlay.
 */
export function ProjectCard({ project: p, size = 'md', className }: { project: OffPlanProjectDetail; size?: 'md' | 'lg'; className?: string }) {
  const currency = useCurrency()
  const large = size === 'lg'
  return (
    <article
      className={cn(
        'group relative isolate flex h-full overflow-hidden rounded-[16px] shadow-soft transition-shadow duration-200 hover:shadow-lift',
        large ? 'min-h-[460px] lg:min-h-[560px]' : 'min-h-[380px]',
        className,
      )}
    >
      <img decoding="async"
        src={p.image} srcSet={srcSetOf(p.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw"
        alt={`${p.name} render`}
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
        <span className="flex h-9 items-center rounded-lg bg-white/95 px-3 text-[13px] font-bold tracking-wide text-plum">
          {p.developer.toUpperCase()}
        </span>
        <StatusPill status={p.status} />
      </div>

      <div className="mt-auto w-full p-5 md:p-6">
        <p className="text-[13px] text-white/75">{p.community}</p>
        <h3 className={cn('font-display font-semibold text-white', large ? 'text-[40px] leading-none' : 'text-[28px] leading-tight')}>
          <Link
            to="/off-plan/$projectSlug"
            params={{ projectSlug: p.slug }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {p.name}
          </Link>
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-white/90">
          <span>
            From <strong className="font-semibold text-white">{formatPrice(p.fromAed, currency, { compact: true })}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-4" aria-hidden="true" /> Handover {p.handover}
          </span>
          <span className="rounded-full border border-white/40 px-2.5 py-0.5 text-[12.5px] font-semibold">{p.plan} payment plan</span>
        </div>
        <span
          aria-hidden="true"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-plum transition-colors duration-150 group-hover:bg-mist"
        >
          View project <ArrowRight className="size-4 rtl:rotate-180" />
        </span>
      </div>
    </article>
  )
}
