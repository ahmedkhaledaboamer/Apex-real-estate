import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { filterProperties, getProperties } from '@/api/properties'
import { PROPERTIES } from '@/mocks/properties'
import { queryKeys } from '@/api/queryKeys'
import type { Property } from '@/types'
import type { SearchParams } from '../schemas'
import type { SearchScope } from '../options'

/**
 * Results for /buy (sale + off-plan) or /rent.
 * - Strips view/page from the query key so toggling them never refetches.
 * - /buy queries every kind and drops rentals (getProperties takes a single kind).
 * - Beds 1–4 match exactly; 5 means "5 or more" (the API treats beds as a minimum).
 */
export function useListingResults(scope: SearchScope, filters: SearchParams) {
  const { view: _view, page: _page, kind, ...rest } = filters
  const scopedKind = scope === 'rent' ? 'rent' : kind === 'sale' || kind === 'offplan' ? kind : undefined
  const query: Partial<SearchParams> = {
    ...rest,
    kind: scopedKind,
    // completion only applies to /buy, furnishing only to /rent
    completion: scope === 'buy' ? rest.completion : undefined,
    furnishing: scope === 'rent' ? rest.furnishing : undefined,
  }

  return useQuery({
    queryKey: queryKeys.properties.list(query),
    queryFn: () => getProperties(query),
    // Listings are local mock data, so results are available synchronously: the prerendered HTML
    // contains the cards (SEO + instant first paint) and filter changes render with no loading state.
    // When a real API arrives, replace this with data from the route loader.
    initialData: () => filterProperties(PROPERTIES, query),
    placeholderData: keepPreviousData,
    select: (items: Property[]) =>
      items.filter(
        (p) =>
          (scope === 'rent' ? p.kind === 'rent' : p.kind !== 'rent') &&
          (query.beds === undefined || query.beds === 0 || query.beds >= 5 || p.beds === query.beds),
      ),
  })
}
