import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BadgePercent, Building, CalendarClock, Hammer, KeyRound, Landmark, IdCard, Plane, ShieldCheck, Users } from 'lucide-react'

import { IMG } from '@/assets/images'
import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AdviserBand } from '@/features/calculators/components/AdviserBand'
import { YieldBarChart } from '@/features/calculators/components/CommunityYields'
import { RoiCalculator } from '@/features/calculators/components/RoiCalculator'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/invest/')({
  head: () => seo({ title: "Invest in Dubai property", description: "Yield-led advice on investing in Dubai property: communities, strategies, Golden Visa and the numbers that matter." }), component: Page })

const WHY = [
  { icon: BadgePercent, title: 'No annual property tax', body: 'Dubai does not levy an annual property tax on residential owners. Owners pay service charges and a housing fee through DEWA instead.' },
  { icon: Landmark, title: 'No capital gains tax for individuals', body: 'At the time of writing, individuals pay no personal income or capital gains tax on property. Corporate structures follow UAE corporate tax rules.' },
  { icon: ShieldCheck, title: 'Freehold for foreign buyers', body: 'Foreign nationals can own freehold property outright in designated areas such as Dubai Marina, Downtown, Business Bay and JVC.' },
  { icon: Users, title: 'Deep rental demand', body: 'A growing population and record leasing activity have kept occupancy high in established communities, according to recent market reports.' },
]

const STRATEGIES: {
  icon: typeof Building
  title: string
  body: string
  points: string[]
  link: { to: '/buy' | '/off-plan' | '/invest/golden-visa' | '/invest/yield-guide'; label: string }
}[] = [
  {
    icon: KeyRound,
    title: 'Ready rental',
    body: 'Buy a completed home and let it on an annual lease from day one.',
    points: ['Income starts immediately', 'You can inspect what you buy', 'Mortgage-friendly'],
    link: { to: '/buy', label: 'Ready homes for sale' },
  },
  {
    icon: Hammer,
    title: 'Off-plan',
    body: 'Buy from the developer during construction, paying in instalments.',
    points: ['Staged payment plans', 'Lower entry price at launch', 'No rent until handover; delivery risk'],
    link: { to: '/off-plan', label: 'Off-plan projects' },
  },
  {
    icon: Plane,
    title: 'Short-let / holiday homes',
    body: 'Let furnished by the night in high-demand tourist areas.',
    points: ['Higher potential gross income', 'Needs a DTCM holiday-home permit', 'More running costs and seasonality'],
    link: { to: '/invest/yield-guide', label: 'Compare short vs long let' },
  },
  {
    icon: IdCard,
    title: 'Golden Visa',
    body: 'Property worth AED 2M or more can support a 10-year residence visa.',
    points: ['Units can typically be combined', 'Family sponsorship', 'Subject to current ICP/GDRFA rules'],
    link: { to: '/invest/golden-visa', label: 'Golden Visa guide' },
  },
]

const STEPS = [
  { icon: CalendarClock, title: 'Portfolio review', body: 'We agree your budget, target yield, timeline and whether you will use finance.' },
  { icon: Building, title: 'Shortlist', body: 'You receive a data-backed shortlist with rents, service charges and recent DLD transactions.' },
  { icon: ShieldCheck, title: 'Offer & due diligence', body: 'We negotiate, check the title, developer NOC and service-charge history, and sign Form F.' },
  { icon: Landmark, title: 'Transfer at DLD', body: 'Payment and transfer through a trustee office; the title deed is issued in your name.' },
  { icon: KeyRound, title: 'Let & manage', body: 'Tenant search, Ejari registration, maintenance and reporting, if you want us to handle it.' },
]

