import { useState } from 'react'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/misc'
import { Tabs } from '@/components/ui/Tabs'
import type { ListingKind, Property } from '@/types'

const LABELS: Record<ListingKind, string> = { sale: 'For sale', rent: 'For rent', offplan: 'Off-plan' }
const ORDER: ListingKind[] = ['sale', 'rent', 'offplan']

export function AgentListings({ properties, firstName }: { properties: Property[]; firstName: string }) {
  const kinds = ORDER.filter((k) => properties.some((p) => p.kind === k))
  const [kind, setKind] = useState<ListingKind>(kinds[0] ?? 'sale')

  if (kinds.length === 0) {
    return (
      <EmptyState
        title="No live listings right now"
        body={`${firstName} is between listings. Browse the full market or send a message to hear about new homes first.`}
        action={<ButtonLink to="/buy">Browse homes for sale</ButtonLink>}
      />
    )
  }

  return (
    <div>
      <Tabs<ListingKind>
        label={`${firstName}’s listings`}
        value={kind}
        onChange={setKind}
        tabs={kinds.map((k) => ({ key: k, label: `${LABELS[k]} (${properties.filter((p) => p.kind === k).length})` }))}
      />
      <ul role="tabpanel" aria-label={LABELS[kind]} className="mt-6 grid gap-6 sm:grid-cols-2">
        {properties
          .filter((p) => p.kind === kind)
          .map((p) => (
            <li key={p.id}>
              <ConnectedPropertyCard listing={p} />
            </li>
          ))}
      </ul>
    </div>
  )
}
