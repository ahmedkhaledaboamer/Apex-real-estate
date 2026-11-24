import { Reveal } from '@/components/ui/Reveal'

export type ProcessStep = { title: string; body: string; meta?: string }

/** Vertical numbered timeline with a gradient rail. */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0 md:gap-8">
          {i < steps.length - 1 && <span aria-hidden="true" className="absolute start-[21px] top-12 bottom-1 w-px bg-line md:start-[23px]" />}
          <span className="bg-aura-gradient relative grid size-11 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white shadow-soft md:size-12">
            {i + 1}
          </span>
          <Reveal delay={i * 0.03} className="min-w-0 flex-1 pt-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[24px] leading-tight font-semibold text-plum md:text-[28px]">{s.title}</h3>
              {s.meta && <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold text-plum">{s.meta}</span>}
            </div>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{s.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
