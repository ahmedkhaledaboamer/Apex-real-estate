import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/misc'
import { Tabs } from '@/components/ui/Tabs'
import type { ListingKind, Property } from '@/types'

const LABELS: Record<ListingKind, string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }
const ORDER: ListingKind[] = ['sale', 'rent', 'offplan']

/** Tabs per listing kind (empty kinds hidden) + "see all" link into the search pages. */
export function CommunityListings({ properties, communityName }: { properties: Property[]; communityName: string }) {
  const kinds = ORDER.filter((k) => properties.some((p) => p.kind === k))
  const [kind, setKind] = useState<ListingKind>(kinds[0] ?? 'sale')

  if (kinds.length === 0) {
    return (
      <EmptyState
        title="No live listings right now"
        body={`New homes in ${communityName} come up every week. Browse the wider market or ask an adviser to alert you first.`}
        action={
          <ButtonLink to="/buy" search={{ location: communityName }}>
            Search all homes for sale
          </ButtonLink>
        }
      />
    )
  }

  const shown = properties.filter((p) => p.kind === kind)
  const search = { location: communityName }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs<ListingKind>
          label={`Properties in ${communityName}`}
          value={kind}
          onChange={setKind}
          tabs={kinds.map((k) => ({ key: k, label: `${LABELS[k]} (${properties.filter((p) => p.kind === k).length})` }))}
        />
        {kind === 'rent' ? (
          <ButtonLink to="/rent" search={search} variant="outline">
            All rentals in {communityName} <ArrowRight className="size-4 rtl:rotate-180" />
          </ButtonLink>
        ) : kind === 'offplan' ? (
          <ButtonLink to="/off-plan" search={search} variant="outline">
            Off-plan in {communityName} <ArrowRight className="size-4 rtl:rotate-180" />
          </ButtonLink>
        ) : (
          <ButtonLink to="/buy" search={search} variant="outline">
            All sales in {communityName} <ArrowRight className="size-4 rtl:rotate-180" />
          </ButtonLink>
        )}
      </div>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel" aria-label={LABELS[kind]}>
        {shown.map((p) => (
          <li key={p.id}>
            <ConnectedPropertyCard listing={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
