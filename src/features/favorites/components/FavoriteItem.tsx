import { Check, Scale } from 'lucide-react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { useCompare } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import type { Listing } from '@/types'

/** Saved property card with an "Add to compare" toggle underneath. */
export function FavoriteItem({ listing }: { listing: Listing }) {
  const { inCompare, full, toggle } = useCompare(listing.id)
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1">
        <ConnectedPropertyCard listing={listing} />
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={full}
        aria-pressed={inCompare}
        title={full ? 'You can compare up to 4 properties' : undefined}
        className={cn(
          'flex h-10 items-center justify-center gap-2 rounded-full border text-[13.5px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
          inCompare ? 'border-plum bg-plum text-white' : 'border-line bg-white text-plum hover:border-aura hover:text-aura',
        )}
      >
        {inCompare ? <Check className="size-4" /> : <Scale className="size-4" />}
        {inCompare ? 'Added to compare' : full ? 'Compare list full (4)' : 'Add to compare'}
      </button>
    </div>
  )
}
