import { useEffect, useState } from 'react'
import { motion } from '@/lib/motion'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { LISTINGS } from '@/mocks/properties'
import type { Currency, ListingKind } from '@/types'
import { PropertyCard, PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { Reveal, SectionHead } from '@/components/ui/Reveal'

const TABS: { key: ListingKind; label: string }[] = [
  { key: 'sale', label: 'For Sale' },
  { key: 'rent', label: 'For Rent' },
  { key: 'offplan', label: 'Off-Plan' },
]

export function FeaturedProperties({
  currency,
  state,
  initialTab,
  favorites,
  onToggleFavorite,
}: {
  currency: Currency
  state: 'default' | 'loading' | 'error'
  initialTab: ListingKind
  favorites: string[]
  onToggleFavorite: (id: string) => void
}) {
  const [tab, setTab] = useState<ListingKind>(initialTab)
  useEffect(() => setTab(initialTab), [initialTab])
  const items = LISTINGS.filter((l) => l.kind === tab)

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHead
          title="Featured properties"
          sub="Hand-picked by our agents this week. Every listing carries its Trakheesi permit and a verified agent."
          action={
            <div role="tablist" aria-label="Listing type" className="flex rounded-full bg-mist p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-150 ${
                    tab === t.key ? 'text-white' : 'text-plum hover:text-aura'
                  }`}
                >
                  {tab === t.key && (
                    <motion.span
                      layoutId="featured-tab"
                      className="absolute inset-0 rounded-full bg-plum"
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          }
        />
      </Reveal>

      {state === 'error' ? (
        <div role="alert" className="flex flex-col items-center rounded-[16px] border border-line bg-white px-6 py-16 text-center">
          <p className="font-display text-[28px] font-semibold text-plum">We couldn't load listings just now</p>
          <p className="mt-2 max-w-md text-[15px] text-muted">The connection to our listings feed dropped. Your filters are saved.</p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-[14px] font-semibold text-white transition-[filter] duration-150 hover:brightness-125">
            <RefreshCw className="size-4" /> Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state === 'loading'
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : items.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                >
                  <PropertyCard
                    listing={l}
                    currency={currency}
                    favorite={favorites.includes(l.id)}
                    onToggleFavorite={() => onToggleFavorite(l.id)}
                  />
                </motion.div>
              ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          to={tab === 'sale' ? '/buy' : tab === 'rent' ? '/rent' : '/off-plan'}
          className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-6 py-3 text-[15px] font-semibold text-plum transition-colors duration-150 hover:bg-mist"
        >
          View all {tab === 'sale' ? 'properties for sale' : tab === 'rent' ? 'rentals' : 'off-plan homes'}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  )
}
