import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { PROJECT_DETAILS } from '@/mocks/projects'
import type { Developer } from '@/types'

export const activeProjectCount = (slug: string) => PROJECT_DETAILS.filter((p) => p.developerSlug === slug).length

/** Wordmark-style developer card (same uppercase tracking as the home Developers strip). */
export function DeveloperCard({ developer: d }: { developer: Developer }) {
  const count = activeProjectCount(d.slug)
  return (
    <article className="group relative flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[22px] font-bold tracking-[0.08em] text-ink/80 transition-colors duration-200 group-hover:text-indigo">
          <Link to="/developers/$developerSlug" params={{ developerSlug: d.slug }} className="after:absolute after:inset-0 after:content-['']">
            {d.name.toUpperCase()}
          </Link>
        </h3>
        <ArrowUpRight className="size-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-aura rtl:-scale-x-100" aria-hidden="true" />
      </div>
      <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d.summary}</p>

      <div className="mt-auto pt-5">
      <dl className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3 border-t border-line/70 pt-4">
        <div>
          <dt className="text-[11.5px] text-muted">Founded</dt>
          <dd className="text-[15px] font-bold text-plum">{d.founded}</dd>
        </div>
        <div>
          <dt className="text-[11.5px] text-muted">HQ</dt>
          <dd className="truncate text-[15px] font-bold text-plum">{d.hq}</dd>
        </div>
        <div>
          <dt className="text-[11.5px] text-muted">Delivered</dt>
          <dd className="text-[15px] font-bold text-plum">{d.deliveredUnits}</dd>
        </div>
      </dl>
      </div>
      <p className="mt-4 text-[13px] font-semibold">
        {count > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-plum">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {count} active {count === 1 ? 'project' : 'projects'} listed
          </span>
        ) : (
          <span className="text-muted">Resale and upcoming launches on request</span>
        )}
      </p>
    </article>
  )
}
