import { createFileRoute } from '@tanstack/react-router'
import { MessageCircle, Phone } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { ToolCards } from '@/features/calculators/components/ToolCards'
import { CONTACT_PHONE_HREF, whatsappLink, WHATSAPP_NUMBER } from '@/lib/constants'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/tools/')({
  head: () => seo({ title: "Property tools & calculators", description: "Free Dubai property calculators: mortgage, ROI, DLD fees and rent vs buy." }), component: Page })

const TIPS = [
  { title: 'Start with the total cost', body: 'In Dubai, buying fees typically add 7–8% on top of the price for a resale home. Budget for them before you make an offer.' },
  { title: 'Use realistic rents', body: 'Check recent leases in the same building, not the asking rents on portals. Our community guides list indicative averages.' },
  { title: 'Stress-test the rate', body: 'Most UAE mortgages are fixed for 1–5 years, then float. Try a rate 1–2 points higher to see how your payment changes.' },
  { title: 'Treat results as a guide', body: 'Every calculator is indicative. Fees, lending rules and visa criteria change, so confirm the final numbers before you commit.' },
]

function Page() {
  return (
    <>
      <PageHero
        title="Property tools & calculators"
        sub="Work out repayments, buying fees, rental yield and whether to rent or buy, with figures based on current Dubai fee rules."
        crumbs={[{ label: 'Tools' }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="Choose a calculator" sub="Every tool recalculates as you type. Inputs are in AED; results follow the currency you pick in the header." />
          </Reveal>
          <ToolCards />
        </Container>
      </section>

      <section className="border-y border-line/70 bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHead
                title="How to use these numbers"
                sub="Calculators are a starting point for a conversation, not a final answer. Here is how our advisers suggest reading them."
              />
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/contact" size="lg">
                  <MessageCircle className="size-4" /> Talk to an adviser
                </ButtonLink>
                <ButtonAnchor href={CONTACT_PHONE_HREF} variant="outline" size="lg">
                  <Phone className="size-4" /> Call us
                </ButtonAnchor>
              </div>
              <p className="mt-4 text-[13.5px] text-muted">
                Prefer chat?{' '}
                <a
                  href={whatsappLink(WHATSAPP_NUMBER, 'Hello Apex Aora, I have a question about buying costs.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-aura hover:text-plum"
                >
                  Message us on WhatsApp
                </a>
              </p>
            </Reveal>
            <ol className="divide-y divide-line/80 border-y border-line/80">
              {TIPS.map((t, i) => (
                <li key={t.title}>
                  <Reveal delay={i * 0.04}>
                    <div className="flex gap-5 py-6">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist font-display text-[20px] font-semibold text-indigo">{i + 1}</span>
                      <div>
                        <h3 className="text-[16.5px] font-semibold text-plum">{t.title}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted">{t.body}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead
              title="Investing rather than buying to live?"
              sub="See which communities have the strongest gross yields and how to read them."
              action={
                <div className="flex flex-wrap gap-3">
                  <ButtonLink to="/invest/yield-guide" variant="outline">
                    Rental yield guide
                  </ButtonLink>
                  <ButtonLink to="/invest" variant="plum">
                    Invest in Dubai
                  </ButtonLink>
                </div>
              }
            />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
