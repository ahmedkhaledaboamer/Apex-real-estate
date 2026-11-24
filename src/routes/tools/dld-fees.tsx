import { createFileRoute } from '@tanstack/react-router'
import { useHydrationSafeSearch } from '@/lib/hydration'
import { Building2, Landmark, User, UserCheck } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { DldFeesCalculator } from '@/features/calculators/components/DldFeesCalculator'
import { ToolCards } from '@/features/calculators/components/ToolCards'
import { validateCalcSearch } from '@/features/calculators/search'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tools/dld-fees')({
  head: () => seo({ title: "DLD & buying fees calculator", description: "Every fee of buying property in Dubai, line by line: DLD 4%, trustee, agency and mortgage registration." }), validateSearch: validateCalcSearch, component: Page })

const PAYERS = [
  {
    icon: User,
    who: 'Buyer',
    items: [
      'DLD transfer fee of 4% (by market practice; the contract can say otherwise)',
      'Title deed issuance and small DLD admin fees',
      'Trustee office fee + VAT on a ready transfer',
      'Buyer agency commission, typically 2% + VAT',
      'Mortgage registration, bank valuation and arrangement fees if financing',
    ],
  },
  {
    icon: UserCheck,
    who: 'Seller',
    items: [
      'Seller agency commission, typically 2% + VAT',
      'Developer NOC fee (usually AED 500–5,000 + VAT)',
      'Clearing any outstanding service charges before transfer',
      'Settling their own mortgage, if the property is financed',
    ],
  },
  {
    icon: Building2,
    who: 'Developer (off-plan)',
    items: [
      'Collects the 4% Oqood registration and passes it to DLD',
      'Sometimes waives all or part of the DLD fee as a launch offer',
      'Issues the title deed through DLD at handover',
    ],
  },
  {
    icon: Landmark,
    who: 'Dubai Land Department',
    items: [
      'Receives the transfer / Oqood and mortgage registration fees',
      'Registers the sale through an approved trustee office',
      'Issues the electronic title deed in the buyer’s name',
    ],
  },
]

const FAQ = [
  {
    q: 'Is the 4% DLD fee split between buyer and seller?',
    a: 'Legally it can be agreed either way, but in the Dubai market the buyer typically pays the full 4%. Make sure it is stated clearly in the Form F (MOU).',
  },
  {
    q: 'Why is the trustee fee different for cheaper homes?',
    a: 'Trustee offices typically charge AED 2,000 + VAT for properties under AED 500,000 and AED 4,000 + VAT for properties at or above that price.',
  },
  {
    q: 'Do I pay agency commission on off-plan?',
    a: 'Usually not. When you buy off-plan directly from a developer, the developer typically pays the agency. On a resale of an off-plan unit (assignment), buyer commission normally applies.',
  },
  {
    q: 'Can buying fees be financed by the mortgage?',
    a: 'Generally no. Banks lend against the property value, so DLD, trustee and agency fees are usually paid in cash on top of your down payment.',
  },
]

function Page() {
  const { price } = useHydrationSafeSearch(Route.useSearch())
  return (
    <>
      <PageHero
        title="DLD & buying fees calculator"
        sub="An itemised view of the one-off costs on a Dubai purchase: DLD transfer, trustee, title deed, agency and mortgage fees."
        crumbs={[{ label: 'Tools', to: '/tools' }, { label: 'DLD fees' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <DldFeesCalculator key={price ?? 'default'} initialPrice={price} />
        </Container>
      </section>

      <section className="border-y border-line/70 bg-white py-16 md:py-24 print:hidden">
        <Container>
          <Reveal>
            <SectionHead title="Who pays what" sub="Typical split on a Dubai sale at the time of writing. The sale agreement (Form F) sets the final terms." />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAYERS.map((p, i) => (
              <li key={p.who}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-paper p-6 ring-1 ring-line/70">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo">
                      <p.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-[26px] leading-tight font-semibold text-plum">{p.who}</h3>
                    <ul className="mt-3 grid gap-2 text-[14px] leading-relaxed text-muted">
                      {p.items.map((it) => (
                        <li key={it} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-aura" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 md:py-24 print:hidden">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHead title="Fee questions" sub="Ask your adviser to confirm the exact amounts for your transaction." />
          </Reveal>
          <Accordion items={FAQ} defaultOpen={0} />
        </Container>
      </section>

      <section className="border-t border-line/70 bg-white py-16 md:py-24 print:hidden">
        <Container>
          <Reveal>
            <SectionHead title="More calculators" />
          </Reveal>
          <ToolCards exclude="/tools/dld-fees" />
        </Container>
      </section>
    </>
  )
}
