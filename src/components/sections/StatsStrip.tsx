import { Reveal } from '@/components/ui/Reveal'

const STATS = [
  { value: '29%', label: 'of Dubai residential sales were ready homes in Q3 2026', source: 'betterhomes' },
  { value: '84%', label: 'of sales were priced under AED 3 million', source: 'Springfield Properties' },
  { value: '44%', label: 'of rental contracts were new leases', source: 'Savills' },
  { value: '4%', label: 'DLD transfer fee paid by the buyer on purchase', source: 'Dubai Land Department' },
]

export function StatsStrip() {
  return (
    <section aria-label="Dubai market at a glance" className="border-b border-line/70 bg-white">
      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 md:py-12">
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse">
            {STATS.map((s, i) => (
              <div key={s.value} className={`pe-4 lg:px-8 ${i === 0 ? 'lg:ps-0' : ''}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[48px] leading-none font-semibold text-plum md:text-[56px]">{s.value}</dd>
                <dd className="mt-2 max-w-[240px] text-[14px] leading-snug text-ink/80">{s.label}</dd>
                <dd className="mt-1.5 text-[12px] text-muted">{s.source}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[12px] text-muted">
            Q3 2026 market snapshot. Sources named per figure; methodologies differ between reports. Refreshed quarterly.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
