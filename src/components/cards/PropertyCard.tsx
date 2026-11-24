import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Link } from '@tanstack/react-router'
import { BadgeCheck, Bath, BedDouble, ChevronLeft, ChevronRight, Heart, Maximize2, Phone } from 'lucide-react'

import { agentProfileById } from '@/mocks/agents'
import { whatsappLink } from '@/lib/constants'
import type { Currency, Listing } from '@/types'
import { formatNumber, formatPrice } from '@/lib/format'
import { WhatsAppIcon } from '@/components/ui/icons'
import { srcSetOf } from '@/assets/images'

/** Listing card: photo carousel, price, key facts, compliance line, agent + contact. */
export function PropertyCard({
  listing,
  currency,
  favorite,
  onToggleFavorite,
}: {
  listing: Listing
  currency: Currency
  favorite: boolean
  onToggleFavorite: () => void
}) {
  const [i, setI] = useState(0)
  const agent = agentProfileById(listing.agentId)
  const detail = { to: listing.kind === 'rent' ? '/rent/$propertyId' : '/buy/$propertyId', params: { propertyId: listing.id } } as const
  const n = listing.images.length
  const go = (d: number) => setI((v) => (v + d + n) % n)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-soft transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img decoding="async"
            key={i}
            src={listing.images[i]} srcSet={srcSetOf(listing.images[i])} sizes="auto, (min-width: 1024px) 33vw, 100vw"
            alt={`${listing.title}, photo ${i + 1} of ${n}`}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </AnimatePresence>

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-success shadow-soft">
            <BadgeCheck className="size-3.5" /> Verified
          </span>
          <button
            onClick={onToggleFavorite}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remove from favourites' : 'Save to favourites'}
            className="grid size-9 place-items-center rounded-full bg-white/95 shadow-soft transition-transform duration-150 active:scale-90"
          >
            <Heart className={`size-[18px] transition-colors duration-150 ${favorite ? 'fill-aura text-aura' : 'text-ink'}`} />
          </button>
        </div>

        {listing.kind === 'offplan' && listing.paymentPlan && (
          <span className="absolute bottom-3 start-3 rounded-full bg-plum/85 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
            {listing.paymentPlan} plan · {listing.handover}
          </span>
        )}

        <button
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute start-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>

        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {listing.images.map((_, d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              aria-label={`Show photo ${d + 1}`}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${d === i ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <p className="text-[22px] font-bold tracking-tight text-plum">
          {formatPrice(listing.priceAed, currency)}
          {listing.kind === 'rent' && <span className="text-[14px] font-medium text-muted"> /year</span>}
        </p>
        <h3 className="mt-1 truncate text-[15px] font-semibold text-ink">
          <Link {...detail} className="after:absolute after:inset-0 hover:text-plum">
            {listing.title}
          </Link>
        </h3>
        <p className="text-[14px] text-muted">
          {listing.community} · {listing.type}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-ink/80">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-muted" /> {listing.beds === 0 ? 'Studio' : `${listing.beds} bed`}
          </li>
          <li className="flex items-center gap-1.5">
            <Bath className="size-4 text-muted" /> {listing.baths} bath
          </li>
          <li className="flex items-center gap-1.5">
            <Maximize2 className="size-4 text-muted" /> {formatNumber(listing.sqft)} sq ft
          </li>
        </ul>

        <p className="mt-3 text-[11.5px] text-muted">Permit # {listing.permit}</p>

        <div className="mt-auto pt-4">
        <div className="relative z-10 flex items-center gap-3 border-t border-line/70 pt-4">
          <img decoding="async" loading="lazy" src={agent.photo} srcSet={srcSetOf(agent.photo)} sizes="36px" alt="" className="size-9 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">{agent.name}</p>
            <p className="text-[11.5px] text-muted">BRN {agent.brn}</p>
          </div>
          <a
            href={`tel:${agent.phone.replace(/\s/g, '')}`}
            aria-label={`Call ${agent.name}`}
            className="grid size-9 place-items-center rounded-full border border-line text-plum transition-colors duration-150 hover:bg-mist"
          >
            <Phone className="size-4" />
          </a>
          <a
            href={whatsappLink(agent.whatsapp, `Hi ${agent.name.split(' ')[0]}, I'm interested in ${listing.title} (permit ${listing.permit}).`)}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp ${agent.name}`}
            className="grid size-9 place-items-center rounded-full bg-[#1f9d55] text-white transition-[filter] duration-150 hover:brightness-110"
          >
            <WhatsAppIcon />
          </a>
        </div>
        </div>
      </div>
    </article>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white shadow-soft" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-mist" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-2/5 animate-pulse rounded bg-mist" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-mist" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-mist" />
        <div className="h-9 animate-pulse rounded-full bg-mist" />
      </div>
    </div>
  )
}
