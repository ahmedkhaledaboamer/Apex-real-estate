import { useMemo } from 'react'

import { filterProperties } from '@/api/properties'
import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import type { SearchParams } from '@/features/search/schemas'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { PROPERTIES } from '@/mocks/properties'

const OFFPLAN = PROPERTIES.filter((p) => p.kind === 'offplan')
const COMMUNITY_OPTIONS = [...new Set(OFFPLAN.map((p) => p.community))].sort()
const TYPE_OPTIONS = ['Apartment', 'Studio', 'Townhouse', 'Villa', 'Penthouse']
const BEDS = [
  { value: '', label: 'Any' },
  { value: '0', label: 'Studio' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]
const PRICE_STEPS = [1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000]

/** Off-plan unit listings, filtered by the URL search params (shared with the home Hero search). */
export function OffPlanUnits({ search, onChange }: { search: SearchParams; onChange: (next: SearchParams) => void }) {
  const currency = useCurrency()
  const units = useMemo(() => filterProperties(OFFPLAN, { ...search, kind: 'offplan' }), [search])
  const hasFilters = search.location || search.type || search.beds !== undefined || search.minPrice !== undefined || search.maxPrice !== undefined

  const set = (patch: Partial<SearchParams>) => onChange({ ...search, ...patch, page: undefined })
  const num = (v: string) => (v === '' ? undefined : Number(v))
  const clear = () => onChange({})

  const locationOptions = [{ value: '', label: 'All communities' }, ...COMMUNITY_OPTIONS.map((c) => ({ value: c, label: c }))]
  if (search.location && !COMMUNITY_OPTIONS.includes(search.location)) locationOptions.push({ value: search.location, label: search.location })

  return (
    <section id="units" className="scroll-mt-24 bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead
            title="Off-plan units"
            sub="Individual units on sale now, each with a valid DLD advertising permit. Prices are the developer’s current list price."
          />
        </Reveal>

        <div role="group" aria-label="Filter units" className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-center">
          <SelectField
            label="Location"
            className="col-span-2 lg:col-span-1"
            value={search.location ?? ''}
            onChange={(e) => set({ location: e.target.value || undefined })}
            options={locationOptions}
          />
          <SelectField
            label="Type"
            value={search.type ?? ''}
            onChange={(e) => set({ type: e.target.value || undefined })}
            options={[{ value: '', label: 'Any type' }, ...TYPE_OPTIONS.map((t) => ({ value: t, label: t }))]}
          />
          <SelectField label="Bedrooms" value={search.beds?.toString() ?? ''} onChange={(e) => set({ beds: num(e.target.value) })} options={BEDS} />
          <SelectField
            label="Min price"
            value={search.minPrice?.toString() ?? ''}
            onChange={(e) => set({ minPrice: num(e.target.value) })}
            options={[{ value: '', label: 'No min' }, ...PRICE_STEPS.map((v) => ({ value: String(v), label: formatPrice(v, currency, { compact: true }) }))]}
          />
          <SelectField
            label="Max price"
            value={search.maxPrice?.toString() ?? ''}
            onChange={(e) => set({ maxPrice: num(e.target.value) })}
            options={[{ value: '', label: 'No max' }, ...PRICE_STEPS.map((v) => ({ value: String(v), label: formatPrice(v, currency, { compact: true }) }))]}
          />
          <Button variant="ghost" onClick={clear} disabled={!hasFilters} className="col-span-2 lg:col-span-1">
            Clear filters
          </Button>
        </div>

        <p className="mb-5 text-[14px] text-muted" aria-live="polite">
          {units.length} {units.length === 1 ? 'unit' : 'units'} available
        </p>

        {units.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((p) => (
              <ConnectedPropertyCard key={p.id} listing={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No units match your search"
            body="Widen the price range or bedroom count, or register interest and Daniel, our off-plan advisor, will send you matching launches."
            action={<Button onClick={clear}>Clear filters</Button>}
          />
        )}
      </div>
    </section>
  )
}
