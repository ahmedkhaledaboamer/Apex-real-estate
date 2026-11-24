import { createFileRoute } from '@tanstack/react-router'
import { useHydrationSafeSearch } from '@/lib/hydration'
import { Home, KeyRound } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { RentVsBuyCalculator } from '@/features/calculators/components/RentVsBuyCalculator'
import { ToolCards } from '@/features/calculators/components/ToolCards'
import { validateCalcSearch } from '@/features/calculators/search'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tools/rent-vs-buy')({
  head: () => seo({ title: "Rent vs buy calculator", description: "Compare the true cost of renting versus buying in Dubai and find your break-even year." }), validateSearch: validateCalcSearch, component: Page })

const ASSUMPTIONS = [
  'Buying fees (DLD 4%, trustee, title deed, agency 2% + VAT, mortgage registration, valuation and arrangement fees) are paid upfront in cash.',
  'The mortgage is a 25-year capital-and-interest loan at a constant rate. In practice, rates are usually fixed for a few years, then variable.',
  'Your upfront cash would otherwise earn the "return on cash" rate, compounded yearly. That lost return counts as a cost of buying.',
  'On sale, you pay a 2% + VAT agency fee and repay the remaining loan; the rest is your equity.',
  'Service charges and upkeep rise with the price growth rate. Rent rises by the rent increase rate (Dubai increases follow the RERA rental index).',
  'Tax, moving costs, furnishing, rental deposits and agency fees on renewing a lease are not included.',
]

function Page() {
  const { price, rent } = useHydrationSafeSearch(Route.useSearch())
  return (
    <>
      <PageHero
        title="Rent vs buy calculator"
        sub="Compare what you would spend renting with the net cost of owning, after the equity you build and what you get back on sale."
        crumbs={[{ label: 'Tools', to: '/tools' }, { label: 'Rent vs buy' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <RentVsBuyCalculator key={`${price}-${rent}`} initial={{ price, rent }} />
        </Container>
      </section>

      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHead title="The assumptions behind it" sub="A simple model, so you can see what drives the answer. Change any input and the verdict updates." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[16px] bg-paper p-6 ring-1 ring-line/70">
                <Home className="size-5 text-indigo" strokeWidth={1.6} />
                <p className="mt-3 text-[16px] font-semibold text-plum">Ready to buy?</p>
                <p className="mt-1 text-[14px] text-muted">Browse homes for sale across Dubai.</p>
                <ButtonLink to="/buy" size="sm" className="mt-4">
                  Homes for sale
                </ButtonLink>
              </div>
              <div className="rounded-[16px] bg-paper p-6 ring-1 ring-line/70">
                <KeyRound className="size-5 text-indigo" strokeWidth={1.6} />
                <p className="mt-3 text-[16px] font-semibold text-plum">Staying flexible?</p>
                <p className="mt-1 text-[14px] text-muted">See verified rentals with clear fees.</p>
                <ButtonLink to="/rent" size="sm" variant="outline" className="mt-4">
                  Homes for rent
                </ButtonLink>
              </div>
            </div>
          </Reveal>
          <ol className="divide-y divide-line/80 border-y border-line/80">
            {ASSUMPTIONS.map((a, i) => (
              <li key={i} className="flex gap-5 py-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist font-display text-[18px] font-semibold text-indigo">{i + 1}</span>
                <p className="text-[15px] leading-relaxed text-ink/80">{a}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="More calculators" />
          </Reveal>
          <ToolCards exclude="/tools/rent-vs-buy" />
        </Container>
      </section>
    </>
  )
}
