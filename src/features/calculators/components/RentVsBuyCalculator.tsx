import { useMemo, useState } from 'react'

import { useCurrency } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'

import { rentVsBuy } from '../lib'
import { Breakdown, CalculatorShell, Disclaimer, InputGroupTitle, NumberSlider, ResultHeadline } from './CalculatorUI'
import { CHART, LineChart } from './charts'

const DEFAULTS = {
  price: 2_000_000,
  annualRent: 130_000,
  years: 7,
  growthPct: 3,
  rentIncreasePct: 4,
  rate: 4.25,
  downPct: 20,
  investReturnPct: 5,
  ownershipCosts: 20_000,
}

export function RentVsBuyCalculator({ initial, className }: { initial?: { price?: number; rent?: number }; className?: string }) {
  const currency = useCurrency()
  const start = { ...DEFAULTS, price: initial?.price ?? DEFAULTS.price, annualRent: initial?.rent ?? DEFAULTS.annualRent }
  const [s, setS] = useState(start)
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: number) => setS((p) => ({ ...p, [k]: v }))
  const fmt = (n: number) => formatPrice(Math.round(n), currency)
  const fmtC = (n: number) => formatPrice(Math.round(n), currency, { compact: true })

  const r = useMemo(() => rentVsBuy(s), [s])
  const buyingWins = r.final.buyCost < r.final.rentCost
  const diff = Math.abs(r.final.rentCost - r.final.buyCost)

  const verdict =
    r.breakEvenYear !== null && buyingWins
      ? `Buying looks cheaper after year ${r.breakEvenYear}`
      : `Renting stays cheaper over ${s.years} year${s.years === 1 ? '' : 's'}`

  return (
    <CalculatorShell
      className={className}
      title="Rent vs buy"
      onReset={() => setS(start)}
      inputs={
        <>
          <NumberSlider label="Home price (AED)" prefix="AED" value={s.price} onChange={set('price')} min={300_000} max={15_000_000} step={50_000} inputMax={200_000_000} />
          <NumberSlider label="Current annual rent (AED)" prefix="AED" value={s.annualRent} onChange={set('annualRent')} min={20_000} max={1_000_000} step={1_000} inputMax={10_000_000} />
          <NumberSlider label="Years you plan to stay" suffix="yrs" value={s.years} onChange={set('years')} min={1} max={25} />
          <InputGroupTitle>Assumptions</InputGroupTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberSlider label="Price growth (% / yr)" suffix="%" value={s.growthPct} onChange={set('growthPct')} min={-5} max={12} step={0.5} decimals={1} />
            <NumberSlider label="Rent increase (% / yr)" suffix="%" value={s.rentIncreasePct} onChange={set('rentIncreasePct')} min={0} max={12} step={0.5} decimals={1} />
            <NumberSlider label="Mortgage rate (%)" suffix="%" value={s.rate} onChange={set('rate')} min={1} max={9} step={0.05} decimals={2} />
            <NumberSlider label="Down payment (%)" suffix="%" value={s.downPct} onChange={set('downPct')} min={15} max={100} />
            <NumberSlider label="Return on cash (% / yr)" suffix="%" value={s.investReturnPct} onChange={set('investReturnPct')} min={0} max={12} step={0.5} decimals={1} />
            <NumberSlider label="Service charge + upkeep (AED / yr)" prefix="AED" value={s.ownershipCosts} onChange={set('ownershipCosts')} min={0} max={150_000} step={500} inputMax={1_000_000} />
          </div>
        </>
      }
      results={
        <div className="grid gap-6">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-[13px] font-semibold text-aura">Verdict</p>
            <p className="mt-1 font-display text-[30px] leading-tight font-semibold text-plum md:text-[36px]">{verdict}</p>
            <p className="mt-1 text-[13.5px] text-muted">
              Over {s.years} year{s.years === 1 ? '' : 's'}, {buyingWins ? 'buying' : 'renting'} comes out about {fmt(diff)} ahead on these assumptions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultHeadline label="Total cost of renting" value={<span className={cn('text-[26px] md:text-[30px]', !buyingWins && 'text-aura')}>{fmtC(r.final.rentCost)}</span>} />
            <ResultHeadline label="Net cost of buying" value={<span className={cn('text-[26px] md:text-[30px]', buyingWins && 'text-aura')}>{fmtC(r.final.buyCost)}</span>} />
          </div>
          <LineChart
            label="Cumulative cost of renting versus net cost of buying by year"
            xLabels={r.rows.map((x) => `Yr ${x.year}`)}
            marker={r.breakEvenYear !== null ? r.breakEvenYear - 1 : null}
            series={[
              { key: 'rent', label: 'Renting', color: CHART.royal, values: r.rows.map((x) => x.rentCost), display: fmtC(r.final.rentCost) },
              { key: 'buy', label: 'Buying (net)', color: CHART.aura, values: r.rows.map((x) => x.buyCost), display: fmtC(r.final.buyCost) },
            ]}
          />
          <Breakdown
            rows={[
              { label: 'Upfront cash to buy', value: fmt(r.upfrontCash), note: 'Down payment + DLD, trustee, agency and mortgage fees' },
              { label: 'Monthly mortgage', value: fmt(r.monthlyMortgage), note: '25-year term' },
              { label: `Home value after ${s.years} yrs`, value: fmt(r.final.homeValue) },
              { label: 'Your equity at that point', value: fmt(r.final.equity) },
              { label: 'Break-even year', value: r.breakEvenYear ? `Year ${r.breakEvenYear}` : 'Not within this period', strong: true },
            ]}
          />
          <Disclaimer>
            Indicative only. Buying cost = upfront cash + mortgage payments + service charges and upkeep + the return your upfront cash could have
            earned, minus what you would keep after selling (value less 2% + VAT selling fee and the remaining loan). Rent is cumulative with yearly
            increases. Ignores tax, moving costs and renting deposits.
          </Disclaimer>
        </div>
      }
    />
  )
}
