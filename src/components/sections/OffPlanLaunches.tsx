import { ArrowRight, CalendarClock } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { PROJECT_DETAILS as OFFPLAN_PROJECTS } from '@/mocks/projects'
import { formatPrice } from '@/lib/format'
import type { Currency } from '@/types'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { srcSetOf } from '@/assets/images'

const STATUS_DOT: Record<string, string> = {
  Launching: 'bg-cyan',
  Selling: 'bg-success',
  'Last units': 'bg-aura',
}

export function OffPlanLaunches({ currency }: { currency: Currency }) {
  const [lead, ...rest] = OFFPLAN_PROJECTS
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHead
          title="New off-plan launches"
          sub="Developer, DLD project registration and escrow checked before we list. No guaranteed-return claims."
          action={
            <Link to="/off-plan" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
              Off-plan hub <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          }
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <ProjectCard project={lead} currency={currency} large />
        </Reveal>
        <div className="grid gap-6">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={0.05 * (i + 1)}>
              <ProjectCard project={p} currency={currency} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project: p,
  currency,
  large = false,
}: {
  project: (typeof OFFPLAN_PROJECTS)[number]
  currency: Currency
  large?: boolean
}) {
  return (
    <article
      className={`group relative isolate flex h-full overflow-hidden rounded-[16px] shadow-soft ${
        large ? 'min-h-[460px] lg:min-h-[620px]' : 'min-h-[300px]'
      }`}
    >
      <img decoding="async"
        src={p.image} srcSet={srcSetOf(p.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw"
        alt={`${p.name} render`}
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="flex h-9 items-center rounded-lg bg-white/95 px-3 text-[13px] font-bold tracking-wide text-plum">
          {p.developer.toUpperCase()}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-plum">
          <span className={`size-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
          {p.status}
        </span>
      </div>

      <div className="mt-auto w-full p-5 md:p-6">
        <p className="text-[13px] text-white/75">{p.community}</p>
        <h3 className={`font-display font-semibold text-white ${large ? 'text-[40px] leading-none' : 'text-[28px] leading-tight'}`}>
          {p.name}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-white/90">
          <span>
            From <strong className="font-semibold text-white">{formatPrice(p.fromAed, currency, { compact: true })}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-4" /> Handover {p.handover}
          </span>
          <span className="rounded-full border border-white/40 px-2.5 py-0.5 text-[12.5px] font-semibold">{p.plan} payment plan</span>
        </div>
        <Link to="/off-plan/$projectSlug" params={{ projectSlug: p.slug }} className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-plum transition-[transform,background-color] duration-150 hover:bg-mist active:scale-[0.97]">
          Register interest
        </Link>
      </div>
    </article>
  )
}
