/**
 * URL search params for /buy, /rent and /off-plan.
 *
 * Hand-written (no zod) on purpose: this runs as a route `validateSearch`, so it sits on the
 * critical path of every page load. Invalid values are dropped individually; nothing throws.
 */

export type SearchParams = {
  kind?: 'sale' | 'rent' | 'offplan'
  location?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  completion?: 'ready' | 'offplan'
  furnishing?: 'furnished' | 'unfurnished' | 'partly'
  sort?: 'newest' | 'price-asc' | 'price-desc'
  view?: 'list' | 'map'
  page?: number
}

const oneOf = <T extends string>(allowed: readonly T[], v: unknown): T | undefined =>
  typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : undefined

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v : undefined)

/** Integer within [min, max]; accepts numbers or numeric strings (URL values). */
export const int = (v: unknown, min: number, max = Number.MAX_SAFE_INTEGER): number | undefined => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  return Number.isInteger(n) && n >= min && n <= max ? n : undefined
}

/** Drop undefined keys so URLs stay clean. */
const compact = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T

/** Use as a TanStack Router `validateSearch`. */
export function validateSearchParams(search: Record<string, unknown>): SearchParams {
  return compact<SearchParams>({
    kind: oneOf(['sale', 'rent', 'offplan'] as const, search.kind),
    location: str(search.location),
    type: str(search.type),
    minPrice: int(search.minPrice, 0),
    maxPrice: int(search.maxPrice, 0),
    beds: int(search.beds, 0, 10),
    baths: int(search.baths, 1, 10),
    completion: oneOf(['ready', 'offplan'] as const, search.completion),
    furnishing: oneOf(['furnished', 'unfurnished', 'partly'] as const, search.furnishing),
    sort: oneOf(['newest', 'price-asc', 'price-desc'] as const, search.sort),
    view: oneOf(['list', 'map'] as const, search.view),
    page: int(search.page, 1),
  })
}
