import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, Eye, HeartHandshake, Landmark, Scale, ShieldCheck, Sparkles } from 'lucide-react'

import { IMG, srcSetOf } from '@/assets/images'
import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AgentCard } from '@/features/agents/components/AgentCard'
import { OfficeCard } from '@/features/leads/components/OfficeLocation'
import { formatNumber } from '@/lib/format'
import { AGENT_PROFILES } from '@/mocks/agents'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => seo({ title: "About us", description: "Apex Aora is a Dubai brokerage for buying, renting and investing — licensed advisers, clear data and no surprises at transfer." }), component: Page })

const DEALS = AGENT_PROFILES.reduce((n, a) => n + a.dealsClosed, 0)
const YEARS = AGENT_PROFILES.reduce((n, a) => n + a.yearsExperience, 0)
const LANGUAGES = new Set(AGENT_PROFILES.flatMap((a) => a.languages)).size

const NUMBERS = [
  { value: `${formatNumber(DEALS)}+`, label: 'sales and lettings closed by our advisers' },
  { value: `${YEARS}`, label: 'combined years of Dubai market experience' },
  { value: `${LANGUAGES}`, label: 'languages spoken across the team' },
  { value: '4.9', label: 'average Google rating from 312 reviews' },
]

const VALUES = [
  { icon: Eye, title: 'Clarity', body: 'Every fee explained before you commit, every number sourced. We would rather lose a deal than surprise a client at transfer.' },
  { icon: Scale, title: 'Integrity', body: 'Verified listings with live Trakheesi permits, honest valuations and advice that puts your interests ahead of a quick commission.' },
  { icon: HeartHandshake, title: 'Care', body: 'One adviser who knows your brief, answers WhatsApp after hours and stays in touch long after the keys are handed over.' },
  { icon: Sparkles, title: 'Craft', body: 'Data-led pricing, considered marketing and paperwork done properly — the small details that make a big move feel easy.' },
]

const WHY = [
  { title: 'Data, not hype', body: 'Pricing and yield advice built on DLD transaction data and our own quarterly market research.' },
  { title: 'Specialists by community', body: 'Each adviser focuses on a handful of communities, so they know the buildings, the developers and the service charges.' },
  { title: 'End-to-end service', body: 'Search, negotiation, mortgage introductions, NOC, transfer and property management under one roof.' },
  { title: 'Built for international clients', body: 'Remote viewings, power-of-attorney sales and Golden Visa guidance for buyers who are not yet in Dubai.' },
]

function Page() {
  return (
    <>
      <PageHero
        image={IMG.marina}
        title="About Apex Aora"
        sub="A Dubai brokerage built on clear data, licensed advisers and no surprises at transfer."
        crumbs={[{ label: 'About us' }]}
      />

      {/* Story */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="text-[13px] font-semibold text-aura">Our story</p>
              <h2 className="mt-2 font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">
                We started Apex Aora to make buying in Dubai feel straightforward.
              </h2>
              <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-muted">
                <p>
                  Our founders spent years watching clients arrive at the trustee office surprised by fees nobody had mentioned, or holding listings that had
                  been sold weeks earlier. Apex Aora was set up in Dubai Marina to do the opposite: show the real numbers, verify every listing and keep one
                  adviser with the client from first viewing to final transfer.
                </p>
                <p>
                  Today our team of RERA-certified advisers covers sales, leasing, off-plan and property management across Dubai’s leading freehold
                  communities — from Marina apartments to Palm Jumeirah villas — for owner-occupiers, investors and families relocating from abroad.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                <img decoding="async" src={IMG.living} srcSet={srcSetOf(IMG.living)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Apex Aora client lounge" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Numbers */}
      <section aria-label="Apex Aora in numbers" className="border-y border-line/70 bg-white">
        <Container className="py-10 md:py-12">
          <Reveal>
            <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse">
              {NUMBERS.map((s, i) => (
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

      {/* Mission & values */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Our mission and values"
              sub="To give every client the clarity and confidence to make the right property decision in Dubai — whether it is their first home or their tenth investment."
            />
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <div className="h-full rounded-[16px] bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lift">
                    <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo">
                      <v.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-[26px] leading-tight font-semibold text-plum">{v.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{v.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Why clients choose us */}
      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal className="flex flex-col">
              <SectionHead title="Why clients choose us" sub="The things our clients mention most often in their reviews." />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] lg:mt-auto">
                <img decoding="async" src={IMG.couple} srcSet={srcSetOf(IMG.couple)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Clients receiving keys to their new home" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Reveal>
            <ol className="divide-y divide-line/80 border-y border-line/80">
              {WHY.map((w, i) => (
                <li key={w.title}>
                  <Reveal delay={i * 0.04}>
                    <div className="flex items-start gap-5 py-6 md:py-7">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist font-display text-[22px] font-semibold text-indigo">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-display text-[26px] leading-tight font-semibold text-plum">{w.title}</span>
                        <span className="mt-1 block text-[15px] leading-relaxed text-muted">{w.body}</span>
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Meet the team"
              sub="RERA-certified advisers, each focused on the communities they know best."
              action={
                <ButtonLink to="/agents" variant="outline">
                  All agents <ArrowRight className="size-4 rtl:rotate-180" />
                </ButtonLink>
              }
            />
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AGENT_PROFILES.map((a, i) => (
              <li key={a.id}>
                <Reveal delay={i * 0.04} className="h-full">
                  <AgentCard agent={a} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Licences & compliance */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-6 rounded-[24px] border border-line bg-white p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <span className="w-fit rounded-md bg-mist px-2.5 py-1 text-[12px] font-bold tracking-wide text-plum">RERA</span>
              <h2 className="mt-4 font-display text-[32px] leading-[1.05] font-semibold text-plum md:text-[40px]">Licences & compliance</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Apex Aora Real Estate LLC is licensed by the Dubai Land Department and regulated by the Real Estate Regulatory Agency (RERA).
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Landmark, label: 'RERA Office Registration No. (ORN)', value: '[placeholder]' },
                { icon: BadgeCheck, label: 'Dubai trade licence', value: '[Trade Licence No.]' },
                { icon: ShieldCheck, label: 'Advertising', value: 'Trakheesi permit on every listing' },
                { icon: BadgeCheck, label: 'Agents', value: 'RERA BRN shown on every profile' },
              ].map((r) => (
                <div key={r.label} className="flex gap-3 rounded-[16px] bg-mist p-4">
                  <r.icon className="mt-0.5 size-5 shrink-0 text-aura" strokeWidth={1.8} />
                  <div>
                    <dt className="text-[12.5px] text-muted">{r.label}</dt>
                    <dd className="mt-0.5 text-[15px] font-semibold text-plum">{r.value}</dd>
                  </div>
                </div>
              ))}
              <p className="text-[13px] leading-relaxed text-muted sm:col-span-2">
                Agent BRNs and listing permits can be verified on the Dubai Land Department website or the Dubai REST app. Client deposits are handled in
                line with RERA rules, and off-plan payments always go to the project’s DLD-registered escrow account.
              </p>
            </dl>
          </div>
        </Container>
      </section>

      {/* Office */}
      <section className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <SectionHead title="Visit our office" sub="Drop in for a coffee and a market briefing — or book a time so your adviser is free." />
          </Reveal>
          <OfficeCard />
        </Container>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">Let’s talk about your next move</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/80">Buying, selling, renting or investing — tell us what you have in mind and the right adviser will be in touch.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/contact" variant="white" size="lg">
                Contact us <ArrowRight className="size-4 rtl:rotate-180" />
              </ButtonLink>
              <ButtonLink to="/sell/valuation" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Free valuation
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
