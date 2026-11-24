import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Building2, CalendarClock, Check, Clock, MapPin } from 'lucide-react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { PageHero } from '@/components/layout/PageHero'
import { LocationMap } from '@/components/media/LocationMap'
import { Button } from '@/components/ui/Button'
import { Container, Stat } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { useCurrency } from '@/features/favorites/hooks'
import { PaymentPlanTimeline } from '@/features/offplan/components/PaymentPlanTimeline'
import { ProjectCard, StatusPill } from '@/features/offplan/components/ProjectCard'
import { ProjectEnquiry } from '@/features/offplan/components/ProjectEnquiry'
import { ProjectGallery } from '@/features/offplan/components/ProjectGallery'
import { RegulatoryBox } from '@/features/offplan/components/RegulatoryBox'
import { UnitTypesTable } from '@/features/offplan/components/UnitTypesTable'
import { formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { communityBySlug } from '@/mocks/communities'
import { PROJECT_DETAILS, projectBySlug } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import type { UnitType } from '@/types'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/off-plan/$projectSlug')({
  loader: ({ params }) => {
    const project = projectBySlug(params.projectSlug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData: p }) => (p ? seo({ title: `${p.name} by ${p.developer}`, description: `${p.summary} Handover ${p.handover}, ${p.plan} payment plan.`, image: p.image }) : {}),
  component: Page,
})

const block = 'scroll-mt-24 rounded-[16px] bg-white p-6 shadow-soft md:p-8'
const h2 = 'font-display text-[30px] leading-tight font-semibold text-plum md:text-[36px]'

