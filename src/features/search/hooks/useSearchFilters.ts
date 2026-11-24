import { useNavigate, useSearch } from '@tanstack/react-router'

import { useHydrationSafeSearch } from '@/lib/hydration'
import type { SearchParams } from '../schemas'

/** Reads the validated search params from the URL and updates them (URL is the source of truth for filters). */
export function useSearchFilters() {
  // Prerendered HTML has no query string: match it while hydrating, then apply the URL filters.
  const search = useHydrationSafeSearch(useSearch({ strict: false }) as SearchParams) as SearchParams
  const navigate = useNavigate()

  const setFilters = (next: Partial<SearchParams>) =>
    navigate({ to: '.', search: (prev: SearchParams) => ({ ...prev, ...next, page: undefined }) })

  const clearFilters = () => navigate({ to: '.', search: {} })

  return { filters: search, setFilters, clearFilters }
}
