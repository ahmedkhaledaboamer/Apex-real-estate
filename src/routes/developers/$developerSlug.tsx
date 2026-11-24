import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowUpRight, Star } from 'lucide-react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { Container, EmptyState, Stat } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { LeadForm } from '@/features/leads/LeadForm'
import { ProjectCard } from '@/features/offplan/components/ProjectCard'
import { agentProfileById } from '@/mocks/agents'
import { DEVELOPER_PROFILES, developerBySlug } from '@/mocks/developers'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { PROPERTIES } from '@/mocks/properties'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/developers/$developerSlug')({
  loader: ({ params }) => {
    const developer = developerBySlug(params.developerSlug)
    if (!developer) throw notFound()
    return developer
  },
  head: ({ loaderData: d }) => (d ? seo({ title: `${d.name} — developer profile`, description: d.summary, image: d.image }) : {}),
  component: Page,
})

function Page() {
  const developer = Route.useLoaderData()
  const advisor = agentProfileById('daniel')
  const projects = PROJECT_DETAILS.filter((p) => p.developerSlug === developer.slug)
  const projectSlugs = new Set(projects.map((p) => p.slug))
  const units = PROPERTIES.filter((p) => p.kind === 'offplan' && p.projectSlug && projectSlugs.has(p.projectSlug))
  const others = DEVELOPER_PROFILES.filter((d) => d.slug !== developer.slug)

  return (
    <>
      <PageHero
        title={developer.name}
        sub={developer.summary}
        crumbs={[{ label: 'Developers', to: '/developers' }, { label: developer.name }]}
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
          <Reveal>
            <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">About {developer.name}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink/80">{developer.description}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 rounded-[16px] bg-white p-6 shadow-soft sm:grid-cols-4">
              <Stat label="Founded" value={developer.founded} />
              <Stat label="Headquarters" value={<span className="text-[17px]">{developer.hq}</span>} />
              <Stat label="Units delivered" value={developer.deliveredUnits} />
              <Stat label="Projects we list" value={projects.length} />
            </dl>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="h-full rounded-[16px] bg-white p-6 shadow-soft md:p-8">
              <h3 className="text-[17px] font-semibold text-plum">Signature projects</h3>
              <ul className="mt-4 divide-y divide-line/70">
                {developer.signatureProjects.map((s) => (
                  <li key={s} className="flex items-center gap-3 py-3 text-[15px] font-medium text-ink">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-indigo">
                      <Star className="size-4" aria-hidden="true" />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12px] text-muted">Profile figures are indicative; confirm details with the developer before purchase.</p>
            </div>
          </Reveal>
        </div>
      </Container>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Projects we’re selling"
              sub={`Current ${developer.name} launches, each checked for DLD registration and an escrow account.`}
              action={
                projects.length > 0 ? (
                  <Link to="/off-plan" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                    All off-plan projects <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </Link>
                ) : undefined
              }
            />
          </Reveal>
          {projects.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={0.05 * i} className="h-full">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No ${developer.name} launches listed right now`}
              body={`We don’t have an active ${developer.name} project on the site today. Register below and we’ll send the next launch, or browse other developers’ projects.`}
              action={<ButtonLink to="/off-plan">Browse off-plan projects</ButtonLink>}
            />
          )}
        </Container>
      </section>

      {units.length > 0 && (
        <section className="py-16 md:py-24">
          <Container>
            <Reveal>
              <SectionHead title={`${developer.name} off-plan units`} sub="Individual units available in the projects above, each with a DLD advertising permit." />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((u) => (
                <ConnectedPropertyCard key={u.id} listing={u} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">Ask about {developer.name}</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">
                Upcoming launches, resale units, payment plans or the developer’s delivery record — {advisor.name.split(' ')[0]} and the team will come back to you within one working day.
              </p>
            </div>
            <div className="rounded-[16px] border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <LeadForm
                type="enquiry"
                tone="solid"
                columns={2}
                context={{ agentId: advisor.id }}
                withMessage
                defaultMessage={`I'd like to know more about ${developer.name} projects.`}
                extraFields={[
                  {
                    name: 'interest',
                    label: 'Interested in',
                    kind: 'select',
                    options: [...projects.map((p) => p.name), `Upcoming ${developer.name} launches`, `${developer.name} resale homes`],
                  },
                ]}
                submitLabel="Send enquiry"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-white">
        <Container className="py-10">
          <h2 className="text-[14px] font-semibold text-muted">Other developers</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-9">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/developers/$developerSlug"
                  params={{ developerSlug: d.slug }}
                  className="block text-center text-[17px] font-bold tracking-[0.08em] text-ink/35 transition-colors duration-200 hover:text-indigo"
                >
                  {d.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