const FAQ = [
  {
    q: 'Can foreigners buy property in Dubai?',
    a: 'Yes. Foreign nationals can buy freehold property in designated areas, which cover most of the communities popular with investors. You do not need UAE residency to buy.',
  },
  {
    q: 'What yields can I expect?',
    a: 'Gross yields in the communities we track range from roughly 5% to 7%, according to our data pack. Net yields are lower after service charges, vacancy and management. Returns are not guaranteed and vary by building and unit.',
  },
  {
    q: 'What are the costs of buying?',
    a: 'Budget around 7–8% on top of the price for a resale home: the 4% DLD transfer fee, trustee and title deed fees, and typically 2% + VAT agency commission. Use our DLD fees calculator for an itemised figure.',
  },
  {
    q: 'Do I pay tax on rental income?',
    a: 'At the time of writing, individuals in the UAE do not pay personal income tax on rental income. You may still owe tax in your home country; take advice from a tax professional.',
  },
  {
    q: 'Can I manage a rental from abroad?',
    a: 'Yes. Many of our investors live overseas. A property manager can handle tenant search, Ejari, rent collection and maintenance, typically for a percentage of the annual rent.',
  },
]

function Page() {
  return (
    <>
      <PageHero
        image={IMG.businessBay}
        title="Invest in Dubai property"
        sub="Yield-led advice on ready, off-plan and holiday-home investments, with clear numbers on costs, returns and residency."
        crumbs={[{ label: 'Invest' }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/tools/roi" variant="white" size="lg">
            Calculate your yield
          </ButtonLink>
          <ButtonLink to="/invest/golden-visa" variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
            Golden Visa guide
          </ButtonLink>
        </div>
      </PageHero>

      {/* Why Dubai */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Why investors choose Dubai" sub="A tax-light, freehold market with strong tenant demand. Here is what that means in practice, at the time of writing." />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-white p-6 shadow-soft">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo">
                      <w.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-[26px] leading-tight font-semibold text-plum">{w.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{w.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12px] text-muted">General information, not tax advice. Rules can change; check your own position with a qualified adviser.</p>
        </Container>
      </section>

      {/* Yield snapshot */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHead
              title="Yield snapshot"
              sub="Gross rental yields in the communities we cover. Mid-market areas such as JVC tend to yield more; prime waterfront areas trade yield for capital value and demand."
            />
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/invest/yield-guide">Read the yield guide</ButtonLink>
              <ButtonLink to="/communities" variant="outline">
                All community guides
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal>
            <YieldBarChart className="bg-paper shadow-none ring-1 ring-line/70" />
          </Reveal>
        </Container>
      </section>

      {/* Strategies */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Investment strategies" sub="Four common routes into the market. Most portfolios end up mixing two or more." />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STRATEGIES.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <Link to={s.link.to} className="group flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lift">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo transition-colors duration-150 group-hover:bg-plum group-hover:text-white">
                      <s.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-[26px] leading-tight font-semibold text-plum">{s.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
                    <ul className="mt-4 grid gap-1.5 text-[13.5px] text-ink/80">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-aura" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-aura group-hover:text-plum">
                      {s.link.label} <ArrowRight className="size-4 rtl:rotate-180" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ROI */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Check a deal in seconds"
              sub="Enter a price and expected rent for a quick gross and net yield. The full calculator adds mortgage, vacancy and management costs."
            />
          </Reveal>
          <RoiCalculator compact className="ring-1 ring-line/70" />
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="How we work with investors" sub="One licensed adviser from the first call to the first rent cheque." />
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-white p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[40px] leading-none font-semibold text-aura-gradient">{String(i + 1).padStart(2, '0')}</span>
                      <s.icon className="size-5 text-indigo" strokeWidth={1.6} />
                    </div>
                    <h3 className="mt-4 text-[16.5px] font-semibold text-plum">{s.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line/70 bg-white py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHead title="Investor questions" sub="General guidance only. Your adviser will walk you through the details for your situation." />
          </Reveal>
          <Accordion items={FAQ} defaultOpen={0} />
        </Container>
      </section>

      <AdviserBand
        title="Book a portfolio review"
        sub="A 30-minute call with an investment adviser: your budget, target yield and the communities that fit, with no obligation."
        submitLabel="Book my review"
        topic={['Ready rental', 'Off-plan', 'Holiday home', 'Golden Visa', 'Not sure yet']}
      />
    </>
  )
}
