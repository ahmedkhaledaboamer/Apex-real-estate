import { ArrowRight, Building2, KeyRound, LineChart, Tag, Wrench } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { IMG, srcSetOf } from '@/assets/images'
import { Reveal, SectionHead } from '@/components/ui/Reveal'

const SERVICES: { icon: typeof Building2; to: '/buy' | '/rent' | '/sell' | '/invest' | '/contact'; title: string; body: string }[] = [
  { icon: Building2, to: '/buy', title: 'Buy', body: "Ready homes and off-plan launches across Dubai's most sought-after communities." },
  { icon: KeyRound, to: '/rent', title: 'Rent', body: 'Verified listings, transparent fees and fast viewings.' },
  { icon: Tag, to: '/sell', title: 'Sell', body: 'Free valuation backed by recent transaction data.' },
  { icon: LineChart, to: '/invest', title: 'Invest', body: 'Yield-led advice, Golden Visa guidance and off-plan access.' },
  { icon: Wrench, to: '/contact', title: 'Property management', body: 'Tenants, maintenance and reporting, handled for owners.' },
]

export function Services() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col">
          <SectionHead
            title="One team for every move"
            sub="Whether you are buying your first apartment or handing over a portfolio, you deal with one licensed adviser from start to finish."
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] lg:mt-auto lg:aspect-auto lg:flex-1">
            <img decoding="async" src={IMG.living} srcSet={srcSetOf(IMG.living)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="Bright furnished living room in a Dubai apartment" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </Reveal>

        <ul className="divide-y divide-line/80 border-y border-line/80">
          {SERVICES.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.04}>
                <Link to={s.to} className="group flex items-start gap-5 py-6 md:py-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-indigo transition-colors duration-150 group-hover:bg-plum group-hover:text-white">
                    <s.icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[28px] leading-tight font-semibold text-plum">{s.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">{s.body}</span>
                  </span>
                  <ArrowRight className="mt-3 size-5 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
