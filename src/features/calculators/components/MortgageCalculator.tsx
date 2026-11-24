import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useCurrency } from '@/features/favorites/hooks'
import { LeadForm } from '@/features/leads/LeadForm'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'

import { amortisationByYear, MAX_TERM_YEARS, mortgageSummary, purchaseCosts, sumCosts, typicalMinDownPct } from '../lib'
import { Breakdown, CalculatorShell, Disclaimer, NumberSlider, ResultHeadline } from './CalculatorUI'
import { CHART, Donut } from './charts'

type Residency = 'expat' | 'national' | 'non-resident'

const DEFAULTS = { price: 2_000_000, downPct: 20, rate: 4.25, years: 25, residency: 'expat' as Residency }

export function MortgageCalculator({ initialPrice, className }: { initialPrice?: number; className?: string }) {
  const currency = useCurrency()
  const start = { ...DEFAULTS, price: initialPrice ?? DEFAULTS.price }
  const [price, setPrice] = useState(start.price)
  const [downPct, setDownPct] = useState(start.downPct)
  const [rate, setRate] = useState(start.rate)
  const [years, setYears] = useState(start.years)
  const [residency, setResidency] = useState<Residency>(start.residency)
  const [tableOpen, setTableOpen] = useState(false)
  const [leadOpen, setLeadOpen] = useState(false)

  const reset = () => {
    setPrice(start.price)
    setDownPct(start.downPct)
    setRate(start.rate)
    setYears(start.years)
    setResidency(start.residency)
  }

  const m = useMemo(() => mortgageSummary(price, downPct, rate, years), [price, downPct, rate, years])
  const costs = useMemo(() => purchaseCosts(price, { mortgage: true, loanAmount: m.loan }), [price, m.loan])
  const fees = sumCosts(costs)
  const schedule = useMemo(() => amortisationByYear(m.loan, rate, years), [m.loan, rate, years])
  const minDown = typicalMinDownPct(price, residency)
  const fmt = (n: number) => formatPrice(Math.round(n), currency)

  return (
    <div className={className}>
      <CalculatorShell
        title="Mortgage calculator"
        onReset={reset}
        inputs={
          <>
            <NumberSlider label="Property price (AED)" prefix="AED" value={price} onChange={setPrice} min={300_000} max={20_000_000} step={50_000} inputMax={200_000_000} />
            <SelectField
              label="Buyer status"
              value={residency}
              onChange={(e) => setResidency(e.target.value as Residency)}
              options={[
                { value: 'expat', label: 'UAE resident (expat)' },
                { value: 'national', label: 'UAE national' },
                { value: 'non-resident', label: 'Non-resident' },
              ]}
            />
            <NumberSlider
              label="Down payment (%)"
              suffix="%"
              value={downPct}
              onChange={setDownPct}
              min={10}
              max={90}
              step={1}
              hint={
                <>
                  {fmt(m.downPayment)} down.{' '}
                  {downPct < minDown ? (
                    <span className="font-semibold text-aura">Banks typically ask for at least {minDown}% for this profile and price.</span>
                  ) : (
                    <>Typical minimum for this profile: {minDown}%.</>
                  )}
                </>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberSlider label="Interest rate (%)" suffix="%" value={rate} onChange={setRate} min={1} max={9} step={0.05} decimals={2} />
              <NumberSlider label="Term (years)" suffix="yrs" value={years} onChange={setYears} min={5} max={MAX_TERM_YEARS} step={1} />
            </div>
            <Disclaimer>
              Typical UAE Central Bank limits: expats usually need 20% down on a first home under AED 5M (30% above), UAE nationals 15%. Non-resident
              lending varies by bank. Rules change, so check current terms with your bank.
            </Disclaimer>
          </>
        }
        results={
          <div className="grid gap-6">
            <ResultHeadline label="Monthly repayment" value={fmt(m.monthly)} sub={`Over ${years} years at ${rate.toFixed(2)}%`} />
            <Donut
              label="Principal versus interest over the loan"
              segments={[
                { label: 'Principal', value: m.loan, color: CHART.indigo, display: fmt(m.loan) },
                { label: 'Interest', value: m.totalInterest, color: CHART.cyan, display: fmt(m.totalInterest) },
              ]}
              center={
                <span>
                  <span className="block text-[11px] text-muted">Total paid</span>
                  <span className="block text-[13px] font-bold text-plum">{formatPrice(Math.round(m.totalPaid), currency, { compact: true })}</span>
                </span>
              }
            />
            <Breakdown
              rows={[
                { label: 'Loan amount', value: fmt(m.loan) },
                { label: 'Total interest', value: fmt(m.totalInterest) },
                { label: 'Total repaid', value: fmt(m.totalPaid) },
              ]}
            />
            <div>
              <p className="mb-2 text-[13px] font-semibold text-aura">Upfront cash needed</p>
              <Breakdown
                rows={[
                  { label: 'Down payment', value: fmt(m.downPayment) },
                  ...costs.map((c) => ({ label: c.label, value: fmt(c.amount), note: c.note })),
                  { label: 'Total upfront cash', value: fmt(m.downPayment + fees), strong: true },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setLeadOpen(true)}>Get pre-approved</Button>
            </div>
            <Disclaimer>Indicative only, not a mortgage offer. Rates, fees and eligibility are set by each lender.</Disclaimer>
          </div>
        }
      />

      {/* Amortisation table */}
      <div className="mt-6 rounded-[16px] bg-white shadow-soft">
        <button
          type="button"
          aria-expanded={tableOpen}
          aria-controls="amortisation-table"
          onClick={() => setTableOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start md:px-8"
        >
          <span>
            <span className="block text-[16.5px] font-semibold text-plum">Yearly amortisation schedule</span>
            <span className="block text-[13px] text-muted">Principal, interest and remaining balance for each year</span>
          </span>
          <span className={cn('grid size-8 shrink-0 place-items-center rounded-full bg-mist text-indigo transition-transform duration-200', tableOpen && 'rotate-180')}>
            <ChevronDown className="size-4" />
          </span>
        </button>
        {tableOpen && (
          <div id="amortisation-table" className="overflow-x-auto border-t border-line/70 px-6 pb-6 md:px-8">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead>
                <tr className="border-b border-line/70 text-[12px] text-muted">
                  <th scope="col" className="py-3 text-start font-semibold">Year</th>
                  <th scope="col" className="py-3 text-end font-semibold">Principal</th>
                  <th scope="col" className="py-3 text-end font-semibold">Interest</th>
                  <th scope="col" className="py-3 text-end font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70 tabular-nums">
                {schedule.map((r) => (
                  <tr key={r.year}>
                    <th scope="row" className="py-2.5 text-start font-semibold text-plum">{r.year}</th>
                    <td className="py-2.5 text-end">{fmt(r.principal)}</td>
                    <td className="py-2.5 text-end">{fmt(r.interest)}</td>
                    <td className="py-2.5 text-end font-semibold">{fmt(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={leadOpen} onClose={() => setLeadOpen(false)} title="Get pre-approved">
        <p className="mb-5 text-[15px] leading-relaxed text-muted">
          A mortgage adviser will compare offers from UAE banks for a {fmt(price)} home with {downPct}% down, and call you back within one working day.
        </p>
        <LeadForm
          type="callback"
          submitLabel="Request a callback"
          extraFields={[
            { name: 'status', label: 'Employment', kind: 'select', options: ['Salaried', 'Self-employed', 'Business owner'] },
          ]}
          successText="Thanks — a mortgage adviser will call you within one working day."
        />
      </Modal>
    </div>
  )
}
