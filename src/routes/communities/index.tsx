import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, LayoutGrid, Map as MapIcon } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { LocationMap, type MapMarker } from '@/components/media/LocationMap'
import { SelectField, Chip } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { Container, EmptyState } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { CommunityComparison } from '@/features/communities/components/CommunityComparison'
import { CommunityTile } from '@/features/communities/components/CommunityTile'
import { ppsfLabel } from '@/features/communities/components/helpers'
import { COMMUNITY_DETAILS } from '@/mocks/communities'
import type { CommunityDetail } from '@/types'
import { srcSetOf } from '@/assets/images'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/communities/')({
  head: () => seo({ title: "Dubai communities", description: "Compare Dubai communities by price per sq ft, rental yield, rents, schools and lifestyle." }), component: Page })

type Sort = 'name' | 'ppsf' | 'yield'
type View = 'grid' | 'map'

const TAGS = Array.from(new Set(COMMUNITY_DETAILS.map((c) => c.tag)))

const SORTS: { value: Sort; label: string }[] = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'ppsf', label: 'Price / sq ft (high to low)' },
  { value: 'yield', label: 'Gross yield (high to low)' },
]

/** Nulls ("Prime market", no yield data) always sort last. */
function sortCommunities(list: CommunityDetail[], sort: Sort) {
  const byNum = (get: (c: CommunityDetail) => number | null) => (a: CommunityDetail, b: CommunityDetail) =>
    (get(b) ?? -Infinity) - (get(a) ?? -Infinity) || a.name.localeCompare(b.name)
  if (sort === 'ppsf') return [...list].sort(byNum((c) => c.ppsf))
  if (sort === 'yield') return [...list].sort(byNum((c) => c.yieldPct))
  return [...list].sort((a, b) => a.name.localeCompare(b.name))
}

function Page() {
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('name')
  const [view, setView] = useState<View>('grid')

  const list = useMemo(() => sortCommunities(tag ? COMMUNITY_DETAILS.filter((c) => c.tag === tag) : COMMUNITY_DETAILS, sort), [tag, sort])

  const markers: MapMarker[] = useMemo(
    () =>
      list.map((c) => ({
        id: c.slug,
        position: c.location,
        label: c.name,
        popup: (
          <div className="w-[220px]">
            <img decoding="async" loading="lazy" src={c.image} srcSet={srcSetOf(c.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            <p className="text-[11.5px] font-semibold text-aura">{c.tag}</p>
            <p className="font-display text-[20px] leading-tight font-semibold text-plum">{c.name}</p>
            <p className="mt-1 text-[12.5px] text-muted">
              {ppsfLabel(c)}
              {c.yieldPct ? ` · ${c.yieldPct.toFixed(2)}% yield` : ''}
            </p>
            <Link
              to="/communities/$communitySlug"
              params={{ communitySlug: c.slug }}
              className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-aura hover:text-plum"
            >
              Community guide <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
            </Link>
          </div>
        ),
      })),
    [list],
  )

  return (
    <>
      <PageHero
        title="Dubai communities"
        sub="Compare Dubai’s most popular freehold areas by price per sq ft, rental yield and lifestyle, then dive into a guide for each one."
        crumbs={[{ label: 'Communities' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div role="group" aria-label="Filter by type of community" className="flex flex-wrap gap-2">
              <Chip active={tag === null} onClick={() => setTag(null)}>
                All
              </Chip>
              {TAGS.map((t) => (
                <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <SelectField
                label="Sort by"
                className="w-full sm:w-64"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                options={SORTS}
              />
              <Tabs<View>
                label="Results view"
                value={view}
                onChange={setView}
                tabs={[
                  { key: 'grid', label: <span className="inline-flex items-center gap-1.5"><LayoutGrid className="size-4" /> Grid</span> },
                  { key: 'map', label: <span className="inline-flex items-center gap-1.5"><MapIcon className="size-4" /> Map</span> },
                ]}
              />
            </div>
          </div>

          <p className="mt-6 text-[13.5px] text-muted" aria-live="polite">
            Showing {list.length} {list.length === 1 ? 'community' : 'communities'}
            {tag ? ` tagged “${tag}”` : ''}
          </p>

          <div className="mt-4">
            {list.length === 0 ? (
              <EmptyState
                title="No communities match"
                body="Try another filter to see more areas."
                action={<Button onClick={() => setTag(null)}>Show all communities</Button>}
              />
            ) : view === 'grid' ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c, i) => (
                  <li key={c.slug}>
                    <Reveal delay={Math.min(i, 6) * 0.04}>
                      <CommunityTile community={c} size="lg" />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <LocationMap markers={markers} className="h-[460px] md:h-[560px]" />
            )}
          </div>
          <p className="mt-4 text-[12px] text-muted">
            ~ Earlier mid-2025 snapshot (Gulf News). Other prices and yields from Bayut and Engel &amp; Völkers Q3 2026 data. Yields are gross and vary by unit size.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Compare at a glance"
              sub="Average asking price, gross yield and typical annual rents side by side. Rents are indicative annual figures in AED."
            />
          </Reveal>
          <CommunityComparison communities={list.length ? list : COMMUNITY_DETAILS} />
          <p className="mt-4 text-[12px] text-muted">
            ~ Earlier mid-2025 snapshot. Yields are gross (before service charges, vacancy and maintenance) and vary by unit size. “On request” means we do not publish a
            reliable average for that area; ask an adviser for current comparables.
          </p>
        </Container>
      </section>
    </>
  )
}
