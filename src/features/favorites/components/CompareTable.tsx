import { srcSetOf } from '@/assets/images'
import { Link } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatArea, formatNumber, formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { useAppDispatch } from '@/store/hooks'
import { MAX_COMPARE, toggleCompare } from '@/store/slices/compareSlice'
import type { Currency, Property } from '@/types'

type Row = {
  label: string
  /** Numeric value used to pick the best column. */
  value?: (p: Property) => number
  best?: 'min' | 'max'
  render: (p: Property, currency: Currency) => React.ReactNode
}

const detailLink = (p: Property) => ({ to: p.kind === 'rent' ? '/rent/$propertyId' : '/buy/$propertyId', params: { propertyId: p.id } }) as const

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const ROWS: Row[] = [
  {
    label: 'Price',
    value: (p) => p.priceAed,
    best: 'min',
    render: (p, c) => (
      <>
        {formatPrice(p.priceAed, c)}
        {p.kind === 'rent' && <span className="text-muted"> /year</span>}
      </>
    ),
  },
  { label: 'Price per sq ft', value: (p) => p.priceAed / p.sqft, best: 'min', render: (p, c) => formatPrice(p.priceAed / p.sqft, c) },
  {
    label: 'Community',
    render: (p) => (
      <Link to="/communities/$communitySlug" params={{ communitySlug: p.communitySlug }} className="text-plum hover:text-aura hover:underline">
        {p.community}
      </Link>
    ),
  },
  { label: 'Building', render: (p) => p.building },
  { label: 'Type', render: (p) => p.type },
  { label: 'Bedrooms', value: (p) => p.beds, best: 'max', render: (p) => (p.beds === 0 ? 'Studio' : p.beds) },
  { label: 'Bathrooms', value: (p) => p.baths, best: 'max', render: (p) => p.baths },
  { label: 'Size', value: (p) => p.sqft, best: 'max', render: (p) => formatArea(p.sqft) },
  {
    label: 'Completion',
    render: (p) => (p.completion === 'ready' ? 'Ready' : `Off-plan${p.handover ? ` · handover ${p.handover}` : ''}`),
  },
  { label: 'Payment plan', render: (p) => p.paymentPlan ?? '—' },
  { label: 'Furnishing', render: (p) => (p.furnishing === 'partly' ? 'Partly furnished' : cap(p.furnishing)) },
  { label: 'Parking', value: (p) => p.parking, best: 'max', render: (p) => `${p.parking} space${p.parking === 1 ? '' : 's'}` },
  { label: 'View', render: (p) => p.view },
  {
    label: 'Service charge',
    value: (p) => p.serviceChargePerSqft,
    best: 'min',
    render: (p) => `AED ${formatNumber(p.serviceChargePerSqft)} / sq ft`,
  },
  {
    label: 'Est. annual service charge',
    value: (p) => p.serviceChargePerSqft * p.sqft,
    best: 'min',
    render: (p, c) => formatPrice(p.serviceChargePerSqft * p.sqft, c),
  },
  { label: 'Trakheesi permit', render: (p) => <span className="tabular-nums">{p.permit}</span> },
  { label: 'Reference', render: (p) => p.reference },
  {
    label: 'Agent',
    render: (p) => {
      const a = agentProfileById(p.agentId)
      return (
        <Link to="/agents/$agentSlug" params={{ agentSlug: a.slug }} className="flex items-center gap-2 text-plum hover:text-aura">
          <img decoding="async" loading="lazy" src={a.photo} srcSet={srcSetOf(a.photo)} sizes="28px" alt="" className="size-7 rounded-full object-cover" />
          <span>{a.name}</span>
        </Link>
      )
    },
  },
]

function bestIndexes(items: Property[], row: Row) {
  if (!row.value || !row.best || items.length < 2) return new Set<number>()
  const vals = items.map(row.value)
  const target = row.best === 'min' ? Math.min(...vals) : Math.max(...vals)
  if (vals.every((v) => v === target)) return new Set<number>()
  return new Set(vals.flatMap((v, i) => (v === target ? [i] : [])))
}

const stickyCell = 'sticky start-0 z-10 bg-white'

/** Side-by-side comparison. Columns are properties; first column (labels) stays put while scrolling. */
export function CompareTable({ items }: { items: Property[] }) {
  const currency = useCurrency()
  const dispatch = useAppDispatch()
  const slotsLeft = MAX_COMPARE - items.length

  return (
    <div className="overflow-x-auto rounded-[16px] bg-white shadow-soft">
      <table className="w-full border-separate border-spacing-0 text-[14px]">
        <caption className="sr-only">Comparison of {items.length} properties. Best values per row are highlighted.</caption>
        <thead>
          <tr>
            <th scope="col" className={cn(stickyCell, 'w-[124px] min-w-[124px] border-e border-b border-line/70 p-4 align-bottom text-start sm:w-[180px] sm:min-w-[180px]')}>
              <span className="text-[12px] font-semibold text-muted">
                {items.length} of {MAX_COMPARE} selected
              </span>
            </th>
            {items.map((p) => (
              <th key={p.id} scope="col" className="min-w-[220px] border-b border-line/70 p-4 align-top text-start font-normal">
                <div className="relative overflow-hidden rounded-xl bg-mist">
                  <img decoding="async" src={p.images[0]} srcSet={srcSetOf(p.images[0])} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => dispatch(toggleCompare(p.id))}
                    aria-label={`Remove ${p.title} from comparison`}
                    className="absolute end-2 top-2 grid size-8 place-items-center rounded-full bg-white/95 text-plum shadow-soft transition-colors duration-150 hover:bg-mist"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Link {...detailLink(p)} className="mt-3 block text-[15px] leading-snug font-semibold text-ink hover:text-aura">
                  {p.title}
                </Link>
                <p className="mt-1 text-[18px] font-bold tracking-tight text-plum">
                  {formatPrice(p.priceAed, currency)}
                  {p.kind === 'rent' && <span className="text-[13px] font-medium text-muted"> /year</span>}
                </p>
                <p className="text-[12.5px] text-muted">{p.kind === 'rent' ? 'For rent' : p.kind === 'offplan' ? 'Off-plan' : 'For sale'}</p>
              </th>
            ))}
            {slotsLeft > 0 && (
              <th scope="col" className="min-w-[200px] border-b border-line/70 p-4 align-top font-normal">
                <Link
                  to="/buy"
                  className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-center text-plum transition-colors duration-150 hover:border-aura hover:text-aura"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-mist">
                    <Plus className="size-5" />
                  </span>
                  <span className="text-[14px] font-semibold">Add a property</span>
                </Link>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                  Add up to {slotsLeft} more from any property page using “Add to compare”.
                </p>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const best = bestIndexes(items, row)
            return (
              <tr key={row.label} className="group">
                <th scope="row" className={cn(stickyCell, 'border-e border-b border-line/70 px-4 py-3 text-start text-[12.5px] font-semibold text-muted group-hover:bg-mist')}>
                  {row.label}
                </th>
                {items.map((p, i) => (
                  <td
                    key={p.id}
                    className={cn(
                      'border-b border-line/70 px-4 py-3 align-top text-ink/85 group-hover:bg-mist/60',
                      best.has(i) && 'font-semibold text-success',
                    )}
                  >
                    {row.render(p, currency)}
                    {best.has(i) && <span className="sr-only"> (best)</span>}
                  </td>
                ))}
                {slotsLeft > 0 && <td aria-hidden="true" className="border-b border-line/70" />}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