function Page() {
  const project = Route.useLoaderData()
  const currency = useCurrency()
  const reduce = useReducedMotion()
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  const agent = agentProfileById('daniel')
  const community = communityBySlug(project.communitySlug)
  const units = PROPERTIES.filter((p) => p.projectSlug === project.slug)
  const others = PROJECT_DETAILS.filter((p) => p.slug !== project.slug)

  const scrollToForm = () => document.getElementById('enquire')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  const enquire = (u: UnitType) => {
    setSelectedUnit(u.type)
    scrollToForm()
  }

  const facts = [
    { label: 'Launch date', value: project.launchDate },
    { label: 'Handover', value: project.handover },
    { label: 'Floors', value: formatNumber(project.floors) },
    { label: 'Total units', value: formatNumber(project.totalUnits) },
    { label: 'DLD project no.', value: project.dldProjectNumber },
    { label: 'Escrow bank', value: project.escrowBank },
  ]

  return (
    <>
      <PageHero
        title={project.name}
        sub={project.summary}
        crumbs={[{ label: 'Off-plan', to: '/off-plan' }, { label: project.name }]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={project.status} />
          <Link
            to="/developers/$developerSlug"
            params={{ developerSlug: project.developerSlug }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-white/10"
          >
            <Building2 className="size-3.5" aria-hidden="true" /> {project.developer}
          </Link>
          <Link
            to="/communities/$communitySlug"
            params={{ communitySlug: project.communitySlug }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-white/10"
          >
            <MapPin className="size-3.5" aria-hidden="true" /> {project.community}
          </Link>
        </div>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-white">
          <div>
            <dt className="text-[12px] text-white/70">From</dt>
            <dd className="text-[26px] font-bold">{formatPrice(project.fromAed, currency)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-white/70">Handover</dt>
            <dd className="flex items-center gap-1.5 text-[26px] font-bold">
              <CalendarClock className="size-5" aria-hidden="true" /> {project.handover}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-white/70">Payment plan</dt>
            <dd className="text-[26px] font-bold">{project.plan}</dd>
          </div>
        </dl>
      </PageHero>

      <Container className="pt-8 md:pt-10">
        <ProjectGallery images={project.gallery} name={project.name} />
      </Container>

      <Container className="py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div className="grid min-w-0 gap-8">
            <section aria-label="Key facts" className="rounded-[16px] bg-white p-6 shadow-soft">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
                {facts.map((f) => (
                  <Stat key={f.label} label={f.label} value={<span className="text-[17px]">{f.value}</span>} />
                ))}
              </dl>
            </section>

            <section aria-labelledby="overview" className={block}>
              <h2 id="overview" className={h2}>
                Overview
              </h2>
              <div className="mt-4 grid gap-4 text-[15.5px] leading-relaxed text-ink/80">
                {project.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <h3 className="mt-8 text-[17px] font-semibold text-plum">Amenities</h3>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {project.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-[14.5px] font-medium text-ink">
                    <Check className="size-4 shrink-0 text-aura" aria-hidden="true" /> {a}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="payment-plan" className={block}>
              <h2 id="payment-plan" className={h2}>
                {project.plan} payment plan
              </h2>
              <p className="mt-2 mb-8 text-[15px] text-muted">
                Construction-linked instalments paid into the project escrow account, with the balance on handover.
              </p>
              <PaymentPlanTimeline milestones={project.paymentPlan} unitTypes={project.unitTypes} plan={project.plan} />
            </section>

            <section aria-labelledby="unit-types" className={block}>
              <h2 id="unit-types" className={h2}>
                Unit types &amp; prices
              </h2>
              <p className="mt-2 mb-6 text-[15px] text-muted">Starting prices from the developer’s current price list. Availability changes daily.</p>
              <UnitTypesTable units={project.unitTypes} onEnquire={enquire} />
            </section>

            <section aria-labelledby="location" className={block}>
              <h2 id="location" className={h2}>
                Location
              </h2>
              <p className="mt-2 text-[15px] text-muted">
                {project.name}, {project.community}
              </p>
              <LocationMap
                className="mt-5 h-[300px] md:h-[380px]"
                markers={[{ id: project.slug, position: project.location, label: project.name, active: true }]}
              />
              {community && (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-[16px] font-semibold text-plum">About {community.name}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{community.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {community.lifestyle.map((l) => (
                        <li key={l} className="rounded-full bg-mist px-3 py-1 text-[13px] font-medium text-plum">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-plum">Drive times</h3>
                    <ul className="mt-2 divide-y divide-line/70">
                      {community.commute.map((c) => (
                        <li key={c.to} className="flex items-center justify-between gap-3 py-2.5 text-[14.5px]">
                          <span className="text-ink">{c.to}</span>
                          <span className="flex items-center gap-1.5 font-semibold text-plum">
                            <Clock className="size-4 text-muted" aria-hidden="true" /> {c.minutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/communities/$communitySlug"
                      params={{ communitySlug: community.slug }}
                      className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum"
                    >
                      {community.name} guide <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {units.length > 0 && (
              <section aria-labelledby="available-units">
                <h2 id="available-units" className={h2}>
                  Available units in {project.name}
                </h2>
                <p className="mt-2 mb-6 text-[15px] text-muted">Individual units listed with a DLD advertising permit.</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {units.map((u) => (
                    <ConnectedPropertyCard key={u.id} listing={u} />
                  ))}
                </div>
              </section>
            )}

            <RegulatoryBox project={project} />
          </div>

          <aside id="enquire" aria-label={`Enquire about ${project.name}`} className="scroll-mt-24 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:scrollbar-none">
            <ProjectEnquiry project={project} agent={agent} selectedUnit={selectedUnit} />
          </aside>
        </div>
      </Container>

      {others.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <Container>
            <Reveal>
              <SectionHead
                title="Other launches"
                sub="More DLD-registered projects we’re selling now."
                action={
                  <Link to="/off-plan" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                    All off-plan projects <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </Link>
                }
              />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((p, i) => (
                <Reveal key={p.id} delay={0.05 * i} className="h-full">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mobile: sticky CTA. End padding keeps it clear of the floating WhatsApp button. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-white/95 py-3 ps-5 pe-28 shadow-lift backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] text-muted">From</p>
            <p className="truncate text-[17px] font-bold text-plum">{formatPrice(project.fromAed, currency, { compact: true })}</p>
          </div>
          <Button size="md" onClick={scrollToForm}>
            Register interest
          </Button>
        </div>
      </div>
    </>
  )
}
