import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { formatNumber } from '@/lib/format'
import { GOLDEN_VISA_THRESHOLD } from '@/lib/constants'

const STEPS = [
  {
    title: 'Reservation',
    body: 'Choose a unit, sign the reservation form and pay the booking amount, usually 10–20% of the price. We check the project’s DLD registration and escrow account before you pay anything.',
  },
  {
    title: 'Sales & Purchase Agreement',
    body: 'The developer issues the SPA with the payment schedule, specification and handover window. Read it carefully, or have a lawyer review it, before you sign.',
  },
  {
    title: 'Oqood registration',
    body: 'The developer registers your purchase on the DLD’s Oqood system for off-plan sales. The 4% DLD fee is normally paid at this stage, and you receive an Oqood certificate in your name.',
  },
  {
    title: 'Construction instalments',
    body: 'You pay the agreed milestones as construction progresses. Payments go into the project’s escrow account, and you can track progress through developer updates and the DLD.',
  },
  {
    title: 'Handover & snagging',
    body: 'Before the final payment, you (or a snagging company) inspect the unit and the developer fixes defects. You pay the balance, receive the keys and the title deed is issued.',
  },
]

const FAQ: AccordionItem[] = [
  {
    q: 'How is my money protected when buying off-plan?',
    a: 'Under Dubai law, developers must register each off-plan project with the Dubai Land Department and open an escrow account with an approved bank. Buyer payments go into that account and are released to the developer against verified construction progress. Always check the project number and escrow details before paying, and pay only into the escrow account named in your SPA.',
  },
  {
    q: 'How do off-plan payment plans work?',
    a: 'A plan such as 60/40 means roughly 60% is paid in instalments during construction and 40% on handover. Some developers offer post-handover plans that spread part of the balance over a few years after completion. Dates are usually linked to construction milestones, so the timing of each instalment can move if the build schedule changes.',
  },
  {
    q: 'Can I sell my unit before handover?',
    a: 'Often, yes, but each developer sets its own rules. Many require a minimum percentage (commonly 30–40%) to be paid before they issue a no-objection certificate for resale, and they may charge an admin fee. Resale prices depend on the market at the time, so there is no assurance of a profit.',
  },
  {
    q: 'Can I get a mortgage on an off-plan property?',
    a: 'Some UAE banks lend on off-plan units from approved developers, usually only once construction is well advanced or close to handover, and loan-to-value limits are lower than for ready homes. Most buyers fund the construction-period instalments themselves and finance the handover payment. Speak to a mortgage adviser early so your plan matches the payment schedule.',
  },
  {
    q: 'Does buying off-plan make me eligible for a Golden Visa?',
    a: `Property investors can apply for a 10-year Golden Visa with property worth at least AED ${formatNumber(GOLDEN_VISA_THRESHOLD)}. Off-plan purchases from approved developers can qualify, subject to the current rules of the Dubai Land Department and the immigration authorities, which may include minimum amounts already paid. Eligibility is decided by the authorities, so confirm the requirements before relying on it.`,
  },
  {
    q: 'Are rental yields or returns guaranteed?',
    a: 'No. We do not publish guaranteed returns. Future rents and resale values depend on market conditions at handover, and any figures shown are indicative only. Treat “guaranteed return” offers with caution and read the terms in full.',
  },
]

/** "How buying off-plan works" steps + FAQ. */
export function BuyingGuide() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead title="How buying off-plan works" sub="Five stages from reservation to keys. Your adviser stays with you at each one." />
        </Reveal>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={0.04 * i} className="flex h-full flex-col rounded-[16px] border border-line/70 bg-paper p-5">
                <span className="grid size-10 place-items-center rounded-full bg-aura-gradient text-[15px] font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 text-[17px] font-semibold text-plum">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">Off-plan questions, answered</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">
              General information only, not legal or financial advice. Rules change, so we confirm the current position for your purchase.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion items={FAQ} defaultOpen={0} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
