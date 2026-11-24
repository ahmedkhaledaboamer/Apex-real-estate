import { createFileRoute, Link } from '@tanstack/react-router'
import { useHydrationSafeSearch } from '@/lib/hydration'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { CommunityYieldTable } from '@/features/calculators/components/CommunityYields'
import { RoiCalculator } from '@/features/calculators/components/RoiCalculator'
import { ToolCards } from '@/features/calculators/components/ToolCards'
import { validateCalcSearch } from '@/features/calculators/search'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tools/roi')({
  head: () => seo({ title: "Rental ROI calculator", description: "Work out gross yield, net yield and cash-on-cash return on a Dubai rental property." }), validateSearch: validateCalcSearch, component: Page })

const TERMS = [
  { term: 'Gross yield', body: 'Annual rent divided by the purchase price. Quick to compare, but ignores costs.' },
  { term: 'Net yield', body: 'Rent after vacancy, service charge, maintenance and management, divided by price plus buying fees.' },
  { term: 'Cash-on-cash', body: 'With a mortgage: yearly cash flow after loan payments, divided by the cash you actually put in.' },
]

function Page() {
  const { price, rent } = useHydrationSafeSearch(Route.useSearch())
  return (
    <>
      <PageHero
        title="Rental ROI calculator"
        sub="Gross and net yield, monthly cash flow and cash-on-cash return for a Dubai rental, with or without a mortgage."
        crumbs={[{ label: 'Tools', to: '/tools' }, { label: 'ROI calculator' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <RoiCalculator key={`${price}-${rent}`} initial={{ price, rent }} />
          <dl className="mt-8 grid gap-4 md:grid-cols-3">
            {TERMS.map((t) => (
              <div key={t.term} className="rounded-[16px] bg-white p-6 shadow-soft">
                <dt className="font-display text-[24px] font-semibold text-plum">{t.term}</dt>
                <dd className="mt-1 text-[14.5px] leading-relaxed text-muted">{t.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Benchmark: gross yields by community"
              sub="Compare your result with typical gross yields across Dubai. Open a community guide for rents, schools and commute times."
              action={
                <Link to="/invest/yield-guide" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                  Rental yield guide <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              }
            />
          </Reveal>
          <Reveal>
            <CommunityYieldTable />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="More calculators" />
          </Reveal>
          <ToolCards exclude="/tools/roi" />
        </Container>
      </section>
    </>
  )
}
