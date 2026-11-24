import { useMemo, useState } from 'react'
import { motion } from '@/lib/motion'
import { useNavigate } from '@tanstack/react-router'
import { List, Map as MapIcon, MousePointerClick, RefreshCw, SlidersHorizontal } from 'lucide-react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { LocationMap, type MapMarker } from '@/components/media/LocationMap'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { Container, EmptyState } from '@/components/ui/misc'
import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useSearchFilters } from '../hooks/useSearchFilters'
import { useListingResults } from '../hooks/useListingResults'
import type { SearchParams } from '../schemas'
import { FILTER_KEYS, PAGE_SIZE, SORT_OPTIONS, type SearchScope } from '../options'
import { ActiveFilters, activeFilterKeys } from './ActiveFilters'
import { FilterDrawer } from './FilterDrawer'
import { FilterFields } from './FilterFields'
import { Pagination } from './Pagination'

type View = 'list' | 'map'

const VIEW_TABS: { key: View; label: React.ReactNode }[] = [
  {
    key: 'list',
    label: (
      <span className="inline-flex items-center gap-1.5">
        <List className="size-4" /> List
      </span>
    ),
  },
  {
    key: 'map',
    label: (
      <span className="inline-flex items-center gap-1.5">
        <MapIcon className="size-4" /> Map
      </span>
    ),
  },
]

/** Search results for /buy and /rent: sticky filters, chips, sort, list/map views, pagination. */
export function SearchResults({ scope }: { scope: SearchScope }) {
  const { filters, setFilters } = useSearchFilters()
  const navigate = useNavigate()
  const currency = useCurrency()
  const { data, isPending, isFetching, isError, refetch } = useListingResults(scope, filters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const view: View = filters.view ?? 'list'
  const total = data?.length ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(filters.page ?? 1, pages)
  const items = useMemo(() => (data ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [data, page])
  const activeCount = activeFilterKeys(scope, filters).length
  const noun = scope === 'rent' ? 'rental' : 'property'
  const plural = scope === 'rent' ? 'rentals' : 'properties'

  /** Update view / page without resetting the page (setFilters always resets it). */
  const patchSearch = (patch: Partial<SearchParams>) =>
    navigate({ to: '.', search: (prev: SearchParams) => ({ ...prev, ...patch }) })

  const clearAll = () => setFilters(Object.fromEntries(FILTER_KEYS.map((k) => [k, undefined])) as Partial<SearchParams>)

  const goToPage = (n: number) => {
    patchSearch({ page: n > 1 ? n : undefined })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const markers: MapMarker[] = useMemo(
    () =>
      items.map((p) => ({
        id: p.id,
        position: p.location,
        label: `${formatPrice(p.priceAed, currency, { compact: true })}${p.kind === 'rent' ? '/yr' : ''}`,
        active: p.id === activeId,
      })),
    [items, currency, activeId],
  )

  const onPinClick = (id: string) => {
    setActiveId(id)
    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.getElementById(`listing-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const activeListing = items.find((p) => p.id === activeId)

  const viewToggle = <Tabs label="Results view" tabs={VIEW_TABS} value={view} onChange={(v) => patchSearch({ view: v === 'list' ? undefined : v })} />

  return (
    <>
      {/* Sticky filter bar (sits under the 108px site header) */}
      <div className="sticky top-[108px] z-30 border-b border-line/70 bg-paper/95 backdrop-blur-md">
        <Container className="py-3">
          <div className="hidden lg:block">
            <FilterFields scope={scope} filters={filters} setFilters={setFilters} layout="bar" />
          </div>
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <Button variant="outline" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
              <SlidersHorizontal className="size-4" /> Filters
              {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-plum text-[11px] text-white">{activeCount}</span>}
            </Button>
            {viewToggle}
          </div>
        </Container>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scope={scope}
        filters={filters}
        setFilters={setFilters}
        onClearAll={clearAll}
        resultCount={data?.length}
      />

      <Container className="py-10 md:py-14">
        {/* Results header */}
        {/* Stacked on mobile from the start, so the controls don't jump to a new row once the count text loads. */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div aria-live="polite">
            <p className="font-display text-[30px] leading-tight font-semibold text-plum md:text-[34px]">
              {isPending ? 'Searching…' : `${total} ${total === 1 ? noun : plural}`}
            </p>
            {/* Always rendered so its line height is reserved while loading (no layout shift). */}
            <p className="mt-1 min-h-[1.5em] text-[14px] text-muted">
              {!isPending && total > 0 && (
                <>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                  {scope === 'buy' ? ' · ready and off-plan homes for sale' : ' · annual rents'}
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SelectField
              label="Sort by"
              value={filters.sort ?? 'newest'}
              onChange={(e) => setFilters({ sort: e.target.value === 'newest' ? undefined : (e.target.value as SearchParams['sort']) })}
              options={SORT_OPTIONS}
              className="w-[200px]"
            />
            <div className="hidden lg:block">{viewToggle}</div>
          </div>
        </div>

        <div className="mt-5">
          <ActiveFilters scope={scope} filters={filters} setFilters={setFilters} onClearAll={clearAll} />
        </div>

        <div className={cn('mt-8 transition-opacity duration-150', isFetching && !isPending && 'opacity-60')}>
          {isError ? (
            <EmptyState
              title="We couldn't load listings just now"
              body="The connection to our listings feed dropped. Your filters are saved in the address bar."
              action={
                <Button variant="plum" onClick={() => void refetch()}>
                  <RefreshCw className="size-4" /> Try again
                </Button>
              }
            />
          ) : isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : total === 0 ? (
            <EmptyState
              title={`No ${plural} match your filters`}
              body="Try widening the price range, removing a filter or searching a nearby community."
              action={
                <Button variant="primary" onClick={clearAll}>
                  Clear filters
                </Button>
              }
            />
          ) : view === 'list' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
                >
                  <ConnectedPropertyCard listing={p} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {/* List side (desktop) */}
              <ul className="hidden gap-6 lg:grid xl:grid-cols-2" aria-label={`${plural} on this page`}>
                {items.map((p) => (
                  <li
                    key={p.id}
                    id={`listing-${p.id}`}
                    className={cn('scroll-mt-[220px] rounded-[16px] transition-shadow duration-200', p.id === activeId && 'ring-2 ring-aura ring-offset-4 ring-offset-paper')}
                  >
                    <ConnectedPropertyCard listing={p} />
                  </li>
                ))}
              </ul>
              {/* Map side */}
              <div>
                <div className="lg:sticky lg:top-[212px]">
                  <LocationMap markers={markers} onMarkerClick={onPinClick} className="h-[62vh] min-h-[380px] lg:h-[calc(100vh-236px)]" />
                </div>
                <div className="mt-5 lg:hidden">
                  {activeListing ? (
                    <div className="mx-auto max-w-md">
                      <ConnectedPropertyCard listing={activeListing} />
                    </div>
                  ) : (
                    <p className="flex items-center justify-center gap-2 rounded-[16px] bg-mist px-4 py-4 text-[14px] text-plum">
                      <MousePointerClick className="size-4" /> Tap a price pin to preview the {noun}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isError && !isPending && <Pagination page={page} pages={pages} onChange={goToPage} />}
      </Container>
    </>
  )
}
