import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import type { OffPlanProjectDetail } from '@/types'
import { ProjectCard } from './ProjectCard'

const ALL = ''

/** "Q1 2029" → "2029" */
export const handoverYear = (handover: string) => handover.match(/\d{4}/)?.[0] ?? handover

const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b))

/** Featured launches with client-side filters (developer, community, handover year, status). */
export function ProjectExplorer({ projects }: { projects: OffPlanProjectDetail[] }) {
  const [developer, setDeveloper] = useState(ALL)
  const [community, setCommunity] = useState(ALL)
  const [year, setYear] = useState(ALL)
  const [status, setStatus] = useState(ALL)

  const options = useMemo(
    () => ({
      developer: uniq(projects.map((p) => p.developer)),
      community: uniq(projects.map((p) => p.community)),
      year: uniq(projects.map((p) => handoverYear(p.handover))),
      status: uniq(projects.map((p) => p.status)),
    }),
    [projects],
  )

  const shown = projects.filter(
    (p) =>
      (!developer || p.developer === developer) &&
      (!community || p.community === community) &&
      (!year || handoverYear(p.handover) === year) &&
      (!status || p.status === status),
  )
  const active = !!(developer || community || year || status)
  const reset = () => {
    setDeveloper(ALL)
    setCommunity(ALL)
    setYear(ALL)
    setStatus(ALL)
  }

  const opts = (label: string, xs: string[]) => [{ value: ALL, label }, ...xs.map((x) => ({ value: x, label: x }))]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead
            title="Featured launches"
            sub="Every project below is registered with the Dubai Land Department and has a dedicated escrow account. We check both before we list."
          />
        </Reveal>

        <div role="group" aria-label="Filter projects" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-center">
          <SelectField label="Developer" value={developer} onChange={(e) => setDeveloper(e.target.value)} options={opts('All developers', options.developer)} />
          <SelectField label="Community" value={community} onChange={(e) => setCommunity(e.target.value)} options={opts('All communities', options.community)} />
          <SelectField label="Handover year" value={year} onChange={(e) => setYear(e.target.value)} options={opts('Any year', options.year)} />
          <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={opts('Any status', options.status)} />
          <Button variant="ghost" onClick={reset} disabled={!active} className="sm:col-span-2 lg:col-span-1">
            Reset filters
          </Button>
        </div>

        <p className="mb-5 text-[14px] text-muted" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'project' : 'projects'}
        </p>

        {shown.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={0.05 * i} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects match"
            body="Try another developer, community or handover year. New launches are added every month."
            action={<Button onClick={reset}>Show all projects</Button>}
          />
        )}
      </div>
    </section>
  )
}
