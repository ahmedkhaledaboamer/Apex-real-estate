import { createFileRoute } from '@tanstack/react-router'
import { useHydrationSafeSearch } from '@/lib/hydration'

import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { MortgageCalculator } from '@/features/calculators/components/MortgageCalculator'
import { ToolCards } from '@/features/calculators/components/ToolCards'
import { validateCalcSearch } from '@/features/calculators/search'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tools/mortgage')({
  head: () => seo({ title: "Mortgage calculator", description: "Estimate your monthly mortgage payment and the cash you need upfront to buy in Dubai." }), validateSearch: validateCalcSearch, component: Page })

const FACTS = [
  { value: '20%', label: 'Typical minimum down payment for expats on a first home under AED 5M' },
  { value: '15%', label: 'Typical minimum for UAE nationals on a first home under AED 5M' },
  { value: '25 yrs', label: 'Usual maximum mortgage term, often capped by age at the end of the loan' },
  { value: '0.25%', label: 'DLD mortgage registration fee on the loan amount, plus AED 290' },
]

const FAQ = [
  {
    q: 'Can non-residents get a mortgage in Dubai?',
    a: 'Yes, several UAE banks lend to non-residents, typically with a larger down payment (often 25–40%), stricter income checks and a shorter list of eligible properties. Terms vary widely between banks.',
  },
  {
    q: 'Fixed or variable rate?',
    a: 'Most UAE mortgages start with a fixed rate for 1–5 years, then move to a variable rate linked to EIBOR plus a margin. Check the follow-on rate and early-settlement fees, not just the introductory rate.',
  },
  {
    q: 'What does pre-approval give me?',
    a: 'A pre-approval (in-principle approval) confirms how much a bank is willing to lend based on your income and liabilities. It is usually valid for 60–90 days and makes your offer stronger with sellers.',
  },
  {
    q: 'Can I get a mortgage on an off-plan property?',
    a: 'Some banks finance off-plan purchases from approved developers, usually only once construction reaches a certain stage, and with a higher down payment. Many buyers use the developer payment plan instead.',
  },
  {
    q: 'How much can I borrow?',
    a: 'UAE Central Bank rules typically cap total monthly debt repayments at 50% of your monthly income, and banks apply their own affordability checks on top.',
  },
]

function Page() {
  const { price } = useHydrationSafeSearch(Route.useSearch())
  return (
    <>
      <PageHero
        title="Mortgage calculator"
        sub="See your monthly repayment, the total cost of the loan and the cash you need on day one, including DLD and bank fees."
        crumbs={[{ label: 'Tools', to: '/tools' }, { label: 'Mortgage calculator' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <MortgageCalculator key={price ?? 'default'} initialPrice={price} />
        </Container>
      </section>

      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="UAE mortgages at a glance" sub="Typical lending rules at the time of writing. Each bank applies its own criteria on top." />
          </Reveal>
          <Reveal>
            <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse">
              {FACTS.map((f, i) => (
                <div key={f.value} className={`pe-4 lg:px-8 ${i === 0 ? 'lg:ps-0' : ''}`}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-[44px] leading-none font-semibold text-plum md:text-[52px]">{f.value}</dd>
                  <dd className="mt-2 max-w-[240px] text-[14px] leading-snug text-ink/80">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHead title="Mortgage questions" sub="Short answers to what buyers ask us most. Your adviser will confirm the details for your situation." />
          </Reveal>
          <Accordion items={FAQ} defaultOpen={0} />
        </Container>
      </section>

      <section className="border-t border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="More calculators" />
          </Reveal>
          <ToolCards exclude="/tools/mortgage" />
        </Container>
      </section>
    </>
  )
}
