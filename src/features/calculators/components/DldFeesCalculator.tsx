import { useMemo, useState } from 'react'
import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'

import { clamp, purchaseCosts, sumCosts, TRUSTEE_THRESHOLD } from '../lib'
import { CalculatorShell, ChoiceChips, Disclaimer, NumberSlider, pct, ResultHeadline } from './CalculatorUI'
import { BarRows, CHART } from './charts'

type Status = 'ready' | 'offplan'

export function DldFeesCalculator({ initialPrice, className }: { initialPrice?: number; className?: string }) {
  const currency = useCurrency()
  const start = { price: initialPrice ?? 2_000_000, status: 'ready' as Status, mortgage: false, loan: Math.round((initialPrice ?? 2_000_000) * 0.75), agency: true }
  const [price, setPrice] = useState(start.price)
  const [status, setStatus] = useState<Status>(start.status)
  const [mortgage, setMortgage] = useState(start.mortgage)
  const [loan, setLoan] = useState(start.loan)
  const [agency, setAgency] = useState(start.agency)
  const fmt = (n: number) => formatPrice(Math.round(n), currency)

  const reset = () => {
    setPrice(start.price)
    setStatus(start.status)
    setMortgage(start.mortgage)
    setLoan(start.loan)
    setAgency(start.agency)
  }

  const loanAmount = clamp(loan, 0, price * 0.85)
  const items = useMemo(
    () => purchaseCosts(price, { offPlan: status === 'offplan', mortgage, loanAmount, agency }),
    [price, status, mortgage, loanAmount, agency],
  )
  const total = sumCosts(items)
  const top = items.reduce((m, i) => Math.max(m, i.amount), 1)

  return (
    <CalculatorShell
      className={className}
      title="DLD & buying fees"
      onReset={reset}
      inputs={
        <>
          <NumberSlider
            label="Purchase price (AED)"
            prefix="AED"
            value={price}
            onChange={setPrice}
            min={200_000}
            max={20_000_000}
            step={25_000}
            inputMax={500_000_000}
            hint={status === 'ready' ? (price < TRUSTEE_THRESHOLD ? 'Under AED 500K: lower trustee fee applies.' : 'AED 500K and over: standard trustee fee applies.') : undefined}
          />
          <ChoiceChips
            label="Property status"
            value={status}
            onChange={(v) => {
              setStatus(v)
              setAgency(v === 'ready')
            }}
            options={[
              { value: 'ready', label: 'Ready (resale)' },
              { value: 'offplan', label: 'Off-plan from developer' },
            ]}
          />
          <ChoiceChips
            label="Buying with a mortgage?"
            value={mortgage ? 'yes' : 'no'}
            onChange={(v) => setMortgage(v === 'yes')}
            options={[
              { value: 'no', label: 'No, cash' },
              { value: 'yes', label: 'Yes' },
            ]}
          />
          {mortgage && (
            <NumberSlider
              label="Loan amount (AED)"
              prefix="AED"
              value={loanAmount}
              onChange={setLoan}
              min={0}
              max={Math.max(100_000, Math.round(price * 0.85))}
              step={10_000}
              hint={`${pct(price ? (loanAmount / price) * 100 : 0, 0)} loan-to-value`}
            />
          )}
          <ChoiceChips
            label="Buying through an agency?"
            value={agency ? 'yes' : 'no'}
            onChange={(v) => setAgency(v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes, 2% + VAT' },
              { value: 'no', label: 'No agency fee' },
            ]}
          />
          {status === 'offplan' && (
            <Disclaimer>
              On off-plan, the 4% Oqood registration is paid to DLD, usually collected through the developer. Some developers run fee-waiver
              offers; the title deed is issued at handover.
            </Disclaimer>
          )}
        </>
      }
      results={
        <div className="grid gap-6">
          <ResultHeadline label="Total buying costs" value={fmt(total)} sub={`${pct(price ? (total / price) * 100 : 0)} of the purchase price, on top of the price`} />
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <caption className="sr-only">Itemised buying costs</caption>
              <thead>
                <tr className="border-b border-line/70 text-[12px] text-muted">
                  <th scope="col" className="py-2 text-start font-semibold">Item</th>
                  <th scope="col" className="py-2 text-end font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {items.map((i) => (
                  <tr key={i.key}>
                    <th scope="row" className="py-2.5 pe-4 text-start font-normal text-ink/80">
                      {i.label}
                      {i.note && <span className="block text-[12px] text-muted">{i.note}</span>}
                    </th>
                    <td className="py-2.5 text-end font-semibold tabular-nums whitespace-nowrap">{fmt(i.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-plum/20">
                  <th scope="row" className="py-3 text-start font-semibold text-plum">Total</th>
                  <td className="py-3 text-end font-bold text-plum tabular-nums whitespace-nowrap">{fmt(total)}</td>
                </tr>
                <tr>
                  <th scope="row" className="pb-2 text-start font-normal text-muted">Price + fees</th>
                  <td className="pb-2 text-end font-semibold tabular-nums whitespace-nowrap">{fmt(price + total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <BarRows
            label="Share of each fee"
            max={top}
            rows={items
              .filter((i) => i.amount >= 1_000)
              .map((i, n) => ({
                key: i.key,
                label: i.label.replace(/ \(.*\)/, ''),
                value: i.amount,
                display: pct(price ? (i.amount / price) * 100 : 0),
                color: [CHART.indigo, CHART.aura, CHART.royal, CHART.cyan][n % 4],
              }))}
          />
          <div className="print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print this breakdown
            </Button>
          </div>
          <Disclaimer>
            Indicative only, at the time of writing. Small DLD admin and knowledge fees change from time to time; confirm the final figures with the
            trustee office, your bank and your agent before transfer.
          </Disclaimer>
        </div>
      }
    />
  )
}
