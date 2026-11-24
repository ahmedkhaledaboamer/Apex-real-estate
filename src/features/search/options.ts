import { COMMUNITIES } from '@/mocks/communities'
import type { SearchParams } from './schemas'

/** Which listing pool a results page shows. `buy` = sale + off-plan, `rent` = rentals. */
export type SearchScope = 'buy' | 'rent'

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio'] as const

/** Bedroom options. 0 = studio; 5 means "5 or more", the rest are exact. */
export const BED_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5+' },
] as const

/** Minimum bathrooms. */
export const BATH_OPTIONS = [1, 2, 3, 4, 5] as const

/** Price presets in AED (sale = total price, rent = per year). */
export const PRICE_PRESETS: Record<SearchScope, number[]> = {
  buy: [500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000],
  rent: [30_000, 50_000, 75_000, 100_000, 150_000, 200_000, 300_000, 500_000],
}

export const FURNISHING_LABEL: Record<NonNullable<SearchParams['furnishing']>, string> = {
  furnished: 'Furnished',
  unfurnished: 'Unfurnished',
  partly: 'Partly furnished',
}

export const COMPLETION_LABEL: Record<NonNullable<SearchParams['completion']>, string> = {
  ready: 'Ready',
  offplan: 'Off-plan',
}

export const SORT_OPTIONS: { value: NonNullable<SearchParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'price-desc', label: 'Price (high to low)' },
]

export const COMMUNITY_NAMES: string[] = COMMUNITIES.map((c) => c.name)

export const PAGE_SIZE = 9

/** The filter keys a user can set (everything except sort / view / page). */
export const FILTER_KEYS = ['location', 'type', 'beds', 'baths', 'minPrice', 'maxPrice', 'completion', 'furnishing'] as const satisfies readonly (keyof SearchParams)[]

export const bedLabel = (beds: number) => (beds === 0 ? 'Studio' : beds >= 5 ? '5+ beds' : `${beds} bed${beds > 1 ? 's' : ''}`)
