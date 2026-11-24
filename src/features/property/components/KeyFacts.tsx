import { Armchair, Bath, BedDouble, Building2, CalendarDays, Eye, Hash, KeyRound, Maximize2, SquareParking } from 'lucide-react'

import { formatDate, formatNumber } from '@/lib/format'
import type { Property } from '@/types'
import { FURNISHING_LABEL } from '@/features/search/options'

/** Grid of the listing's key facts. */
export function KeyFacts({ property: p }: { property: Property }) {
  const facts: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: BedDouble, label: 'Bedrooms', value: p.beds === 0 ? 'Studio' : String(p.beds) },
    { icon: Bath, label: 'Bathrooms', value: String(p.baths) },
    { icon: Maximize2, label: 'Built-up area', value: `${formatNumber(p.sqft)} sq ft` },
    { icon: Building2, label: 'Property type', value: p.type },
    { icon: KeyRound, label: 'Completion', value: p.completion === 'offplan' ? `Off-plan${p.handover ? ` · ${p.handover}` : ''}` : 'Ready' },
    { icon: Armchair, label: 'Furnishing', value: FURNISHING_LABEL[p.furnishing] },
    { icon: SquareParking, label: 'Parking', value: `${p.parking} space${p.parking > 1 ? 's' : ''}` },
    { icon: Eye, label: 'View', value: p.view },
    { icon: Hash, label: 'Reference', value: p.reference },
    { icon: CalendarDays, label: 'Listed', value: formatDate(p.listedOn) },
  ]
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-aura">
            <f.icon className="size-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <dt className="text-[12px] text-muted">{f.label}</dt>
            <dd className="text-[15px] font-semibold break-words text-plum">{f.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
