import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, Camera, Globe2, Handshake, LineChart, ShieldCheck, Users } from 'lucide-react'

import { IMG, srcSetOf } from '@/assets/images'
import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { useCurrency } from '@/features/favorites/hooks'
import { ProcessTimeline, type ProcessStep } from '@/features/leads/components/ProcessTimeline'
import { TestimonialGrid } from '@/features/leads/components/TestimonialGrid'
import { LeadForm } from '@/features/leads/LeadForm'
import { AGENCY_COMMISSION, VAT, WHATSAPP_NUMBER, whatsappLink } from '@/lib/constants'
import { formatNumber, formatPrice } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/sell/')({
  head: () => seo({ title: "Sell your property in Dubai", description: "Sell with a licensed Dubai brokerage: free valuation, marketing, viewings and transfer handled for you." }), component: Page })

const DEALS = AGENT_PROFILES.reduce((n, a) => n + a.dealsClosed, 0)

const STATS = [
  { value: `${formatNumber(DEALS)}+`, label: 'homes sold and let by our current team' },
  { value: '4.9', label: 'average Google rating from 312 client reviews' },
  { value: '1 day', label: 'to receive your free, data-backed valuation' },
  { value: '30k+', label: 'registered buyers and investors in our database' },
]

const BENEFITS = [
  { icon: LineChart, title: 'Pricing from real data', body: 'We price from DLD transactions in your building, not wishful asking prices, so your home sells without long price cuts.' },
  { icon: Users, title: 'Buyers before we go live', body: 'Every new listing is matched against our database of qualified buyers and investors in the first 48 hours.' },
  { icon: ShieldCheck, title: 'Fully compliant', body: 'RERA-registered agents, a Trakheesi permit on every advert and every step documented on the official RERA forms.' },
  { icon: Handshake, title: 'One adviser to transfer', body: 'The same agent negotiates, handles the NOC and walks you through the trustee office on transfer day.' },
]

const PROCESS: ProcessStep[] = [
  { title: 'Valuation', meta: 'Day 1', body: 'A RERA-certified agent prepares a valuation from recent DLD transactions and active competition, and agrees a pricing strategy with you.' },
  { title: 'Form A listing agreement', meta: 'Day 1–2', body: 'We sign RERA Form A, the official seller–agent agreement. We check your title deed, passport and, if applicable, your mortgage details.' },
  { title: 'Trakheesi permit & marketing', meta: 'Day 2–5', body: 'We obtain the DLD advertising permit (Trakheesi), shoot professional photography and video, and launch across the portals and our buyer database.' },
  { title: 'Viewings & offers', meta: 'Weeks 1–6', body: 'We pre-qualify buyers, host viewings seven days a week and negotiate every offer in writing, with feedback after each viewing.' },
  { title: 'MOU (Form F) signed', meta: 'Offer accepted', body: 'Buyer and seller sign the Memorandum of Understanding (RERA Form F). The buyer typically pays a 10% security deposit, held by the agency.' },
  { title: 'NOC from the developer', meta: '3–10 days', body: 'We apply for the developer’s No Objection Certificate, confirming there are no outstanding service charges on the property.' },
  { title: 'Transfer at the trustee office', meta: 'Transfer day', body: 'Both parties (or their representatives) attend a Real Estate Registration Trustee office. Funds are exchanged by manager’s cheque and the new title deed is issued.' },
]

const FAQ = [
  {
    q: 'How long does it take to sell a property in Dubai?',
    a: 'Well-priced homes in popular communities typically agree a sale within four to eight weeks. From signed MOU to transfer usually takes two to four weeks for cash buyers, and four to eight weeks where the buyer has a mortgage.',
  },
  {
    q: 'Can I sell a property that is still mortgaged?',
    a: 'Yes. We request a liability letter from your bank and arrange for the buyer’s funds to clear the outstanding mortgage on or before transfer day. The bank then releases the mortgage and the title is transferred.',
  },
  {
    q: 'Can I sell while a tenant is living in the property?',
    a: 'Yes — the tenancy transfers to the new owner and stays valid until it expires. Tenanted homes often appeal to investors. If the buyer wants vacant possession, Dubai law requires 12 months’ notice by notary or registered mail.',
  },
  {
    q: 'Do I need to be in Dubai to sell?',
    a: 'No. You can appoint a representative under a power of attorney (notarised and, if signed abroad, legalised and attested in the UAE). Many of our overseas sellers never need to fly in.',
  },
  {
    q: 'Do I have to sign an exclusive agreement?',
    a: 'Form A can be exclusive or non-exclusive. We recommend a short exclusive period because it lets us invest properly in marketing and keeps one consistent price across the portals.',
  },
  {
    q: 'Who pays the 4% DLD transfer fee?',
    a: 'By market practice the buyer pays the 4% Dubai Land Department transfer fee and the trustee office fee. The seller typically pays the agency fee, the developer NOC fee and any mortgage early-settlement costs.',
  },
]

