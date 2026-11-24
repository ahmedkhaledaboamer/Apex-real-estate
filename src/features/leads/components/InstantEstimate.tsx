import { BadgeCheck, Clock, Database, Sparkles } from 'lucide-react'

import { useCurrency } from '@/features/favorites/hooks'
import { formatNumber, formatPrice } from '@/lib/format'
import { COMMUNITY_DETAILS } from '@/mocks/communities'

import { OTHER_COMMUNITY } from './ValuationForm'

const SPREAD = 0.08

/** Indicative price range from the community's average price per sq ft (± 8%). */
export function InstantEstimate({ community, size }: { community: string; size: string }) {
  const currency = useCurrency()
  const c = COMMUNITY_DETAILS.find((x) => x.slug === community)
  const sqft = Number(size)
  const validSize = /^\d+$/.test(size) && sqft >= 150 && sqft <= 100_000
  const mid = c?.ppsf && validSize ? c.ppsf * sqft : null

  let prompt: string | null = null
  if (!community) prompt = 'Choose a community and enter the size to see an indicative range.'
  else if (community === OTHER_COMMUNITY) prompt = 'We don’t publish an average for this community yet — your agent will price it from recent DLD transactions.'
  else if (!c?.ppsf) prompt = `We don’t publish an average price per sq ft for ${c?.name ?? 'this community'} — villas and prime homes vary too much. Your agent will price it from comparable DLD sales.`
  else if (!validSize) prompt = `Enter the size in sq ft to estimate a range for ${c.name}.`

  return (
    <section aria-labelledby="estimate-h" className="rounded-[16px] bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-mist text-aura">
          <Sparkles className="size-4" />
        </span>
        <h2 id="estimate-h" className="text-[16px] font-semibold text-plum">
          Instant estimate
        </h2>
      </div>

      <div aria-live="polite" className="mt-5">
        {mid && c?.ppsf ? (
          <>
            <p className="text-[12.5px] text-muted">Indicative value</p>
            <p className="mt-1 font-display text-[32px] leading-tight font-semibold text-plum md:text-[36px]">
              {formatPrice(mid * (1 - SPREAD), currency, { compact: true })} – {formatPrice(mid * (1 + SPREAD), currency, { compact: true })}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-mist p-4">
              <div>
                <dt className="text-[12px] text-muted">Avg. price / sq ft</dt>
                <dd className="mt-0.5 text-[15px] font-bold text-plum">{formatPrice(c.ppsf, currency)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted">Your size</dt>
                <dd className="mt-0.5 text-[15px] font-bold text-plum">{formatNumber(sqft)} sq ft</dd>
              </div>
            </dl>
            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              Based on the {c.approx ? 'approximate ' : ''}community average for {c.name}, ±8%. Floor, view, layout and condition can move the real figure
              well outside this range. Not a formal valuation.
            </p>
          </>
        ) : (
          <p className="rounded-xl bg-mist p-4 text-[14px] leading-relaxed text-plum">{prompt}</p>
        )}
      </div>
    </section>
  )
}

const TRUST = [
  { icon: BadgeCheck, title: 'RERA-certified agent', body: 'Your valuation is prepared by a licensed adviser, not an algorithm.' },
  { icon: Database, title: 'DLD transaction data', body: 'Comparable sales and rents in your building over the last 12 months.' },
  { icon: Clock, title: 'Reply within one working day', body: 'By phone, WhatsApp or email — whichever you prefer.' },
]

export function ValuationTrustPoints() {
  return (
    <ul className="space-y-4 rounded-[16px] border border-line/70 p-6">
      {TRUST.map((t) => (
        <li key={t.title} className="flex gap-3">
          <t.icon className="mt-0.5 size-5 shrink-0 text-aura" strokeWidth={1.8} />
          <div>
            <p className="text-[14.5px] font-semibold text-plum">{t.title}</p>
            <p className="text-[13.5px] leading-relaxed text-muted">{t.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
