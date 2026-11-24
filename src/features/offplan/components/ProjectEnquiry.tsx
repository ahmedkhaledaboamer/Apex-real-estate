import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FileDown, Phone } from 'lucide-react'

import { Button, ButtonAnchor } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { WhatsAppIcon } from '@/components/ui/icons'
import { LeadForm } from '@/features/leads/LeadForm'
import { whatsappLink } from '@/lib/constants'
import type { AgentProfile, OffPlanProjectDetail } from '@/types'
import { srcSetOf } from '@/assets/images'

const ANY_UNIT = 'Not sure yet'

/**
 * Sidebar card: advisor + register-interest form (with a unit-type select) + brochure modal.
 * `selectedUnit` comes from the unit table's "Enquire" action; it moves that unit to the top of
 * the select (making it the default) and pre-fills the message.
 */
export function ProjectEnquiry({
  project,
  agent,
  selectedUnit,
}: {
  project: OffPlanProjectDetail
  agent: AgentProfile
  selectedUnit: string | null
}) {
  const [brochure, setBrochure] = useState(false)
  const unitNames = project.unitTypes.map((u) => u.type)
  const unitOptions = selectedUnit ? [selectedUnit, ...unitNames.filter((u) => u !== selectedUnit), ANY_UNIT] : [ANY_UNIT, ...unitNames]
  const message = selectedUnit
    ? `Hi ${agent.name.split(' ')[0]}, I'm interested in a ${selectedUnit} at ${project.name}. Please send me availability, floor plans and the payment plan.`
    : `Hi ${agent.name.split(' ')[0]}, I'd like more details on ${project.name}.`
  const context = { projectSlug: project.slug, agentId: agent.id }

  return (
    <div className="rounded-[16px] bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <img decoding="async" loading="lazy" src={agent.photo} srcSet={srcSetOf(agent.photo)} sizes="56px" alt="" className="size-14 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <Link to="/agents/$agentSlug" params={{ agentSlug: agent.slug }} className="block truncate text-[15.5px] font-semibold text-ink hover:text-aura">
            {agent.name}
          </Link>
          <p className="text-[13px] text-muted">{agent.role}</p>
          <p className="text-[12px] text-muted">BRN {agent.brn}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <ButtonAnchor variant="outline" size="sm" href={`tel:${agent.phone.replace(/\s/g, '')}`}>
          <Phone className="size-4" aria-hidden="true" /> Call
        </ButtonAnchor>
        <ButtonAnchor variant="whatsapp" size="sm" href={whatsappLink(agent.whatsapp, message)} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> WhatsApp
        </ButtonAnchor>
      </div>

      <div className="mt-6 border-t border-line/70 pt-6">
        <h2 className="text-[18px] font-semibold text-plum">Register your interest</h2>
        <p className="mt-1 mb-4 text-[13.5px] text-muted">Floor plans, availability and the full payment plan, usually within the hour.</p>
        <LeadForm
          key={selectedUnit ?? 'none'}
          type="register-interest"
          context={context}
          withMessage
          defaultMessage={message}
          extraFields={[{ name: 'unitType', label: 'Unit type', kind: 'select', options: unitOptions }]}
          submitLabel="Register interest"
        />
      </div>

      <Button variant="ghost" className="mt-3 w-full" onClick={() => setBrochure(true)}>
        <FileDown className="size-4" aria-hidden="true" /> Download brochure
      </Button>

      <Modal open={brochure} onClose={() => setBrochure(false)} title={`${project.name} brochure`}>
        <p className="mb-5 text-[14.5px] text-muted">
          We’ll email you the developer’s brochure with floor plans, specifications and the {project.plan} payment plan.
        </p>
        <LeadForm
          type="register-interest"
          context={context}
          emailRequired
          submitLabel="Email me the brochure"
          successText={`Thanks — the brochure is on its way to your inbox. ${agent.name.split(' ')[0]} will follow up if you have questions.`}
          extraFields={[{ name: 'request', label: 'Request', kind: 'select', options: ['Brochure + floor plans', 'Brochure only'] }]}
        />
      </Modal>
    </div>
  )
}
