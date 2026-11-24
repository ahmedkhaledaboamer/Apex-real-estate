import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, ClipboardList, FileText, HeartPulse, House, IdCard, Landmark, RefreshCw, Users } from 'lucide-react'

import { IMG } from '@/assets/images'
import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AdviserBand } from '@/features/calculators/components/AdviserBand'
import { GoldenVisaChecker } from '@/features/calculators/components/GoldenVisaChecker'
import { GOLDEN_VISA_THRESHOLD } from '@/lib/constants'
import { LISTINGS } from '@/mocks/properties'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/invest/golden-visa')({
  head: () => seo({ title: "Golden Visa through property", description: "How to qualify for the UAE 10-year Golden Visa through Dubai property, with an eligibility checker." }), component: Page })

const ELIGIBLE = LISTINGS.filter((l) => l.kind === 'sale' && l.priceAed >= GOLDEN_VISA_THRESHOLD)
  .sort((a, b) => a.priceAed - b.priceAed)
  .slice(0, 3)

const ELIGIBILITY = [
  { title: 'AED 2M+ in property', body: 'The total purchase value of your Dubai property must typically be AED 2 million or more.' },
  { title: 'Units can be combined', body: 'You can usually reach the threshold with more than one property, as long as each is in your name (or jointly owned within the rules).' },
  { title: 'Mortgaged property', body: 'Mortgaged homes can qualify, typically with a bank NOC; in some cases the amount you have paid is what counts.' },
  { title: 'Off-plan property', body: 'Off-plan units can qualify when bought from approved developers and projects, subject to current rules on the amount paid.' },
]

const BENEFITS = [
  { icon: RefreshCw, title: '10-year renewable residence', body: 'Renewable for as long as you keep the qualifying property.' },
  { icon: Users, title: 'Family sponsorship', body: 'Sponsor your spouse and children; parents may be included under current rules.' },
  { icon: House, title: 'No minimum stay', body: 'The visa typically stays valid even if you spend long periods outside the UAE.' },
  { icon: IdCard, title: 'No employer needed', body: 'Live in the UAE independently, without a local sponsor or job.' },
]

const STEPS = [
  { title: 'Confirm the value', body: 'Check that your title deed(s) or Oqood certificates add up to AED 2M or more, and get a bank NOC if mortgaged.' },
  { title: 'Apply through DLD', body: 'Apply for the property-investor Golden Visa through the DLD service (online or at a customer centre), which issues the eligibility nomination.' },
  { title: 'Entry permit & medical', body: 'Once nominated, you receive an entry permit if outside the UAE, then complete the medical fitness test.' },
  { title: 'Emirates ID & visa', body: 'Give biometrics for your Emirates ID; the 10-year residence visa is issued by ICP/GDRFA.' },
]

const DOCS = [
  'Passport copy (valid for at least 6 months)',
  'Recent passport-size photo with a white background',
  'Title deed(s) or Oqood certificate(s) for each property',
  'Bank NOC and statement of amount paid, if mortgaged',
  'Developer statement of payments, if off-plan',
  'Current UAE visa or entry stamp, if inside the UAE',
  'Health insurance valid in the UAE',
  'Marriage / birth certificates (attested) for family members',
]

const FAQ = [
  {
    q: 'How long does the process take?',
    a: 'Many applicants receive their visa within a few weeks, depending on how quickly documents, medical and biometrics are completed. Timelines are set by the authorities and can change.',
  },
  {
    q: 'What does it cost?',
    a: 'Expect government and service fees for the DLD application, entry permit, medical test, Emirates ID and visa issue, plus health insurance. Totals change from time to time; we will give you a current breakdown.',
  },
  {
    q: 'What happens if I sell the property?',
    a: 'The visa is linked to the qualifying investment. If you sell and your remaining holdings fall below the threshold, the visa may be cancelled or not renewed. Check the current rules before selling.',
  },
  {
    q: 'Can I buy jointly with my spouse?',
    a: 'Joint ownership is generally possible, but how the value is attributed between owners depends on the rules at the time. Ask us before you register the purchase so the title is structured correctly.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. This page is a general guide based on rules at the time of writing. For a definitive answer, check with ICP/GDRFA and DLD, or a licensed immigration adviser.',
  },
]

