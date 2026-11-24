import { useState } from 'react'

import { SelectField, TextField } from '@/components/ui/Field'
import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatNumber, formatPrice } from '@/lib/format'
import type { PaymentMilestone, UnitType } from '@/types'

const SEGMENT = ['bg-plum', 'bg-indigo', 'bg-royal', 'bg-aura', 'bg-cyan', 'bg-indigo/60']
const CUSTOM = 'custom'

/** Payment plan: proportional bar, milestone timeline (horizontal ≥ md, vertical on mobile) and an amount calculator. */
export function PaymentPlanTimeline({ milestones, unitTypes, plan }: { milestones: PaymentMilestone[]; unitTypes: UnitType[]; plan: string }) {
  const currency = useCurrency()
  const [choice, setChoice] = useState('0')
  const [custom, setCustom] = useState('')

  const customValue = Number(custom.replace(/[^0-9]/g, ''))
  const price = choice === CUSTOM ? customValue : (unitTypes[Number(choice)]?.fromAed ?? 0)

  let running = 0
  const rows = milestones.map((m) => {
    running += m.percent
    return { ...m, cumulative: running, amount: (price * m.percent) / 100 }
  })

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-mist" aria-hidden="true">
        {rows.map((m, i) => (
          <span key={m.label} className={cn('h-full border-e-2 border-white last:border-e-0', SEGMENT[i % SEGMENT.length])} style={{ width: `${m.percent}%` }} />
        ))}
      </div>

      <ol className="relative mt-8 md:grid md:gap-4" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
          {rows.map((m, i) => (
            <li key={m.label} className="relative flex gap-4 pb-6 last:pb-0 md:block md:pb-0">
              {/* connector */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute start-[11px] top-6 bottom-0 w-px bg-line md:start-6 md:-end-4 md:top-[11px] md:bottom-auto md:h-px md:w-auto',
                  i === rows.length - 1 && 'hidden md:hidden',
                )}
              />
              <span aria-hidden="true" className={cn('relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ring-4 ring-white', SEGMENT[i % SEGMENT.length])}>
                <span className="size-2 rounded-full bg-white" />
              </span>
              <div className="min-w-0 md:mt-4 md:pe-3">
                <p className="text-[24px] leading-none font-bold text-plum">{m.percent}%</p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-ink">{m.label}</p>
                <p className="text-[13px] text-muted">{m.due}</p>
                <p className="mt-1 text-[12.5px] text-muted">Cumulative {m.cumulative}%</p>
              </div>
            </li>
          ))}
      </ol>

      <div className="mt-10 rounded-[16px] border border-line/70 bg-paper p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-[17px] font-semibold text-plum">Payment calculator</h3>
            <p className="mt-1 text-[14px] text-muted">See what each instalment of the {plan} plan comes to for a unit type, or enter your own price.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Unit type"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            options={[
              ...unitTypes.map((u, i) => ({ value: String(i), label: `${u.type} · from ${formatPrice(u.fromAed, currency, { compact: true })}` })),
              { value: CUSTOM, label: 'Enter a price' },
            ]}
          />
          <TextField
            label="Purchase price (AED)"
            inputMode="numeric"
            placeholder="e.g. 2,500,000"
            value={choice === CUSTOM ? custom : formatNumber(price)}
            onChange={(e) => {
              setChoice(CUSTOM)
              const digits = e.target.value.replace(/[^0-9]/g, '')
              setCustom(digits ? formatNumber(Number(digits)) : '')
            }}
          />
        </div>

        {price > 0 ? (
          <div className="mt-5 overflow-hidden rounded-[12px] border border-line/70 bg-white">
            <table className="w-full text-start text-[14px]">
              <caption className="sr-only">Instalments for a purchase price of {formatPrice(price, currency)}</caption>
              <thead className="bg-mist text-[12px] font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-start">Milestone</th>
                  <th scope="col" className="px-4 py-2.5 text-end">%</th>
                  <th scope="col" className="px-4 py-2.5 text-end">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {rows.map((m) => (
                  <tr key={m.label}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">{m.label}</span>
                      <span className="block text-[12.5px] text-muted">{m.due}</span>
                    </td>
                    <td className="px-4 py-3 text-end text-muted">{m.percent}%</td>
                    <td className="px-4 py-3 text-end font-semibold text-plum">{formatPrice(m.amount, currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line bg-paper">
                  <th scope="row" className="px-4 py-3 text-start font-semibold text-ink">Total</th>
                  <td className="px-4 py-3 text-end text-muted">{running}%</td>
                  <td className="px-4 py-3 text-end font-bold text-plum">{formatPrice(price, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-[14px] text-muted">Enter a purchase price to see each instalment.</p>
        )}
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          Indicative only. Excludes the 4% DLD fee, Oqood registration and admin fees. Construction-linked dates can move with the build schedule; your SPA sets the final terms.
        </p>
      </div>
    </div>
  )
}
