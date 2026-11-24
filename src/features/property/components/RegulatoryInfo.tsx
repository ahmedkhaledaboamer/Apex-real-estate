import { BadgeCheck, ExternalLink } from 'lucide-react'

import type { AgentProfile, Property } from '@/types'

/** RERA / DLD compliance details shown on every listing. */
export function RegulatoryInfo({ property: p, agent }: { property: Property; agent: AgentProfile }) {
  const rows = [
    { label: 'Trakheesi permit', value: p.permit },
    { label: 'Agent BRN', value: `${agent.brn} · ${agent.name}` },
    { label: 'Brokerage ORN', value: '[placeholder]' },
    { label: 'Listing reference', value: p.reference },
  ]
  return (
    <div>
      <p className="flex items-start gap-2 text-[14.5px] leading-relaxed text-muted">
        <BadgeCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        This advert is licensed by the Dubai Land Department. Check the permit number before you pay any deposit.
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-line/70 px-4 py-3">
            <dt className="text-[12px] text-muted">{r.label}</dt>
            <dd className="mt-0.5 text-[15px] font-semibold text-plum" dir="ltr">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <a
        href="https://dubailand.gov.ae"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum"
      >
        Verify on DLD <ExternalLink className="size-4" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  )
}
