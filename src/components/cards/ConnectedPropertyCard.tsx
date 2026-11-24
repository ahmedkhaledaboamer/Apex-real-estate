import { PropertyCard } from '@/components/cards/PropertyCard'
import { useCurrency, useFavorite } from '@/features/favorites/hooks'
import type { Listing } from '@/types'

/** PropertyCard wired to the store (currency + favourites). Use this on every page. */
export function ConnectedPropertyCard({ listing }: { listing: Listing }) {
  const currency = useCurrency()
  const { favorite, toggle } = useFavorite(listing.id)
  return <PropertyCard listing={listing} currency={currency} favorite={favorite} onToggleFavorite={toggle} />
}
