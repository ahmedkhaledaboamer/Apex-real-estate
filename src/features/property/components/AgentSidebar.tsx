import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Phone } from 'lucide-react'

import { ButtonAnchor } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Tabs } from '@/components/ui/Tabs'
import { LeadForm } from '@/features/leads/LeadForm'
import { whatsappLink } from '@/lib/constants'
import type { AgentProfile, Property } from '@/types'
import { srcSetOf } from '@/assets/images'

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`
export const agentWhatsapp = (agent: AgentProfile, p: Property) =>
  whatsappLink(agent.whatsapp, `Hi ${agent.name.split(' ')[0]}, I'm interested in ${p.title} in ${p.community} (ref ${p.reference}, permit ${p.permit}).`)

type Tab = 'enquiry' | 'viewing'

/** Agent card, direct contact buttons and the enquiry / viewing forms. */
export function AgentSidebar({ property: p, agent }: { property: Property; agent: AgentProfile }) {
  const [tab, setTab] = useState<Tab>('enquiry')
  const context = { propertyId: p.id, agentId: agent.id }

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <img decoding="async" loading="lazy" src={agent.photo} srcSet={srcSetOf(agent.photo)} sizes="64px" alt="" className="size-16 shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold text-plum">{agent.name}</p>
            <p className="text-[13.5px] text-muted">{agent.role}</p>
            <p className="mt-0.5 text-[12px] text-muted">BRN {agent.brn}</p>
          </div>
        </div>
        <p className="mt-4 text-[13.5px] text-muted">
          Speaks <span className="font-medium text-ink">{agent.languages.join(', ')}</span>
        </p>
        <Link
          to="/agents/$agentSlug"
          params={{ agentSlug: agent.slug }}
          className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-aura hover:text-plum"
        >
          View profile <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <ButtonAnchor href={telHref(agent.phone)} variant="outline" aria-label={`Call ${agent.name}`}>
            <Phone className="size-4" /> Call
          </ButtonAnchor>
          <ButtonAnchor href={agentWhatsapp(agent, p)} target="_blank" rel="noreferrer" variant="whatsapp" aria-label={`WhatsApp ${agent.name}`}>
            <WhatsAppIcon /> WhatsApp
          </ButtonAnchor>
        </div>
      </div>

      <div id="enquire" className="scroll-mt-[128px] rounded-[16px] bg-white p-6 shadow-soft">
        <Tabs
          label="Contact options"
          tabs={[
            { key: 'enquiry', label: 'Enquire' },
            { key: 'viewing', label: 'Book a viewing' },
          ]}
          value={tab}
          onChange={setTab}
          className="mb-5"
        />
        {tab === 'enquiry' ? (
          <LeadForm
            key="enquiry"
            type="enquiry"
            context={context}
            withMessage
            defaultMessage={`Hi, I'd like more details on ${p.title} in ${p.community} (ref ${p.reference}).`}
            submitLabel="Send enquiry"
          />
        ) : (
          <LeadForm
            key="viewing"
            type="viewing"
            context={context}
            withDate
            submitLabel="Request viewing"
            successText={`Thanks — ${agent.name.split(' ')[0]} will confirm your viewing time shortly.`}
          />
        )}
      </div>
    </div>
  )
}
