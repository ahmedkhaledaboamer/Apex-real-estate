import { useId, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import {
  AGENCY_COMMISSION,
  DLD_TRANSFER_FEE,
  MORTGAGE_REGISTRATION,
  MORTGAGE_REGISTRATION_ADMIN,
  TITLE_DEED_FEE,
  TRUSTEE_FEE_HIGH,
  TRUSTEE_FEE_LOW,
  VAT,
} from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import type { Property } from '@/types'

/** Rental-side costs (indicative Dubai norms). */
const RENT_AGENCY_FEE = 0.05
const EJARI_FEE = 220
const DEWA_DEPOSIT = 2_000

type Row = { label: string; sub?: string; aed: number }

/** Upfront cost estimate: buyer fees (sale / off-plan) or move-in costs (rent). */
export function CostBreakdown({ property: p }: { property: Property }) {
  return p.kind === 'rent' ? <RentCosts property={p} /> : <SaleCosts property={p} />
}

function SaleCosts({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const switchId = useId()
  const [mortgage, setMortgage] = useState(false)
  const price = p.priceAed
  const ltv = price > 5_000_000 ? 0.7 : 0.8
  const loan = price * ltv

  const fees: Row[] = [
    { label: 'DLD transfer fee', sub: `${DLD_TRANSFER_FEE * 100}% of the price`, aed: price * DLD_TRANSFER_FEE },
    { label: 'Agency commission', sub: `${AGENCY_COMMISSION * 100}% + ${VAT * 100}% VAT`, aed: price * AGENCY_COMMISSION * (1 + VAT) },
    {
      label: 'Trustee office fee',
      sub: `${price >= 500_000 ? 'Property AED 500k+' : 'Property under AED 500k'}, incl. VAT`,
      aed: (price >= 500_000 ? TRUSTEE_FEE_HIGH : TRUSTEE_FEE_LOW) * (1 + VAT),
    },
    { label: 'Title deed issuance', aed: TITLE_DEED_FEE },
  ]
  if (mortgage) {
    fees.push({
      label: 'Mortgage registration',
      sub: `${MORTGAGE_REGISTRATION * 100}% of the loan + admin`,
      aed: loan * MORTGAGE_REGISTRATION + MORTGAGE_REGISTRATION_ADMIN,
    })
  }
  const feeTotal = fees.reduce((s, r) => s + r.aed, 0)
  const base: Row = mortgage
    ? { label: 'Down payment', sub: `${Math.round((1 - ltv) * 100)}% deposit · loan ${formatPrice(loan, currency)}`, aed: price - loan }
    : { label: 'Purchase price', aed: price }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3">
        <label htmlFor={switchId} className="text-[14.5px] font-semibold text-plum">
          Buying with a mortgage?
        </label>
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={mortgage}
          onClick={() => setMortgage((m) => !m)}
          className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150', mortgage ? 'bg-plum' : 'bg-line')}
        >
          <span
            className={cn(
              'absolute top-1 size-5 rounded-full bg-white shadow-soft transition-[inset-inline-start] duration-150',
              mortgage ? 'start-6' : 'start-1',
            )}
          />
        </button>
      </div>

      <CostTable rows={[base, ...fees]} currency={currency} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Total label="Fees and charges" value={formatPrice(feeTotal, currency)} />
        <Total label="Total cash needed" value={formatPrice(base.aed + feeTotal, currency)} strong />
      </div>
      <p className="mt-3 text-[12.5px] text-muted">
        Estimates only. {mortgage ? `Assumes ${Math.round(ltv * 100)}% loan-to-value for a first home; bank valuation and arrangement fees are extra.` : 'Fees are set by DLD and may change.'}
      </p>
      <Link to="/tools/mortgage" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
        Estimate your monthly payments <ArrowRight className="size-4 rtl:rotate-180" />
      </Link>
    </div>
  )
}

function RentCosts({ property: p }: { property: Property }) {
  const currency = useCurrency()
  const rent = p.priceAed
  const cheques = p.cheques ?? 1
  const perCheque = rent / cheques
  const depositPct = p.furnishing === 'unfurnished' ? 0.05 : 0.1
  const rows: Row[] = [
    { label: 'First cheque', sub: `${cheques} cheque${cheques > 1 ? 's' : ''} of ${formatPrice(perCheque, currency)}`, aed: perCheque },
    { label: 'Security deposit', sub: `${depositPct * 100}% of annual rent (${p.furnishing === 'unfurnished' ? 'unfurnished' : 'furnished'}), refundable`, aed: rent * depositPct },
    { label: 'Agency fee', sub: `${RENT_AGENCY_FEE * 100}% + ${VAT * 100}% VAT`, aed: rent * RENT_AGENCY_FEE * (1 + VAT) },
    { label: 'Ejari registration', sub: 'Approximate', aed: EJARI_FEE },
    { label: 'DEWA deposit', sub: 'Approximate, refundable', aed: DEWA_DEPOSIT },
  ]
  const upfront = rows.reduce((s, r) => s + r.aed, 0)

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Total label="Annual rent" value={formatPrice(rent, currency)} />
        <Total label={`Per cheque (${cheques} cheque${cheques > 1 ? 's' : ''})`} value={formatPrice(perCheque, currency)} />
      </div>
      <CostTable rows={rows} currency={currency} />
      <div className="mt-4">
        <Total label="Total to move in" value={formatPrice(upfront, currency)} strong />
      </div>
      <p className="mt-3 text-[12.5px] text-muted">Estimates only. Cheque terms are agreed with the landlord; deposits are returned at the end of the tenancy subject to condition.</p>
      <Link to="/tools/rent-vs-buy" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
        Compare renting with buying <ArrowRight className="size-4 rtl:rotate-180" />
      </Link>
    </div>
  )
}

function CostTable({ rows, currency }: { rows: Row[]; currency: ReturnType<typeof useCurrency> }) {
  return (
    <dl className="mt-4 divide-y divide-line/70 border-y border-line/70">
      {rows.map((r) => (
        <div key={r.label} className="flex items-start justify-between gap-4 py-3">
          <dt>
            <span className="block text-[14.5px] font-medium text-ink">{r.label}</span>
            {r.sub && <span className="block text-[12.5px] text-muted">{r.sub}</span>}
          </dt>
          <dd className="shrink-0 text-[14.5px] font-semibold text-plum">{formatPrice(r.aed, currency)}</dd>
        </div>
      ))}
    </dl>
  )
}

function Total({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn('rounded-xl px-4 py-3', strong ? 'bg-plum text-white' : 'bg-mist')}>
      <p className={cn('text-[12px]', strong ? 'text-white/70' : 'text-muted')}>{label}</p>
      <p className={cn('text-[20px] font-bold', strong ? 'text-white' : 'text-plum')}>{value}</p>
    </div>
  )
}
