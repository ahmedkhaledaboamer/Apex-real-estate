import { useState } from 'react'
import { motion } from '@/lib/motion'
import { MapPin, Search } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { IMG, srcSetOf } from '@/assets/images'
import { Select } from '@/components/ui/Select'
import type { Lang } from '@/types'

const TABS = ['Buy', 'Rent', 'Off-Plan'] as const
const CHIPS = ['Dubai Marina', 'Downtown', 'Business Bay', 'JVC', 'Palm Jumeirah']
const LOCATIONS = [
  'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'Jumeirah Village Circle (JVC)', 'Palm Jumeirah',
  'Dubai Hills Estate', 'Dubai Creek Harbour', 'DAMAC Lagoons', 'DAMAC Hills 2', 'Meydan City', 'Dubai South', 'Arjan', 'Al Furjan',
]

export function HeroSection({ lang, onSearch }: { lang: Lang; onSearch?: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Buy')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const suggestions = query.length > 0 ? LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : []
  const navigate = useNavigate()

  /** Turns the hero form into /buy, /rent or /off-plan search params. */
  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const type = String(data.get('type') ?? '')
    const beds = String(data.get('beds') ?? '')
    const price = String(data.get('price') ?? '')
    const location = query.match(/\((\w+)\)$/)?.[1] ?? query.trim()
    const [minPrice, maxPrice] = PRICE_RANGES[price] ?? []
    const search = {
      location: location || undefined,
      type: type && type !== 'Any type' ? type : undefined,
      beds: beds === 'Studio' ? 0 : beds && beds !== 'Any' ? parseInt(beds, 10) : undefined,
      minPrice,
      maxPrice,
    }
    navigate({ to: tab === 'Rent' ? '/rent' : tab === 'Off-Plan' ? '/off-plan' : '/buy', search })
  }

  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img decoding="async" src={IMG.hero} srcSet={srcSetOf(IMG.hero)} sizes="100vw" {...{ fetchpriority: 'high' }} alt="Dubai skyline with Burj Khalifa at golden hour" className="h-full w-full object-cover object-[50%_40%]" />
        {/* Brand overlay: plum → royal blue, kept translucent so the photo stays the hero */}
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgb(56_26_76/0.86)_0%,rgb(86_61_150/0.55)_45%,rgb(39_91_168/0.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/50 to-transparent" />
      </div>

      {/* Fills the first screen below the 108px header and centres the content vertically
          (equal space above and below); grows naturally when the content is taller than the screen. */}
      <div className="mx-auto flex min-h-[calc(100svh-108px)] max-w-[1280px] flex-col justify-center px-5 py-14 md:px-8 md:py-12">
        {/* CSS entrance (not JS) so the headline paints immediately, without waiting for the animation chunk. */}
        <div className="animate-rise max-w-3xl">
          {/* Eyebrow — same treatment as the "Strategic location" band, anchors the headline */}
          <p className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.28em] text-white/75 md:text-[13px]">
            <span aria-hidden="true" className="h-px w-8 bg-cyan" />
            {lang === 'ar' ? (
              'عقارات دبي · مستشارون مرخّصون'
            ) : (
              <span>
                DUBAI REAL ESTATE<span className="hidden sm:inline"> · RERA-LICENSED ADVISERS</span>
              </span>
            )}
          </p>
          {/* Two deliberate lines instead of an arbitrary wrap */}
          <h1 className="mt-5 font-display text-[52px] leading-[0.98] font-semibold text-balance text-white sm:text-[68px] lg:text-[84px]">
            {lang === 'ar' ? (
              'جد مكانك في دبي.'
            ) : (
              <>
                Find your place
                <br className="hidden sm:block" /> in Dubai.
              </>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-pretty text-white/85 md:text-[20px]">
            {lang === 'ar'
              ? 'اشترِ واستأجر واستثمر بثقة — إعلانات موثّقة ومستشارون مرخّصون وأرقام واضحة.'
              : 'Buy, rent and invest with confidence — verified listings, licensed advisers and clear numbers.'}
          </p>
        </div>

        {/* Glass search */}
        <div className="animate-rise mt-10 max-w-[1040px] [animation-delay:80ms] md:mt-12">
          <div role="tablist" aria-label="Search type" className="inline-flex rounded-t-2xl border border-b-0 border-white/25 bg-white/15 p-1 backdrop-blur-xl">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative rounded-xl px-5 py-2 text-[14px] font-semibold transition-colors duration-150 ${
                  tab === t ? 'text-plum' : 'text-white hover:text-white/80'
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="hero-tab"
                    className="absolute inset-0 rounded-xl bg-white"
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (onSearch) onSearch()
              else submit(e.currentTarget)
            }}
            className="grid gap-2 rounded-2xl rounded-ss-none border border-white/25 bg-white/15 p-2 shadow-glass backdrop-blur-xl md:grid-cols-[1.6fr_1fr_0.8fr_1fr_auto]"
          >
            <div className="relative">
              <label className="flex h-full flex-col justify-center rounded-xl bg-white px-4 py-2.5">
                <span className="text-[11.5px] font-semibold text-muted">Location</span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-aura" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 120)}
                    placeholder="Community or building"
                    className="w-full min-w-0 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted/70"
                  />
                </span>
              </label>
              {focused && suggestions.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-xl bg-white py-1 shadow-lift">
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onMouseDown={() => setQuery(s)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-start text-[14px] text-ink hover:bg-mist"
                      >
                        <MapPin className="size-3.5 text-muted" /> {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Field name="type" label="Property type" options={['Any type', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio']} />
            <Field name="beds" label="Beds" options={['Any', 'Studio', '1', '2', '3', '4', '5+']} />
            <Field
              name="price"
              label="Price"
              options={
                tab === 'Rent'
                  ? ['Any price', 'Up to AED 80K/yr', 'AED 80K–150K/yr', 'AED 150K+/yr']
                  : ['Any price', 'Up to AED 1.5M', 'AED 1.5M–3M', 'AED 3M–10M', 'AED 10M+']
              }
            />
            <button
              type="submit"
              className="bg-aura-gradient flex h-14 items-center justify-center gap-2 rounded-xl px-7 text-[15px] font-semibold text-white transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.97] md:h-auto"
            >
              <Search className="size-[18px]" /> Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="me-1 text-[13px] text-white/70">Popular:</span>
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md transition-colors duration-150 hover:bg-white/25"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PRICE_RANGES: Record<string, [number | undefined, number | undefined]> = {
  'Up to AED 80K/yr': [undefined, 80_000],
  'AED 80K–150K/yr': [80_000, 150_000],
  'AED 150K+/yr': [150_000, undefined],
  'Up to AED 1.5M': [undefined, 1_500_000],
  'AED 1.5M–3M': [1_500_000, 3_000_000],
  'AED 3M–10M': [3_000_000, 10_000_000],
  'AED 10M+': [10_000_000, undefined],
}

function Field({ name, label, options }: { name: string; label: string; options: string[] }) {
  const labelId = `hero-${name}-label`
  return (
    <div
      data-select-anchor
      onClick={(e) => {
        const btn = e.currentTarget.querySelector('button')
        if (btn && !btn.contains(e.target as Node)) btn.click()
      }}
      className="flex cursor-pointer flex-col justify-center rounded-xl bg-white px-4 py-2.5"
    >
      <span id={labelId} className="text-[11.5px] font-semibold text-muted">
        {label}
      </span>
      <Select name={name} options={options} aria-labelledby={labelId} className="text-[15px] font-medium text-ink" />
    </div>
  )
}
