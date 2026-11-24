import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CalendarRange, Droplets, Receipt, UserCog, Wrench } from 'lucide-react'

import { IMG } from '@/assets/images'
import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AdviserBand } from '@/features/calculators/components/AdviserBand'
import { pct } from '@/features/calculators/components/CalculatorUI'
import { CommunityYieldTable } from '@/features/calculators/components/CommunityYields'
import { RoiCalculator } from '@/features/calculators/components/RoiCalculator'
import { roi } from '@/features/calculators/lib'
import { useCurrency } from '@/features/favorites/hooks'
import { formatPrice } from '@/lib/format'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/invest/yield-guide')({
  head: () => seo({ title: "Rental yield guide", description: "Gross vs net rental yield in Dubai, community benchmarks and the costs that reduce your return." }), component: Page })

const EXAMPLE = {
  price: 1_500_000,
  annualRent: 110_000,
  serviceCharge: 16 * 900,
  maintenancePct: 5,
  vacancyWeeks: 2,
  managementPct: 5,
  mortgage: false,
  downPct: 25,
  rate: 4.25,
  years: 25,
}

const COSTS = [
  { icon: Receipt, title: 'Service charges', body: 'Paid to the owners’ association per sq ft each year, typically around AED 12–25 / sq ft for apartments, more in branded or full-amenity towers. Check RERA’s service-charge index for the building.' },
  { icon: Wrench, title: 'Maintenance', body: 'AC servicing, repairs and refreshes between tenants. Budget a few percent of the rent each year; more for older or furnished units.' },
  { icon: CalendarRange, title: 'Vacancy', body: 'Weeks without a tenant between leases. Two to four weeks a year is a common planning assumption in established communities.' },
  { icon: UserCog, title: 'Management & leasing', body: 'Letting fees (often 5% of annual rent from the tenant or owner) and ongoing management, typically 5–8% of the rent.' },
  { icon: Droplets, title: 'DEWA & chiller', body: 'Usually paid by the tenant on long lets, but by the owner on short lets and during vacancy. Some buildings bill chiller (district cooling) separately.' },
]

const COMPARE: { label: string; long: string; short: string }[] = [
  { label: 'Income', long: 'Fixed annual rent, often in 1–4 cheques', short: 'Nightly rates; higher potential gross income, varies by season' },
  { label: 'Occupancy', long: 'Typically 11–12 months a year', short: 'Varies with tourism demand, events and season' },
  { label: 'Running costs', long: 'Tenant usually pays DEWA; few owner costs', short: 'Owner pays DEWA, internet, cleaning, linen and platform fees' },
  { label: 'Furnishing', long: 'Often unfurnished', short: 'Fully furnished to holiday-home standards' },
  { label: 'Licensing', long: 'Ejari registration of the lease', short: 'DTCM holiday-home permit (via an operator or as owner), plus Tourism Dirham per night' },
  { label: 'Management', long: 'Light: renewals, maintenance', short: 'Intensive: guests, turnovers, reviews; operators typically charge 15–25%' },
  { label: 'Best for', long: 'Steady, hands-off income', short: 'Prime tourist areas, owners wanting personal use' },
]

