import { ExternalLink, Landmark, ShieldCheck } from 'lucide-react'

import { ButtonAnchor } from '@/components/ui/Button'
import type { OffPlanProjectDetail } from '@/types'

/** DLD registration + escrow details with a link to verify on the DLD website. */
export function RegulatoryBox({ project }: { project: OffPlanProjectDetail }) {
  return (
    <div className="rounded-[24px] border border-line/70 bg-mist p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-plum text-white">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-[30px] leading-tight font-semibold text-plum">Regulatory details</h2>
          <p className="mt-1 text-[14.5px] leading-relaxed text-muted">
            Off-plan projects in Dubai must be registered with the Dubai Land Department, and buyer payments must go into a project escrow account held by an approved bank.
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[16px] bg-white p-4">
          <dt className="flex items-center gap-2 text-[12px] text-muted">
            <Landmark className="size-4" aria-hidden="true" /> DLD project number
          </dt>
          <dd className="mt-1 text-[20px] font-bold text-plum">{project.dldProjectNumber}</dd>
        </div>
        <div className="rounded-[16px] bg-white p-4">
          <dt className="flex items-center gap-2 text-[12px] text-muted">
            <ShieldCheck className="size-4" aria-hidden="true" /> Escrow account bank
          </dt>
          <dd className="mt-1 text-[20px] font-bold text-plum">{project.escrowBank}</dd>
        </div>
      </dl>

      <ul className="mt-5 grid gap-2 text-[14px] leading-relaxed text-ink/80">
        <li>• Pay instalments only into the escrow account named in your Sales &amp; Purchase Agreement, never to an individual.</li>
        <li>• Your purchase is registered on the DLD’s Oqood system, and you receive a certificate in your name.</li>
        <li>• Handover dates are the developer’s estimate and can change; the SPA sets out what happens if they do.</li>
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ButtonAnchor variant="plum" href="https://dubailand.gov.ae" target="_blank" rel="noreferrer">
          Verify on DLD <ExternalLink className="size-4" aria-hidden="true" />
        </ButtonAnchor>
        <p className="text-[12px] text-muted">Opens the Dubai Land Department website in a new tab.</p>
      </div>
    </div>
  )
}
