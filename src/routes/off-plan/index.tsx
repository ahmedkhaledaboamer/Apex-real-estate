import { createFileRoute } from '@tanstack/react-router'
import { Landmark, ShieldCheck, TriangleAlert } from 'lucide-react'

import { IMG, srcSetOf } from '@/assets/images'
import { PageHero } from '@/components/layout/PageHero'
import { useHydrationSafeSearch } from '@/lib/hydration'
import { ButtonAnchor } from '@/components/ui/Button'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { WhatsAppIcon } from '@/components/ui/icons'
import { useCurrency } from '@/features/favorites/hooks'
import { LeadForm } from '@/features/leads/LeadForm'
import { BuyingGuide } from '@/features/offplan/components/BuyingGuide'
import { OffPlanUnits } from '@/features/offplan/components/OffPlanUnits'
import { ProjectExplorer } from '@/features/offplan/components/ProjectExplorer'
import { validateSearchParams, type SearchParams } from '@/features/search/schemas'
import { whatsappLink } from '@/lib/constants'
import { formatPrice } from '@/lib/format'
import { agentProfileById } from '@/mocks/agents'
import { PROJECT_DETAILS } from '@/mocks/projects'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/off-plan/')({
  head: () => seo({ title: "Off-plan projects in Dubai", description: "New off-plan launches in Dubai — DLD-registered projects, escrow-protected payment plans and verified developers." }),
  validateSearch: validateSearchParams,
  component: Page,
})

const PROTECTIONS = [
  { icon: Landmark, title: 'DLD-registered projects', body: 'Each project has a Dubai Land Department project number you can verify.' },
  { icon: ShieldCheck, title: 'Escrow-protected payments', body: 'Instalments go into a dedicated escrow account, released against construction progress.' },
  { icon: TriangleAlert, title: 'No guaranteed returns', body: 'We never promise rental yields or resale profits. Figures shown are indicative.' },
]

function Page() {
  const search = useHydrationSafeSearch(Route.useSearch())
  const navigate = Route.useNavigate()
  const advisor = agentProfileById('daniel')
  const currency = useCurrency()
  const f = (aed: number) => formatPrice(aed, currency, { compact: true })
  const budgetOptions = [
    `Under ${f(1_500_000)}`,
    `${f(1_500_000)} – ${f(3_000_000)}`,
    `${f(3_000_000)} – ${f(5_000_000)}`,
    `${f(5_000_000)} – ${f(10_000_000)}`,
    `Above ${f(10_000_000)}`,
  ]

  const onSearchChange = (next: SearchParams) => {
    void navigate({ search: next, replace: true, resetScroll: false })
  }

  return (
    <>
      <PageHero
        image={IMG.offplanTower}
        title="Off-plan projects in Dubai"
        sub="New launches from Dubai’s leading developers, with the payment plan, handover date and regulatory details on every project. We check DLD registration and the escrow account before anything is listed."
        crumbs={[{ label: 'Off-plan' }]}
      >
        <ul className="grid max-w-4xl gap-3 sm:grid-cols-3">
          {PROTECTIONS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-[16px] border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <Icon className="size-5 text-white" aria-hidden="true" />
              <p className="mt-2 text-[14.5px] font-semibold text-white">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/75">{body}</p>
            </li>
          ))}
        </ul>
      </PageHero>

      <ProjectExplorer projects={PROJECT_DETAILS} />

      <OffPlanUnits search={search} onChange={onSearchChange} />

      <BuyingGuide />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">Get new launches before they go public</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">
                Tell us your budget and preferred areas. {advisor.name}, our off-plan advisor, will send launch details, floor plans and payment plans, with the escrow and DLD checks already done.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <img decoding="async" loading="lazy" src={advisor.photo} srcSet={srcSetOf(advisor.photo)} sizes="48px" alt="" className="size-12 rounded-full object-cover ring-2 ring-white/40" />
                <div>
                  <p className="text-[14.5px] font-semibold text-white">{advisor.name}</p>
                  <p className="text-[12.5px] text-white/70">
                    {advisor.role} · BRN {advisor.brn}
                  </p>
                </div>
                <ButtonAnchor
                  variant="whatsapp"
                  size="sm"
                  href={whatsappLink(advisor.whatsapp, `Hi ${advisor.name.split(' ')[0]}, I'd like to hear about new off-plan launches.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-auto sm:ms-2"
                >
                  <WhatsAppIcon /> WhatsApp
                </ButtonAnchor>
              </div>
            </div>
            <div className="rounded-[16px] border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <LeadForm
                type="register-interest"
                tone="solid"
                columns={2}
                context={{ agentId: advisor.id }}
                extraFields={[
                  { name: 'budget', label: 'Budget', kind: 'select', options: budgetOptions },
                  { name: 'area', label: 'Preferred area', kind: 'select', options: ['Any area', ...new Set(PROJECT_DETAILS.map((p) => p.community))] },
                ]}
                submitLabel="Register interest"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