function Page() {
  const currency = useCurrency()
  const example = 2_000_000
  const fee = example * AGENCY_COMMISSION

  const COSTS = [
    {
      title: 'Agency fee',
      value: `${AGENCY_COMMISSION * 100}% + VAT`,
      body: `Typically 2% of the sale price plus ${VAT * 100}% VAT, paid on transfer. On a ${formatPrice(example, currency)} sale that is ${formatPrice(fee, currency)} + ${formatPrice(fee * VAT, currency)} VAT.`,
    },
    {
      title: 'Developer NOC fee',
      value: 'AED 500 – 5,000',
      body: 'Typically charged by the master developer to issue the No Objection Certificate. Service charges must be paid up to date first.',
    },
    {
      title: 'Mortgage clearance',
      value: 'If applicable',
      body: 'Your bank may charge an early-settlement fee, typically up to 1% of the outstanding balance (capped at AED 10,000), plus a liability-letter fee.',
    },
    {
      title: 'What the buyer pays',
      value: '4% DLD',
      body: 'The 4% DLD transfer fee, title deed and trustee office fees are typically paid by the buyer, by market practice.',
    },
  ]

  return (
    <>
      <PageHero
        image={IMG.balcony}
        title="Sell your Dubai property"
        sub="Data-backed pricing, professional marketing and one licensed adviser from valuation to transfer day."
        crumbs={[{ label: 'Sell' }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/sell/valuation" variant="white" size="lg">
            Get a free valuation <ArrowRight className="size-4 rtl:rotate-180" />
          </ButtonLink>
          <ButtonAnchor
            href={whatsappLink(WHATSAPP_NUMBER, 'Hi Apex Aora, I am thinking of selling my property.')}
            target="_blank"
            rel="noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <WhatsAppIcon /> Talk to a sales adviser
          </ButtonAnchor>
        </div>
      </PageHero>

      {/* Numbers */}
      <section aria-label="Apex Aora in numbers" className="border-b border-line/70 bg-white">
        <Container className="py-10 md:py-12">
          <Reveal>
            <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse">
              {STATS.map((s, i) => (
                <div key={s.label} className={`pe-4 lg:px-8 ${i === 0 ? 'lg:ps-0' : ''}`}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-[48px] leading-none font-semibold text-plum md:text-[56px]">{s.value}</dd>
                  <dd className="mt-2 max-w-[240px] text-[14px] leading-snug text-ink/80">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Why sell with us */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Why sell with Apex Aora" sub="You get an honest price, serious buyers and a team that handles the paperwork so you don’t have to." />
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <li key={b.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lift">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo">
                      <b.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 text-[17px] font-semibold text-plum">{b.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{b.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-[132px] lg:self-start">
              <SectionHead
                title="How selling works"
                sub="Seven clear steps from first valuation to the new title deed. Most sales complete within two to three months of listing."
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                <img decoding="async" src={IMG.living} srcSet={srcSetOf(IMG.living)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Bright living room staged for sale" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <ButtonLink to="/sell/valuation" variant="primary" size="lg" className="mt-6">
                Start with a free valuation
              </ButtonLink>
            </Reveal>
            <ProcessTimeline steps={PROCESS} />
          </div>
        </Container>
      </section>

      {/* Costs */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="What sellers pay" sub="No hidden extras. These are the typical costs on a Dubai resale — we confirm exact figures for your property up front." />
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COSTS.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft">
                    <p className="text-[13px] font-semibold text-muted">{c.title}</p>
                    <p className="mt-1 text-[24px] font-bold tracking-tight text-plum">{c.value}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">{c.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12px] text-muted">
            Indicative only. Fees vary by developer, bank and agreement; your Form A sets out the agreed agency fee. Not tax or legal advice.
          </p>
        </Container>
      </section>

      {/* Marketing */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                <img decoding="async" src={IMG.pool} srcSet={srcSetOf(IMG.pool)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Pool deck photographed for a listing" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <SectionHead title="Marketing that reaches real buyers" />
              </Reveal>
              <ul className="divide-y divide-line/80 border-y border-line/80">
                {[
                  { icon: Camera, title: 'Professional photography & video', body: 'Twilight photos, floor plans and a short walkthrough video, included at no extra cost.' },
                  { icon: Globe2, title: 'Every major portal', body: 'Premium placement on Property Finder, Bayut and Dubizzle, plus our own website and social channels.' },
                  { icon: Users, title: 'Our buyer database', body: 'Direct introductions to pre-qualified buyers, investors and relocating families already on our books.' },
                  { icon: BadgeCheck, title: 'Verified listing', body: 'A Trakheesi permit and verified badge, so buyers know your listing is genuine and current.' },
                ].map((m, i) => (
                  <li key={m.title}>
                    <Reveal delay={i * 0.04}>
                      <div className="flex items-start gap-5 py-5">
                        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-indigo">
                          <m.icon className="size-5" strokeWidth={1.6} />
                        </span>
                        <span>
                          <span className="block text-[17px] font-semibold text-plum">{m.title}</span>
                          <span className="mt-1 block text-[15px] leading-relaxed text-muted">{m.body}</span>
                        </span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="What our clients say" sub="4.9 out of 5 from 312 Google reviews." />
          </Reveal>
          <TestimonialGrid />
        </Container>
      </section>

      {/* FAQ */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionHead title="Seller questions" sub="Still unsure about something? Ask your adviser — there is no obligation." />
            </Reveal>
            <Accordion items={FAQ} defaultOpen={0} />
          </div>
        </Container>
      </section>

      {/* CTA + quick form */}
      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">Find out what your home is worth</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">
                Leave your details for a quick call back, or use the full valuation form for an instant indicative range.
              </p>
              <ButtonLink to="/sell/valuation" variant="white" size="lg" className="mt-6">
                Full valuation form <ArrowRight className="size-4 rtl:rotate-180" />
              </ButtonLink>
            </div>
            <div className="rounded-[16px] border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <LeadForm
                type="valuation"
                tone="solid"
                columns={2}
                withEmail={false}
                extraFields={[
                  { name: 'address', label: 'Property address', kind: 'text', placeholder: 'Building, community', required: true, full: true },
                  { name: 'propertyType', label: 'Property type', kind: 'select', options: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'], full: true },
                ]}
                submitLabel="Request a call back"
                successText="Thanks — a sales adviser will call or WhatsApp you within one working day."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
