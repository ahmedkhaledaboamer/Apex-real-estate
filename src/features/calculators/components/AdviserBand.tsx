import { Phone } from 'lucide-react'

import { ButtonAnchor } from '@/components/ui/Button'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { Reveal } from '@/components/ui/Reveal'
import { LeadForm } from '@/features/leads/LeadForm'
import { CONTACT_PHONE, CONTACT_PHONE_HREF, whatsappLink, WHATSAPP_NUMBER } from '@/lib/constants'

/** Plum gradient CTA band with a callback form (same recipe as the home Valuation band). */
export function AdviserBand({
  title,
  sub,
  submitLabel = 'Request a callback',
  whatsappText = 'Hello Apex Aora, I would like investment advice.',
  topic,
}: {
  title: React.ReactNode
  sub: React.ReactNode
  submitLabel?: string
  whatsappText?: string
  /** Pre-selected options for the "Interested in" select. */
  topic?: string[]
}) {
  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <Reveal>
        <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
          <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">{title}</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">{sub}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonAnchor href={CONTACT_PHONE_HREF} variant="white">
                  <Phone className="size-4" /> {CONTACT_PHONE}
                </ButtonAnchor>
                <ButtonAnchor href={whatsappLink(WHATSAPP_NUMBER, whatsappText)} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                  WhatsApp us
                </ButtonAnchor>
              </div>
            </div>
            <div className="rounded-[16px] border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <LeadForm
                type="callback"
                tone="solid"
                columns={2}
                submitLabel={submitLabel}
                extraFields={topic ? [{ name: 'topic', label: 'Interested in', kind: 'select', options: topic, full: true }] : []}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
