import { BadgeCheck, MapPin } from 'lucide-react'

import { Badge, Breadcrumbs, Container, type Crumb } from '@/components/ui/misc'
import { Reveal } from '@/components/ui/Reveal'
import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import type { Property } from '@/types'
import { AgentSidebar, agentWhatsapp, telHref } from './AgentSidebar'
import { Amenities } from './Amenities'
import { CostBreakdown } from './CostBreakdown'
import { Gallery } from './Gallery'
import { KeyFacts } from './KeyFacts'
import { LocationSection } from './LocationSection'
import { MobileActionBar } from './MobileActionBar'
import { OffPlanDetails } from './OffPlanDetails'
import { PropertyActions } from './PropertyActions'
import { RegulatoryInfo } from './RegulatoryInfo'
import { SimilarProperties } from './SimilarProperties'

const KIND_LABEL: Record<Property['kind'], string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }

/** Full property detail page body (used by /buy/$propertyId and /rent/$propertyId). */
export function PropertyDetail({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const agent = agentProfileById(p.agentId)
  const rent = p.kind === 'rent'
  const pricePerSqft = !rent ? Math.round(p.priceAed / p.sqft) : null

  const crumbs: Crumb[] = [
    rent ? { label: 'Rent', to: '/rent' } : { label: 'Buy', to: '/buy' },
    { label: p.community, to: '/communities/$communitySlug', params: { communitySlug: p.communitySlug } },
    { label: p.title },
  ]

  return (
    <>
      <Container className="pt-6 md:pt-8">
        <Breadcrumbs items={crumbs} className="mb-5 md:mb-6" />
        <Gallery images={p.images} title={p.title} />

        {/* Title + price */}
        <div className="mt-6 flex flex-col gap-5 md:mt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="plum">{KIND_LABEL[p.kind]}</Badge>
              <Badge className="text-success">
                <BadgeCheck className="size-3.5" /> Verified listing
              </Badge>
              <Badge>{p.type}</Badge>
            </div>
            <h1 className="mt-3 font-display text-[36px] leading-[1.05] font-semibold text-plum md:text-[52px]">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[15px] text-muted">
              <MapPin className="size-4 shrink-0 text-aura" aria-hidden="true" />
              {p.building}, {p.community}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <div className="lg:text-end">
              <p className="text-[30px] leading-tight font-bold tracking-tight text-plum md:text-[34px]">
                {formatPrice(p.priceAed, currency)}
                {rent && <span className="text-[16px] font-medium text-muted"> /year</span>}
              </p>
              <p className="text-[13px] text-muted">
                {rent
                  ? `${p.cheques ?? 1} cheque${(p.cheques ?? 1) > 1 ? 's' : ''} accepted`
                  : `${formatPrice(pricePerSqft!, currency)} per sq ft · ${formatNumber(p.sqft)} sq ft`}
              </p>
            </div>
            <PropertyActions id={p.id} title={p.title} />
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-8 pb-16 md:pb-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div className="min-w-0 space-y-6">
            <Panel title="Key facts">
              <KeyFacts property={p} />
            </Panel>

            <Panel title="About this property">
              <div className="space-y-4 text-[15.5px] leading-relaxed text-ink/85">
                {p.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {!rent && (
                <p className="mt-5 text-[13.5px] text-muted">
                  Service charge approx. {formatPrice(p.serviceChargePerSqft, currency)} per sq ft per year (
                  {formatPrice(p.serviceChargePerSqft * p.sqft, currency)} a year).
                </p>
              )}
            </Panel>

            <Panel title="Amenities">
              <Amenities items={p.amenities} />
            </Panel>

            {p.kind === 'offplan' && (
              <Panel title="Off-plan details">
                <OffPlanDetails property={p} />
              </Panel>
            )}

            <Panel title={rent ? 'Move-in costs' : 'Cost to buy'}>
              <CostBreakdown property={p} />
            </Panel>

            <Panel title="Location">
              <LocationSection property={p} />
            </Panel>

            <Panel title="Regulatory information">
              <RegulatoryInfo property={p} agent={agent} />
            </Panel>
          </div>

          <aside aria-label="Contact the agent" className="lg:sticky lg:top-[124px] lg:-m-2 lg:max-h-[calc(100vh-136px)] lg:self-start lg:overflow-y-auto lg:p-2 lg:scrollbar-none">
            <AgentSidebar property={p} agent={agent} />
          </aside>
        </div>
      </Container>

      <SimilarProperties property={p} />
      <div id="property-end" aria-hidden="true" />

      <MobileActionBar telHref={telHref(agent.phone)} whatsappHref={agentWhatsapp(agent, p)} agentName={agent.name} endSentinelId="property-end" />
    </>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="rounded-[16px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="mb-6 font-display text-[28px] leading-tight font-semibold text-plum md:text-[32px]">{title}</h2>
        {children}
      </section>
    </Reveal>
  )
}
