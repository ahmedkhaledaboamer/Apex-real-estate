import { Link } from '@tanstack/react-router'

import { useCurrency } from '@/features/favorites/hooks'
import type { CommunityDetail } from '@/types'
import { ppsfValue, rentLabel, yieldLabel } from './helpers'

/** Side-by-side market figures. Table from md up, stacked cards on phones. */
export function CommunityComparison({ communities }: { communities: CommunityDetail[] }) {
  const currency = useCurrency()
  return (
    <>
      <div className="hidden overflow-hidden rounded-[16px] bg-white shadow-soft md:block">
        <table className="w-full text-start text-[14px]">
          <caption className="sr-only">Community comparison: price per sq ft, gross yield, average rents and property types</caption>
          <thead className="bg-mist text-[12.5px] text-muted">
            <tr>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Community</th>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Avg AED / sq ft</th>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Gross yield</th>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Avg 1-bed rent</th>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Avg 2-bed rent</th>
              <th scope="col" className="px-5 py-3.5 text-start font-semibold">Property types</th>
            </tr>
          </thead>
          <tbody>
            {communities.map((c) => (
              <tr key={c.slug} className="border-t border-line/70">
                <th scope="row" className="px-5 py-4 text-start font-semibold text-plum">
                  <Link to="/communities/$communitySlug" params={{ communitySlug: c.slug }} className="hover:text-aura">
                    {c.name}
                  </Link>
                </th>
                <td className="px-5 py-4 text-ink/85">{ppsfValue(c)}</td>
                <td className="px-5 py-4 text-ink/85">{yieldLabel(c)}</td>
                <td className="px-5 py-4 text-ink/85">{rentLabel(c.avgRent1Bed, currency)}</td>
                <td className="px-5 py-4 text-ink/85">{rentLabel(c.avgRent2Bed, currency)}</td>
                <td className="px-5 py-4 text-muted">{c.propertyTypes.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {communities.map((c) => (
          <li key={c.slug} className="rounded-[16px] bg-white p-5 shadow-soft">
            <Link to="/communities/$communitySlug" params={{ communitySlug: c.slug }} className="font-display text-[24px] leading-tight font-semibold text-plum hover:text-aura">
              {c.name}
            </Link>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[14px]">
              <Row label="Avg AED / sq ft" value={ppsfValue(c)} />
              <Row label="Gross yield" value={yieldLabel(c)} />
              <Row label="Avg 1-bed rent" value={rentLabel(c.avgRent1Bed, currency)} />
              <Row label="Avg 2-bed rent" value={rentLabel(c.avgRent2Bed, currency)} />
              <Row label="Property types" value={c.propertyTypes.join(', ')} full />
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : undefined}>
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  )
}
