import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarClock, ShieldCheck, Wallet } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { projectBySlug } from '@/mocks/projects'
import type { Property } from '@/types'

/** Handover, payment plan and (when linked) the project's milestone schedule. */
export function OffPlanDetails({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const project = p.projectSlug ? projectBySlug(p.projectSlug) : undefined

  return (
    <div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-mist p-4">
          <dt className="flex items-center gap-2 text-[12px] text-muted">
            <CalendarClock className="size-4 text-aura" aria-hidden="true" /> Expected handover
          </dt>
          <dd className="mt-1 text-[18px] font-bold text-plum">{p.handover ?? 'To be confirmed'}</dd>
        </div>
        <div className="rounded-xl bg-mist p-4">
          <dt className="flex items-center gap-2 text-[12px] text-muted">
            <Wallet className="size-4 text-aura" aria-hidden="true" /> Payment plan
          </dt>
          <dd className="mt-1 text-[18px] font-bold text-plum">{p.paymentPlan ?? 'On request'}</dd>
        </div>
        <div className="rounded-xl bg-mist p-4">
          <dt className="flex items-center gap-2 text-[12px] text-muted">
            <ShieldCheck className="size-4 text-aura" aria-hidden="true" /> Payments held in
          </dt>
          <dd className="mt-1 text-[18px] font-bold text-plum">{project ? project.escrowBank : 'DLD escrow'}</dd>
        </div>
      </dl>

      {project && (
        <>
          <h3 className="mt-7 text-[15px] font-semibold text-plum">{project.name} payment schedule</h3>
          <ol className="mt-3 divide-y divide-line/70 border-y border-line/70">
            {project.paymentPlan.map((m) => (
              <li key={m.label} className="flex items-center gap-4 py-3">
                <span className="w-12 shrink-0 text-[15px] font-bold text-aura">{m.percent}%</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-medium text-ink">{m.label}</p>
                  <p className="text-[12.5px] text-muted">{m.due}</p>
                </div>
                <span className="text-[14px] font-semibold text-plum">{formatPrice((p.priceAed * m.percent) / 100, currency)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12.5px] text-muted">
            Amounts are indicative for this unit’s asking price. DLD project no. {project.dldProjectNumber}. No guaranteed-return claims.
          </p>
          <Link
            to="/off-plan/$projectSlug"
            params={{ projectSlug: project.slug }}
            className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum"
          >
            View the {project.name} project <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </>
      )}
      {!project && (
        <Link to="/off-plan" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
          Explore all off-plan projects <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  )
}
