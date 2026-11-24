import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BadgeCheck, ExternalLink } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Chip, SelectField, TextField } from '@/components/ui/Field'
import { Container, EmptyState } from '@/components/ui/misc'
import { Reveal } from '@/components/ui/Reveal'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { AgentCard } from '@/features/agents/components/AgentCard'
import { AGENT_PROFILES } from '@/mocks/agents'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/agents/')({
  head: () => seo({ title: "Our agents", description: "Meet our RERA-licensed property advisers in Dubai — languages, areas and specialities." }), component: Page })

const ALL = 'all'
const uniq = (xs: string[]) => Array.from(new Set(xs)).sort((a, b) => a.localeCompare(b))
const LANGUAGES = uniq(AGENT_PROFILES.flatMap((a) => a.languages))
const AREAS = uniq(AGENT_PROFILES.flatMap((a) => a.communities))
const SPECIALITIES = uniq(AGENT_PROFILES.flatMap((a) => a.specialities))

function Page() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState(ALL)
  const [area, setArea] = useState(ALL)
  const [speciality, setSpeciality] = useState<string | null>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return AGENT_PROFILES.filter(
      (a) =>
        (!q || a.name.toLowerCase().includes(q)) &&
        (language === ALL || a.languages.includes(language)) &&
        (area === ALL || a.communities.includes(area)) &&
        (!speciality || a.specialities.includes(speciality)),
    )
  }, [query, language, area, speciality])

  const filtered = query !== '' || language !== ALL || area !== ALL || speciality !== null
  const reset = () => {
    setQuery('')
    setLanguage(ALL)
    setArea(ALL)
    setSpeciality(null)
  }

  return (
    <>
      <PageHero
        title="Meet our agents"
        sub="Every Apex Aura adviser is RERA-licensed. Find a specialist by area, language or what you need help with."
        crumbs={[{ label: 'Agents' }]}
      >
        <a
          href="https://dubailand.gov.ae"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[13.5px] font-semibold text-white backdrop-blur-md transition-colors duration-150 hover:bg-white/20"
        >
          <BadgeCheck className="size-4" aria-hidden="true" /> Check any BRN on the Dubai Land Department site
          <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
        </a>
      </PageHero>

      <section className="py-16 md:py-24">
        <Container>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <TextField
              label="Search by name"
              type="search"
              placeholder="e.g. Layla"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:col-span-2 lg:col-span-1"
            />
            <SelectField
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[{ value: ALL, label: 'Any language' }, ...LANGUAGES]}
            />
            <SelectField
              label="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              options={[{ value: ALL, label: 'Any area' }, ...AREAS]}
            />
          </form>

          <div role="group" aria-label="Filter by speciality" className="mt-4 flex flex-wrap gap-2">
            <Chip active={speciality === null} onClick={() => setSpeciality(null)}>
              All specialities
            </Chip>
            {SPECIALITIES.map((s) => (
              <Chip key={s} active={speciality === s} onClick={() => setSpeciality(speciality === s ? null : s)}>
                {s}
              </Chip>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13.5px] text-muted" aria-live="polite">
              {list.length} {list.length === 1 ? 'adviser' : 'advisers'}
            </p>
            {filtered && (
              <button type="button" onClick={reset} className="text-[13.5px] font-semibold text-aura hover:text-plum">
                Clear filters
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="No advisers match"
              body="Try a different language or area, or clear the filters to see the whole team."
              action={<Button onClick={reset}>Show all advisers</Button>}
            />
          ) : (
            <ul className="mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((a, i) => (
                <li key={a.id}>
                  <Reveal delay={i * 0.04} className="h-full">
                    <AgentCard agent={a} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)]">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-20 -z-10 w-[520px] opacity-20" strokeWidth={14} />
          <div className="flex flex-col items-start gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-14 md:py-20">
            <div className="max-w-xl">
              <h2 className="font-display text-[38px] leading-[1.02] font-semibold text-white md:text-[56px]">Join our team</h2>
              <p className="mt-4 text-[16px] text-white/80">
                We are growing our sales, leasing and off-plan desks. If you hold (or are working towards) a RERA licence and put clients first, we would like to hear from
                you.
              </p>
            </div>
            <ButtonLink to="/contact" variant="white" size="lg">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