function Page() {
  return (
    <>
      <PageHero
        image={IMG.palm}
        title="Golden Visa through property"
        sub="Invest AED 2M or more in Dubai property and you may qualify for a renewable 10-year UAE residence visa for you and your family."
        crumbs={[{ label: 'Invest', to: '/invest' }, { label: 'Golden Visa' }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/buy" search={{ minPrice: GOLDEN_VISA_THRESHOLD }} variant="white" size="lg">
            Homes from AED 2M
          </ButtonLink>
        </div>
      </PageHero>

      {/* Eligibility */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHead
              title="Who is eligible"
              sub="A summary of the property route at the time of writing. All criteria are subject to current rules set by DLD and ICP/GDRFA."
            />
            <div className="rounded-[16px] bg-mist p-6">
              <p className="text-[13px] font-semibold text-aura">Threshold</p>
              <p className="mt-1 font-display text-[48px] leading-none font-semibold text-plum">AED 2M</p>
              <p className="mt-2 text-[14px] text-ink/80">Total property value, one or several units.</p>
            </div>
          </Reveal>
          <ul className="divide-y divide-line/80 border-y border-line/80">
            {ELIGIBILITY.map((e, i) => (
              <li key={e.title}>
                <Reveal delay={i * 0.04}>
                  <div className="flex gap-5 py-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-indigo">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-semibold text-plum">{e.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{e.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="What you get" />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <li key={b.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-paper p-6 ring-1 ring-line/70">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo">
                      <b.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-[26px] leading-tight font-semibold text-plum">{b.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{b.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Checker */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Check your eligibility" sub="Answer three questions for an indicative result. It takes less than a minute." />
          </Reveal>
          <GoldenVisaChecker />
        </Container>
      </section>

      {/* Process + documents */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHead title="Step by step" sub="The usual sequence for property investors. Our team can coordinate each step for you." />
            </Reveal>
            <ol className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.04} className="h-full">
                    <div className="h-full rounded-[16px] bg-paper p-6 ring-1 ring-line/70">
                      <span className="font-display text-[40px] leading-none font-semibold text-aura-gradient">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="mt-3 text-[16.5px] font-semibold text-plum">{s.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <Reveal>
            <div className="rounded-[24px] bg-mist p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-white text-indigo shadow-soft">
                  <ClipboardList className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="font-display text-[28px] leading-tight font-semibold text-plum">Documents checklist</h3>
              </div>
              <ul className="mt-6 grid gap-3">
                {DOCS.map((d) => (
                  <li key={d} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/80">
                    <FileText className="mt-0.5 size-4 shrink-0 text-aura" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex gap-2 text-[12px] leading-relaxed text-muted">
                <HeartPulse className="size-3.5 shrink-0" />
                Requirements vary by nationality and case; the authorities may ask for more.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Eligible homes */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Homes that meet the threshold"
              sub="A few ready homes priced at AED 2M or more."
              action={
                <ButtonLink to="/buy" search={{ minPrice: GOLDEN_VISA_THRESHOLD }} variant="outline">
                  All homes from AED 2M <ArrowRight className="size-4 rtl:rotate-180" />
                </ButtonLink>
              }
            />
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ELIGIBLE.map((l, i) => (
              <li key={l.id}>
                <Reveal delay={i * 0.04}>
                  <ConnectedPropertyCard listing={l} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line/70 bg-white py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHead title="Golden Visa questions" sub="General guidance at the time of writing." />
            <p className="flex gap-2 text-[13px] text-muted">
              <Landmark className="size-4 shrink-0" /> Always confirm current rules with ICP/GDRFA and DLD.
            </p>
          </Reveal>
          <Accordion items={FAQ} defaultOpen={0} />
        </Container>
      </section>

      <AdviserBand
        title="Plan your Golden Visa purchase"
        sub="Tell us your budget and timeline. An adviser will shortlist qualifying homes and walk you through the application."
        submitLabel="Request a callback"
        whatsappText="Hello Apex Aora, I would like advice on the Golden Visa through property."
        topic={['Buying to qualify', 'I already own property', 'Combining several units', 'Off-plan purchase']}
      />
    </>
  )
}
