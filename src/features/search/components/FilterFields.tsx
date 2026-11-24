import { Chip, SelectField } from '@/components/ui/Field'
import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { SearchParams } from '../schemas'
import {
  BATH_OPTIONS,
  BED_OPTIONS,
  COMPLETION_LABEL,
  FURNISHING_LABEL,
  PRICE_PRESETS,
  PROPERTY_TYPES,
  type SearchScope,
} from '../options'
import { LocationInput } from './LocationInput'

const num = (v: string) => (v === '' ? undefined : Number(v))

/**
 * All search filters. `layout="bar"` renders one row of selects (desktop sticky bar);
 * `layout="drawer"` stacks them and uses chips for bedrooms (mobile drawer).
 */
export function FilterFields({
  scope,
  filters,
  setFilters,
  layout,
}: {
  scope: SearchScope
  filters: SearchParams
  setFilters: (next: Partial<SearchParams>) => void
  layout: 'bar' | 'drawer'
}) {
  const currency = useCurrency()
  const presets = PRICE_PRESETS[scope]
  const suffix = scope === 'rent' ? ' /yr' : ''
  const priceOpts = (values: number[], anyLabel: string) => [
    { value: '', label: anyLabel },
    ...values.map((v) => ({ value: String(v), label: `${formatPrice(v, currency, { compact: true })}${suffix}` })),
  ]
  const minOpts = priceOpts(filters.maxPrice === undefined ? presets : presets.filter((v) => v <= filters.maxPrice!), 'No min')
  const maxOpts = priceOpts(filters.minPrice === undefined ? presets : presets.filter((v) => v >= filters.minPrice!), 'No max')

  const bar = layout === 'bar'

  const typeField = (
    <SelectField
      label="Property type"
      value={filters.type ?? ''}
      onChange={(e) => setFilters({ type: e.target.value || undefined })}
      options={[{ value: '', label: 'Any type' }, ...PROPERTY_TYPES.map((t) => ({ value: t, label: t }))]}
    />
  )

  const bedsField = bar ? (
    <SelectField
      label="Bedrooms"
      value={filters.beds === undefined ? '' : String(filters.beds)}
      onChange={(e) => setFilters({ beds: num(e.target.value) })}
      options={[{ value: '', label: 'Any' }, ...BED_OPTIONS.map((b) => ({ value: String(b.value), label: b.label }))]}
    />
  ) : (
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold text-plum">Bedrooms</legend>
      <div className="flex flex-wrap gap-2">
        <Chip active={filters.beds === undefined} onClick={() => setFilters({ beds: undefined })}>
          Any
        </Chip>
        {BED_OPTIONS.map((b) => (
          <Chip key={b.value} active={filters.beds === b.value} onClick={() => setFilters({ beds: filters.beds === b.value ? undefined : b.value })}>
            {b.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  )

  const bathsField = (
    <SelectField
      label="Bathrooms"
      value={filters.baths === undefined ? '' : String(filters.baths)}
      onChange={(e) => setFilters({ baths: num(e.target.value) })}
      options={[{ value: '', label: 'Any' }, ...BATH_OPTIONS.map((b) => ({ value: String(b), label: `${b}+` }))]}
    />
  )

  const minField = (
    <SelectField
      label={scope === 'rent' ? 'Min rent' : 'Min price'}
      value={filters.minPrice === undefined ? '' : String(filters.minPrice)}
      onChange={(e) => setFilters({ minPrice: num(e.target.value) })}
      options={minOpts}
    />
  )
  const maxField = (
    <SelectField
      label={scope === 'rent' ? 'Max rent' : 'Max price'}
      value={filters.maxPrice === undefined ? '' : String(filters.maxPrice)}
      onChange={(e) => setFilters({ maxPrice: num(e.target.value) })}
      options={maxOpts}
    />
  )

  const scopeField =
    scope === 'buy' ? (
      <SelectField
        label="Completion"
        value={filters.completion ?? ''}
        onChange={(e) => setFilters({ completion: (e.target.value || undefined) as SearchParams['completion'] })}
        options={[{ value: '', label: 'Any' }, ...Object.entries(COMPLETION_LABEL).map(([value, label]) => ({ value, label }))]}
      />
    ) : (
      <SelectField
        label="Furnishing"
        value={filters.furnishing ?? ''}
        onChange={(e) => setFilters({ furnishing: (e.target.value || undefined) as SearchParams['furnishing'] })}
        options={[{ value: '', label: 'Any' }, ...Object.entries(FURNISHING_LABEL).map(([value, label]) => ({ value, label }))]}
      />
    )

  const location = <LocationInput value={filters.location} onCommit={(location) => setFilters({ location })} />

  if (bar) {
    return (
      <div className={cn('grid grid-cols-[minmax(0,1.6fr)_repeat(6,minmax(0,1fr))] gap-2')}>
        {location}
        {typeField}
        {bedsField}
        {bathsField}
        {minField}
        {maxField}
        {scopeField}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {location}
      {typeField}
      {bedsField}
      <div className="grid grid-cols-2 gap-3">
        {minField}
        {maxField}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {bathsField}
        {scopeField}
      </div>
    </div>
  )
}
