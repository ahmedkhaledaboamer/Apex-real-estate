import { useMemo } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowUpRight, BadgeCheck, Building2 } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { LocationMap, type MapMarker } from '@/components/media/LocationMap'
import { ButtonLink } from '@/components/ui/Button'
import { Badge, Container, Stat } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AgentCard } from '@/features/agents/components/AgentCard'
import { CommuteList, LifestyleList, SchoolList } from '@/features/communities/components/CommunityFacts'
import { CommunityListings } from '@/features/communities/components/CommunityListings'
import { CommunityTile } from '@/features/communities/components/CommunityTile'
import { ProjectMiniCard } from '@/features/communities/components/ProjectMiniCard'
import { specialistsFor } from '@/features/communities/components/helpers'
import { useCurrency } from '@/features/favorites/hooks'
import { LeadForm } from '@/features/leads/LeadForm'
import { formatNumber, formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS, communityBySlug } from '@/mocks/communities'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/communities/$communitySlug')({
  loader: ({ params }) => {
    const community = communityBySlug(params.communitySlug)
    if (!community) throw notFound()
    return community
  },
  head: ({ loaderData: c }) => (c ? seo({ title: `${c.name} community guide`, description: c.summary, image: c.image }) : {}),
  component: Page,
})

function Page() {
  const c = Route.useLoaderData()
  const currency = useCurrency()

  const properties = useMemo(() => PROPERTIES.filter((p) => p.communitySlug === c.slug), [c.slug])
  const projects = useMemo(() => PROJECT_DETAILS.filter((p) => p.communitySlug === c.slug), [c.slug])
  const specialists = useMemo(() => specialistsFor(c.name), [c.name])
  const others = useMemo(() => COMMUNITY_DETAILS.filter((o) => o.slug !== c.slug).slice(0, 4), [c.slug])

  const markers: MapMarker[] = useMemo(
    () => [
      { id: 'centre', position: c.location, popup: <p className="font-semibold text-plum">{c.name}</p> },
      ...properties.map((p) => ({
        id: p.id,
        position: p.location,
        label: formatPrice(p.priceAed, currency, { compact: true }),
        popup: (
          <div className="w-[200px]">
            <p className="text-[11.5px] font-semibold text-aura">{p.kind === 'rent' ? 'For rent' : p.kind === 'offplan' ? 'Off-plan' : 'For sale'}</p>
            <p className="text-[14px] font-semibold text-plum">{p.title}</p>
            <p className="text-[12.5px] text-muted">
              {formatPrice(p.priceAed, currency)}
              {p.kind === 'rent' ? ' / yr' : ''} · {p.beds === 0 ? 'Studio' : `${p.beds} bed`}
            </p>
            <Link
              to={p.kind === 'rent' ? '/rent/$propertyId' : '/buy/$propertyId'}
              params={{ propertyId: p.id }}
              className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-aura hover:text-plum"
            >
              View property <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
            </Link>
          </div>
        ),
      })),
    ],
    [c, properties, currency],
  )

  return (
    <>
      <PageHero
        image={c.image}
        title={c.name}
        sub={c.summary}
        crumbs={[{ label: 'Communities', to: '/communities' }, { label: c.name }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="white">{c.tag}</Badge>
          {c.freehold && (
            <Badge tone="white">
              <BadgeCheck className="size-3.5" aria-hidden="true" /> Freehold for all nationalities
            </Badge>
          )}
        </div>
      </PageHero>

      {/* Key figures */}
      <Container className="relative z-10 -mt-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[16px] bg-white p-6 shadow-lift md:grid-cols-5 md:p-8">
          <Stat label="Avg price" value={c.ppsf ? `${c.approx ? '~' : ''}AED ${formatNumber(c.ppsf)}` : 'Prime market'} sub={c.ppsf ? `per sq ft${c.approx ? ' · earlier snapshot' : ''}` : 'Priced per unit'} />
          <Stat label="Gross yield" value={c.yieldPct ? `${c.yieldPct.toFixed(2)}%` : 'On request'} sub="Before costs" />
          <Stat label="Avg rent, 1-bed" value={c.avgRent1Bed ? formatPrice(c.avgRent1Bed, currency) : 'On request'} sub={c.avgRent1Bed ? 'per year' : undefined} />
          <Stat label="Avg rent, 2-bed" value={c.avgRent2Bed ? formatPrice(c.avgRent2Bed, currency) : 'On request'} sub={c.avgRent2Bed ? 'per year' : undefined} />
          <Stat label="Ownership" value={c.freehold ? 'Freehold' : 'Leasehold'} sub={c.freehold ? 'Open to all nationalities' : 'GCC nationals only'} className="col-span-2 md:col-span-1" />
        </dl>
        <p className="mt-3 text-[12px] text-muted">~ Earlier mid-2025 snapshot. Yields are gross and vary by unit size; rents are indicative annual figures.</p>
      </Container>

      {/* Guide + sidebar */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div className="space-y-14">
            <Reveal>
              <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">Living in {c.name}</h2>
              <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/85">
                {c.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-[28px] leading-tight font-semibold text-plum">Lifestyle highlights</h3>
              <div className="mt-5">
                <LifestyleList items={c.lifestyle} />
              </div>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-[28px] leading-tight font-semibold text-plum">Property types</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.propertyTypes.map((t) => (
                  <li key={t} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium text-plum">
                    <Building2 className="size-4 text-aura" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="grid gap-10 md:grid-cols-2">
              <Reveal>
                <h3 className="font-display text-[28px] leading-tight font-semibold text-plum">Schools nearby</h3>
                <div className="mt-5">
                  <SchoolList schools={c.schools} />
                </div>
              </Reveal>
              <Reveal delay={0.04}>
                <h3 className="font-display text-[28px] leading-tight font-semibold text-plum">Commute times</h3>
                <p className="mt-1 text-[13px] text-muted">Typical off-peak drive</p>
                <div className="mt-4">
                  <CommuteList commute={c.commute} />
                </div>
              </Reveal>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] bg-white p-6 shadow-soft md:p-8">
              <h2 className="font-display text-[28px] leading-tight font-semibold text-plum">Get a shortlist in {c.name}</h2>
              <p className="mt-2 mb-5 text-[14.5px] text-muted">Tell us your budget and must-haves. An area specialist will send matching homes within one working day.</p>
              <LeadForm
                type="enquiry"
                withMessage
                defaultMessage={`I’d like a shortlist of homes in ${c.name}.`}
                extraFields={[
                  { name: 'intent', label: 'I’m looking to', kind: 'select', options: ['Buy to live', 'Buy to invest', 'Rent', 'Off-plan'] },
                  { name: 'budget', label: 'Budget', kind: 'text', placeholder: 'e.g. AED 2–3M' },
                ]}
                submitLabel="Get my shortlist"
              />
            </div>
          </aside>
        </Container>
      </section>

      {/* Map */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="On the map" sub={`The heart of ${c.name}, with every live Apex Aora listing in the community.`} />
          </Reveal>
          <LocationMap markers={markers} className="h-[380px] md:h-[480px]" />
        </Container>
      </section>

      {/* Listings */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title={`Properties in ${c.name}`} sub="Verified listings with a valid Trakheesi permit." />
          </Reveal>
          <CommunityListings properties={properties} communityName={c.name} />
        </Container>
      </section>

      {projects.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <Container>
            <Reveal>
              <SectionHead
                title={`Off-plan in ${c.name}`}
                sub="DLD-registered projects with escrow-protected payment plans."
                action={
                  <Link to="/off-plan" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                    All off-plan projects <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </Link>
                }
              />
            </Reveal>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <ProjectMiniCard project={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Specialists */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title={specialists.length > 1 ? 'Your area specialists' : 'Your area specialist'}
              sub={`RERA-licensed advisers who work ${c.name} every day.`}
              action={
                <Link to="/agents" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                  All agents <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </Link>
              }
            />
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialists.map((a) => (
              <li key={a.id}>
                <AgentCard agent={a} whatsappText={`Hi ${a.name.split(' ')[0]}, I’m interested in ${c.name}.`} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Other communities */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Explore other communities"
              action={
                <ButtonLink to="/communities" variant="outline">
                  All communities
                </ButtonLink>
              }
            />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <CommunityTile community={o} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}

