import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { ContactOptions } from '@/features/leads/components/ContactOptions'
import { OFFICE_HOURS, OfficeCard } from '@/features/leads/components/OfficeLocation'
import { LeadForm } from '@/features/leads/LeadForm'
import { AGENT_PROFILES } from '@/mocks/agents'
import { srcSetOf } from '@/assets/images'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => seo({ title: "Contact us", description: "Call, WhatsApp, email or visit our Dubai Marina office. An adviser replies within one working day." }), component: Page })

const INTERESTS = ['Buying', 'Renting', 'Selling', 'Investing', 'Property management', 'Careers', 'Complaint', 'Other']

const FAQ = [
  {
    q: 'How quickly will someone get back to me?',
    a: 'Within one working day for forms and email — usually much sooner. WhatsApp messages during office hours are typically answered within 15 minutes.',
  },
  {
    q: 'Can I book a viewing outside office hours?',
    a: 'Yes. Our advisers run viewings seven days a week until 21:00 by appointment, and can arrange live video viewings if you are overseas.',
  },
  {
    q: 'How do I make a complaint?',
    a: (
      <>
        Choose “Complaint” in the form above and tell us what happened. A manager will acknowledge it within two working days. See our{' '}
        <Link to="/legal/terms" className="font-semibold text-aura hover:underline">
          terms of use
        </Link>{' '}
        for the full process.
      </>
    ),
  },
  {
    q: 'Are you hiring?',
    a: 'We are always glad to hear from RERA-certified agents and experienced leasing and property-management staff. Choose “Careers” in the form and include a short note about your experience.',
  },
]

function Page() {
  return (
    <>
      <PageHero
        title="Contact us"
        sub="Call, WhatsApp, email or visit us in Dubai Marina. A licensed adviser will reply within one working day."
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="py-12 md:py-16">
        <Container>
          <ContactOptions />
        </Container>
      </section>

      {/* Form + hours */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
            <div className="rounded-[16px] bg-white p-6 shadow-soft md:p-10">
              <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">Send us a message</h2>
              <p className="mt-3 mb-8 text-[15px] leading-relaxed text-muted">Tell us a little about what you need and we will connect you with the right adviser.</p>
              <LeadForm
                type="contact"
                columns={2}
                withMessage
                extraFields={[{ name: 'interest', label: 'I’m interested in', kind: 'select', options: INTERESTS, full: true }]}
                submitLabel="Send message"
              />
            </div>

            <aside className="space-y-6">
              <div className="rounded-[16px] bg-white p-6 shadow-soft md:p-8">
                <h2 className="text-[17px] font-semibold text-plum">Office hours</h2>
                <table className="mt-4 w-full text-[14px]">
                  <caption className="sr-only">Office hours, Gulf Standard Time</caption>
                  <tbody className="divide-y divide-line/70 border-y border-line/70">
                    {OFFICE_HOURS.map((h) => (
                      <tr key={h.days}>
                        <th scope="row" className="py-3 pe-4 text-start font-medium text-ink">
                          {h.days}
                        </th>
                        <td className="py-3 text-end text-muted">{h.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-[12.5px] text-muted">All times Gulf Standard Time (GMT+4). Closed on UAE public holidays.</p>
              </div>

              <div className="rounded-[16px] bg-mist p-6 md:p-8">
                <h2 className="text-[17px] font-semibold text-plum">Prefer a specific adviser?</h2>
                <p className="mt-1 text-[14px] text-muted">Contact them directly from their profile.</p>
                <ul className="mt-5 space-y-2">
                  {AGENT_PROFILES.map((a) => (
                    <li key={a.id}>
                      <Link
                        to="/agents/$agentSlug"
                        params={{ agentSlug: a.slug }}
                        className="group flex items-center gap-3 rounded-xl bg-white p-2.5 pe-4 transition-shadow duration-150 hover:shadow-soft"
                      >
                        <img decoding="async" src={a.photo} srcSet={srcSetOf(a.photo)} sizes="44px" alt="" loading="lazy" className="size-11 shrink-0 rounded-full object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold text-ink group-hover:text-aura">{a.name}</span>
                          <span className="block truncate text-[12.5px] text-muted">
                            {a.role} · {a.languages.join(', ')}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted rtl:rotate-180" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/agents" variant="outline" size="sm" className="mt-5">
                  View all agents
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <SectionHead title="Find our office" sub="Office 1204, Marina Plaza — overlooking the marina, two minutes from the tram." />
          </Reveal>
          <OfficeCard />
        </Container>
      </section>

      {/* FAQ */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionHead title="Good to know" />
            </Reveal>
            <Accordion items={FAQ} />
          </div>
        </Container>
      </section>
    </>
  )
}
