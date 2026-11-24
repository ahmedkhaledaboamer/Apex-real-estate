import { Button } from '@/components/ui/Button'
import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatNumber, formatPrice } from '@/lib/format'
import type { UnitType } from '@/types'

function Availability({ n }: { n: number }) {
  if (n <= 0) return <span className="text-[13px] font-semibold text-muted">Sold out</span>
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px] font-semibold', n <= 5 ? 'text-aura' : 'text-success')}>
      <span className={cn('size-1.5 rounded-full', n <= 5 ? 'bg-aura' : 'bg-success')} aria-hidden="true" />
      {n <= 5 ? `Only ${n} left` : `${n} available`}
    </span>
  )
}

/** Unit mix: a table on md+, stacked cards on mobile. "Enquire" hands the unit type to the parent form. */
export function UnitTypesTable({ units, onEnquire }: { units: UnitType[]; onEnquire: (unit: UnitType) => void }) {
  const currency = useCurrency()
  const size = (u: UnitType) => `${formatNumber(u.sizeFrom)} – ${formatNumber(u.sizeTo)} sq ft`

  return (
    <>
      <div className="hidden overflow-hidden rounded-[16px] border border-line/70 bg-white md:block">
        <table className="w-full text-[14.5px]">
          <thead className="bg-mist text-[12px] font-semibold text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 text-start">Unit type</th>
              <th scope="col" className="px-5 py-3 text-start">Size</th>
              <th scope="col" className="px-5 py-3 text-start">From</th>
              <th scope="col" className="px-5 py-3 text-start">Availability</th>
              <th scope="col" className="px-5 py-3 text-end">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {units.map((u) => (
              <tr key={u.type}>
                <th scope="row" className="px-5 py-4 text-start font-semibold text-ink">{u.type}</th>
                <td className="px-5 py-4 text-muted">{size(u)}</td>
                <td className="px-5 py-4 font-bold text-plum">{formatPrice(u.fromAed, currency)}</td>
                <td className="px-5 py-4">
                  <Availability n={u.available} />
                </td>
                <td className="px-5 py-4 text-end">
                  <Button variant="outline" size="sm" onClick={() => onEnquire(u)} disabled={u.available <= 0} aria-label={`Enquire about ${u.type}`}>
                    Enquire
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {units.map((u) => (
          <li key={u.type} className="rounded-[16px] border border-line/70 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15.5px] font-semibold text-ink">{u.type}</p>
                <p className="text-[13px] text-muted">{size(u)}</p>
              </div>
              <Availability n={u.available} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line/70 pt-3">
              <p className="text-[13px] text-muted">
                From <span className="text-[17px] font-bold text-plum">{formatPrice(u.fromAed, currency)}</span>
              </p>
              <Button variant="outline" size="sm" onClick={() => onEnquire(u)} disabled={u.available <= 0} aria-label={`Enquire about ${u.type}`}>
                Enquire
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
