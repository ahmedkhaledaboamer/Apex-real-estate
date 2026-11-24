import { useMemo } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { BadgeCheck, ExternalLink, Languages, Mail, MapPin, Phone, Star } from 'lucide-react'

import { ButtonAnchor } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Badge, Breadcrumbs, Container, Stat } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { AgentListings } from '@/features/agents/components/AgentListings'
import { LeadForm } from '@/features/leads/LeadForm'
import { whatsappLink } from '@/lib/constants'
import { agentBySlug } from '@/mocks/agents'
import { PROPERTIES } from '@/mocks/properties'
import { TESTIMONIALS } from '@/mocks/testimonials'
import { srcSetOf } from '@/assets/images'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/agents/$agentSlug')({
  loader: ({ params }) => {
    const agent = agentBySlug(params.agentSlug)
    if (!agent) throw notFound()
    return agent
  },
  head: ({ loaderData: a }) => (a ? seo({ title: `${a.name}, ${a.role}`, description: a.bio, image: a.photo }) : {}),
  component: Page,
})

function Page() {
  const a = Route.useLoaderData()
  const first = a.name.split(' ')[0]
  const listings = useMemo(() => PROPERTIES.filter((p) => p.agentId === a.id), [a.id])
  const reviews = useMemo(() => TESTIMONIALS.filter((t) => t.quote.includes(first)), [first])

  return (
    <>
      {/* Profile header */}
      <section className="bg-white">
        <Container className="pt-8 pb-14 md:pt-10 md:pb-20">
          <Breadcrumbs items={[{ label: 'Agents', to: '/agents' }, { label: a.name }]} className="mb-8" />
          <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12 lg:grid-cols-[400px_1fr]">
            <div className="relative aspect-[4/5] max-w-[400px] overflow-hidden rounded-[24px] bg-mist">
              <img decoding="async" loading="lazy" src={a.photo} srcSet={srcSetOf(a.photo)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt={a.name} className="h-full w-full object-cover" />
              <span className="absolute bottom-4 start-4 rounded-full bg-white/95 px-3 py-1.5 text-[12.5px] font-semibold text-plum">BRN {a.brn}</span>
            </div>

            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-aura">{a.role}</p>
              <h1 className="mt-1 font-display text-[42px] leading-[1] font-semibold text-plum md:text-[60px]">{a.name}</h1>

              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-ink/80">
                <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                  <BadgeCheck className="size-4" aria-hidden="true" /> RERA-licensed · BRN {a.brn}
                </span>
                <a
                  href="https://dubailand.gov.ae"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-aura hover:text-plum"
                >
                  Verify on DLD <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>

              <dl className="mt-6 grid max-w-md grid-cols-2 gap-4 rounded-[16px] bg-paper p-5">
                <Stat label="Years of experience" value={a.yearsExperience} />
                <Stat label="Deals closed" value={`${a.dealsClosed}+`} />
              </dl>

              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink/85">{a.bio}</p>

              <dl className="mt-6 grid gap-4 text-[14px] sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                    <Languages className="size-3.5" aria-hidden="true" /> Languages
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{a.languages.join(', ')}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                    <MapPin className="size-3.5" aria-hidden="true" /> Communities
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{a.communities.join(', ')}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[12px] text-muted">Specialities</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {a.specialities.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonAnchor href={`tel:${a.phone.replace(/\s/g, '')}`} variant="plum">
                  <Phone className="size-4" aria-hidden="true" /> Call {first}
                </ButtonAnchor>
                <ButtonAnchor href={whatsappLink(a.whatsapp, `Hi ${first}, I found your profile on the Apex Aura website.`)} target="_blank" rel="noreferrer" variant="whatsapp">
                  <WhatsAppIcon /> WhatsApp
                </ButtonAnchor>
                <ButtonAnchor href={`mailto:${a.email}`} variant="outline">
                  <Mail className="size-4" aria-hidden="true" /> Email {first}
                </ButtonAnchor>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div className="min-w-0 space-y-16">
            <div>
              <Reveal>
                <SectionHead title={`${first}’s listings`} sub="Every listing carries a valid DLD Trakheesi permit." />
              </Reveal>
              <AgentListings properties={listings} firstName={first} />
            </div>

            {reviews.length > 0 && (
              <div>
                <Reveal>
                  <SectionHead title="What clients say" />
                </Reveal>
                <ul className="grid gap-4">
                  {reviews.map((t) => (
                    <li key={t.name}>
                      <figure className="rounded-[16px] bg-white p-6 shadow-soft md:p-8">
                        <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`} role="img">
                          {Array.from({ length: t.rating }).map((_, s) => (
                            <Star key={s} className="size-4 fill-aura text-aura" aria-hidden="true" />
                          ))}
                        </div>
                        <blockquote className="mt-4 font-display text-[24px] leading-[1.3] font-medium text-plum md:text-[28px]">“{t.quote}”</blockquote>
                        <figcaption className="mt-5 flex items-center gap-3">
                          <img decoding="async" loading="lazy" src={t.avatar} srcSet={srcSetOf(t.avatar)} sizes="44px" alt="" className="size-11 rounded-full object-cover" />
                          <span>
                            <span className="block text-[15px] font-semibold text-ink">{t.name}</span>
                            <span className="block text-[13px] text-muted">{t.context}</span>
                          </span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] bg-white p-6 shadow-soft md:p-8">
              <h2 className="font-display text-[28px] leading-tight font-semibold text-plum">Request a callback from {first}</h2>
              <p className="mt-2 mb-5 text-[14.5px] text-muted">Leave your number and {first} will call you back, usually the same day.</p>
              <LeadForm
                type="callback"
                context={{ agentId: a.id }}
                withMessage
                extraFields={[{ name: 'time', label: 'Best time to call', kind: 'select', options: ['Any time', 'Morning', 'Afternoon', 'Evening'] }]}
                submitLabel="Request a callback"
                successText={`Thanks — ${first} will call you back shortly.`}
              />
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
