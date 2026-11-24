import { BadgeCheck, ClipboardCheck, Landmark, ShieldCheck } from 'lucide-react'

import { Reveal, SectionHead } from '@/components/ui/Reveal'

const CHECKS = [
  {
    icon: Landmark,
    title: 'DLD & RERA registration',
    body: 'The developer and each project must be registered with the Dubai Land Department, with a valid project number before we advertise a single unit.',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow account',
    body: 'We confirm the project escrow account and bank, so buyer payments are held and released against construction progress.',
  },
  {
    icon: ClipboardCheck,
    title: 'Delivery track record',
    body: 'We look at completed projects, how close handovers came to the original dates and how snagging was handled.',
  },
  {
    icon: BadgeCheck,
    title: 'Clear, honest marketing',
    body: 'We don’t list projects sold on guaranteed-return promises, and we show the full payment plan and fees up front.',
  },
]

/** "How we vet developers" — four checks. */
export function VettingSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead title="How we vet developers" sub="Before we sell a project, it passes the same four checks. If it doesn’t, we don’t list it." />
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Reveal delay={0.04 * i} className="h-full rounded-[16px] border border-line/70 bg-paper p-6">
                <span className="grid size-11 place-items-center rounded-full bg-mist text-indigo">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold text-plum">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
