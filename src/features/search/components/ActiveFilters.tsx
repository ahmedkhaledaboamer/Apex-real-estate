import { X } from 'lucide-react'

import { Chip } from '@/components/ui/Field'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import type { SearchParams } from '../schemas'
import { COMPLETION_LABEL, FILTER_KEYS, FURNISHING_LABEL, bedLabel, type SearchScope } from '../options'

type Key = (typeof FILTER_KEYS)[number]

/** Active filters for this scope (completion is /buy only, furnishing /rent only). */
export function activeFilterKeys(scope: SearchScope, f: SearchParams): Key[] {
  return FILTER_KEYS.filter((k) => {
    if (k === 'completion' && scope !== 'buy') return false
    if (k === 'furnishing' && scope !== 'rent') return false
    const v = f[k]
    return v !== undefined && v !== ''
  })
}

/** Removable chips for each active filter + "Clear all". */
export function ActiveFilters({
  scope,
  filters,
  setFilters,
  onClearAll,
}: {
  scope: SearchScope
  filters: SearchParams
  setFilters: (next: Partial<SearchParams>) => void
  onClearAll: () => void
}) {
  const currency = useCurrency()
  const keys = activeFilterKeys(scope, filters)
  if (keys.length === 0) return null

  const label = (k: Key): string => {
    switch (k) {
      case 'location':
        return `“${filters.location}”`
      case 'type':
        return filters.type!
      case 'beds':
        return bedLabel(filters.beds!)
      case 'baths':
        return `${filters.baths}+ baths`
      case 'minPrice':
        return `From ${formatPrice(filters.minPrice!, currency, { compact: true })}`
      case 'maxPrice':
        return `Up to ${formatPrice(filters.maxPrice!, currency, { compact: true })}`
      case 'completion':
        return COMPLETION_LABEL[filters.completion!]
      case 'furnishing':
        return FURNISHING_LABEL[filters.furnishing!]
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {keys.map((k) => (
        <Chip key={k} active aria-pressed={undefined} onClick={() => setFilters({ [k]: undefined })} aria-label={`Remove filter: ${label(k)}`} className="inline-flex items-center gap-1.5">
          {label(k)}
          <X className="size-3.5" aria-hidden="true" />
        </Chip>
      ))}
      <button type="button" onClick={onClearAll} className="px-2 text-[13.5px] font-semibold text-aura hover:text-plum">
        Clear all
      </button>
    </div>
  )
}
