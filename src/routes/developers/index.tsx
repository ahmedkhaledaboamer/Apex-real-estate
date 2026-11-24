import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container, EmptyState } from '@/components/ui/misc'
import { Reveal } from '@/components/ui/Reveal'
import { DeveloperCard } from '@/features/developers/components/DeveloperCard'
import { VettingSection } from '@/features/developers/components/VettingSection'
import { DEVELOPER_PROFILES } from '@/mocks/developers'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/developers/')({
  head: () => seo({ title: "Dubai developers", description: "Profiles of Dubai’s leading developers: track record, signature projects and current launches." }), component: Page })

function Page() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = DEVELOPER_PROFILES.filter((d) => !q || d.name.toLowerCase().includes(q))

  return (
    <>
      <PageHero
        title="Dubai's leading developers"
        sub="Profiles of the master developers and boutique builders we sell for: when they were founded, what they’ve delivered, and the projects we have available today."
        crumbs={[{ label: 'Developers' }]}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4 text-white">
          <div>
            <dt className="text-[12px] text-white/70">Developers profiled</dt>
            <dd className="text-[26px] font-bold">{DEVELOPER_PROFILES.length}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-white/70">Off-plan projects listed</dt>
            <dd className="text-[26px] font-bold">{PROJECT_DETAILS.length}</dd>
          </div>
        </dl>
      </PageHero>

      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-line bg-white px-5 py-3 transition-[border-color,box-shadow] duration-150 focus-within:border-aura focus-within:shadow-soft">
              <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
              <span className="sr-only">Search developers by name</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search developers, e.g. Emaar"
                className="w-full min-w-0 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted/70"
              />
            </label>
            <p className="text-[14px] text-muted" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'developer' : 'developers'}
            </p>
          </div>

          {shown.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((d, i) => (
                <li key={d.slug}>
                  <Reveal delay={0.03 * (i % 3)} className="h-full">
                    <DeveloperCard developer={d} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No developers found"
              body={`We don’t have a profile for “${query.trim()}” yet. Ask an adviser — we can still help with their projects.`}
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                  <ButtonLink to="/contact">Ask an adviser</ButtonLink>
                </div>
              }
            />
          )}
        </Container>
      </section>

      <VettingSection />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-6 rounded-[24px] bg-mist px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
          <div className="max-w-xl">
            <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">Looking at a new launch?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">Browse current off-plan projects with payment plans, handover dates and DLD details on every listing.</p>
          </div>
          <ButtonLink to="/off-plan" size="lg">
            Explore off-plan projects
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
