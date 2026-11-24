import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Phone } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { ButtonAnchor } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Container } from '@/components/ui/misc'
import { InstantEstimate, ValuationTrustPoints } from '@/features/leads/components/InstantEstimate'
import { EMPTY_VALUATION, ValuationForm, type ValuationValues } from '@/features/leads/components/ValuationForm'
import { CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_NUMBER, whatsappLink } from '@/lib/constants'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/sell/valuation')({
  head: () => seo({ title: "Free property valuation", description: "Get a free valuation of your Dubai property from a RERA-certified agent, backed by recent DLD transactions." }), component: Page })

function Page() {
  const [values, setValues] = useState<ValuationValues>(EMPTY_VALUATION)

  return (
    <>
      <PageHero
        title="Free property valuation"
        sub="Tell us about your home and a RERA-certified agent will send a valuation backed by recent DLD transactions — within one working day, with no obligation."
        crumbs={[{ label: 'Sell', to: '/sell' }, { label: 'Free valuation' }]}
      />

      <Container className="py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <ValuationForm values={values} onChange={setValues} />

          <aside className="space-y-5 lg:sticky lg:top-[132px] lg:self-start" aria-label="Estimate and help">
            <InstantEstimate community={values.community} size={values.size} />
            <ValuationTrustPoints />
            <div className="rounded-[16px] bg-mist p-6">
              <p className="text-[15px] font-semibold text-plum">Prefer to talk it through?</p>
              <p className="mt-1 text-[13.5px] text-muted">Our sales desk is open 7 days a week.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonAnchor href={CONTACT_PHONE_HREF} variant="outline" size="sm">
                  <Phone className="size-4" /> <span dir="ltr">{CONTACT_PHONE}</span>
                </ButtonAnchor>
                <ButtonAnchor
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hi Apex Aora, I would like a valuation for my property.')}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="sm"
                >
                  <WhatsAppIcon /> WhatsApp
                </ButtonAnchor>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