function Page() {
  const currency = useCurrency()
  const fmt = (n: number) => formatPrice(Math.round(n), currency)
  const ex = roi(EXAMPLE)

  return (
    <>
      <PageHero
        image={IMG.jvc}
        title="Rental yield guide"
        sub="How to read gross and net yield in Dubai, which costs eat into returns, and how the main communities compare."
        crumbs={[{ label: 'Invest', to: '/invest' }, { label: 'Yield guide' }]}
      />

      {/* Gross vs net */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Gross vs net yield" sub="Gross yield is the headline number on listings. Net yield is what you actually keep." />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="h-full rounded-[16px] bg-white p-6 shadow-soft md:p-8">
                <p className="text-[13px] font-semibold text-aura">Gross yield</p>
                <p className="mt-3 rounded-xl bg-mist px-4 py-3 text-[16px] font-semibold text-plum">Annual rent ÷ purchase price × 100</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">Fast for comparing areas and listings, but it ignores every cost of owning and letting.</p>
              </div>
            </Reveal>
            <Reveal delay={0.04} className="h-full">
              <div className="h-full rounded-[16px] bg-white p-6 shadow-soft md:p-8">
                <p className="text-[13px] font-semibold text-aura">Net yield</p>
                <p className="mt-3 rounded-xl bg-mist px-4 py-3 text-[16px] font-semibold text-plum">
                  (Rent − vacancy − service charge − maintenance − management) ÷ (price + buying fees) × 100
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">The better measure of return. In Dubai it is commonly 1.5–2.5 points below the gross figure.</p>
              </div>
            </Reveal>
          </div>

          {/* Worked example */}
          <Reveal>
            <div className="mt-6 grid overflow-hidden rounded-[24px] bg-white shadow-soft lg:grid-cols-[1fr_1fr]">
              <div className="p-6 md:p-8">
                <p className="text-[13px] font-semibold text-aura">Worked example</p>
                <h3 className="mt-1 font-display text-[28px] leading-tight font-semibold text-plum md:text-[32px]">A 900 sq ft apartment in a mid-market community</h3>
                <dl className="mt-6 divide-y divide-line/70 border-y border-line/70 text-[14px]">
                  {[
                    ['Purchase price', fmt(EXAMPLE.price)],
                    ['Annual rent', fmt(EXAMPLE.annualRent)],
                    ['Vacancy (2 weeks)', `−${fmt(ex.vacancyLoss)}`],
                    ['Service charge (AED 16 / sq ft)', `−${fmt(ex.serviceCharge)}`],
                    ['Maintenance (5% of rent)', `−${fmt(ex.maintenance)}`],
                    ['Management (5% of rent collected)', `−${fmt(ex.management)}`],
                    ['Net income', fmt(ex.netIncome)],
                    ['Buying fees (DLD, trustee, agency…)', fmt(ex.purchaseCosts)],
                  ].map(([k, v], i) => (
                    <div key={k} className="flex justify-between gap-4 py-2.5">
                      <dt className={i === 6 ? 'font-semibold text-plum' : 'text-ink/80'}>{k}</dt>
                      <dd className={i === 6 ? 'font-bold text-plum tabular-nums' : 'font-semibold tabular-nums'}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="grid content-center gap-8 border-t border-line/70 bg-mist/60 p-6 md:p-8 lg:border-t-0 lg:border-s">
                <div>
                  <p className="text-[13px] font-semibold text-aura">Gross yield</p>
                  <p className="mt-1 text-[34px] leading-tight font-bold text-plum md:text-[40px]">{pct(ex.grossYield)}</p>
                  <p className="text-[13.5px] text-muted">
                    {fmt(EXAMPLE.annualRent)} ÷ {fmt(EXAMPLE.price)}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-aura">Net yield</p>
                  <p className="mt-1 text-[34px] leading-tight font-bold text-plum md:text-[40px]">{pct(ex.netYield)}</p>
                  <p className="text-[13.5px] text-muted">
                    {fmt(ex.netIncome)} ÷ {fmt(EXAMPLE.price + ex.purchaseCosts)}
                  </p>
                </div>
                <Link to="/tools/roi" search={{ price: EXAMPLE.price, rent: EXAMPLE.annualRent }} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-aura hover:text-plum">
                  Try it with your own numbers <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Community table */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Gross yields by community" sub="Sort by yield or price per sq ft. Higher yields usually come with lower entry prices; prime areas trade yield for demand and liquidity." />
          </Reveal>
          <Reveal>
            <CommunityYieldTable sortable />
          </Reveal>
        </Container>
      </section>

      {/* Costs */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHead title="Costs that reduce your yield" sub="The gap between gross and net comes from five main items. Ask for the building’s service-charge history before you buy." />
          </Reveal>
          <ul className="divide-y divide-line/80 border-y border-line/80">
            {COSTS.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={i * 0.04}>
                  <div className="flex items-start gap-5 py-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-indigo">
                      <c.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-[26px] leading-tight font-semibold text-plum">{c.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Short vs long */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Long-term vs short-term letting" sub="Short lets can earn more gross income in the right location, but costs, effort and regulation are higher." />
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-[16px] bg-paper ring-1 ring-line/70">
              <table className="w-full min-w-[640px] text-[14.5px]">
                <caption className="sr-only">Comparison of long-term and short-term letting</caption>
                <thead>
                  <tr className="border-b border-line/70">
                    <th scope="col" className="w-[22%] px-5 py-4 text-start text-[12px] font-semibold text-muted md:px-6">
                      <span className="sr-only">Aspect</span>
                    </th>
                    <th scope="col" className="px-5 py-4 text-start font-display text-[22px] font-semibold text-plum">Long-term (annual lease)</th>
                    <th scope="col" className="px-5 py-4 text-start font-display text-[22px] font-semibold text-plum md:px-6">Short-term (holiday home)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {COMPARE.map((r) => (
                    <tr key={r.label}>
                      <th scope="row" className="px-5 py-3.5 text-start font-semibold text-plum md:px-6">{r.label}</th>
                      <td className="px-5 py-3.5 text-ink/80">{r.long}</td>
                      <td className="px-5 py-3.5 text-ink/80 md:px-6">{r.short}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 text-[12px] text-muted">
            Holiday-home rules (DTCM permits, building approvals, Tourism Dirham) change from time to time; check current requirements with DET/DTCM and your building.
          </p>
        </Container>
      </section>

      {/* Calculator */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Run your own numbers"
              sub="A quick gross and net yield for any property. Open the full calculator to add a mortgage, vacancy and management."
              action={
                <Link to="/tools/roi" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                  Full ROI calculator <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              }
            />
          </Reveal>
          <RoiCalculator compact />
        </Container>
      </section>

      <AdviserBand
        title="Find a higher-yield home"
        sub="Tell us your budget and we will shortlist units with verified rents and service-charge histories, so the net yield holds up."
        submitLabel="Get my shortlist"
        whatsappText="Hello Apex Aura, I am looking for a rental investment."
        topic={['Long-term rental', 'Short-term / holiday home', 'Not sure yet']}
      />
    </>
  )
}
