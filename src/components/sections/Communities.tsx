import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { COMMUNITIES } from '@/mocks/communities'
import { formatNumber } from '@/lib/format'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { srcSetOf } from '@/assets/images'

/** Asymmetric mosaic: the two most-searched areas get the big tiles. */
const SPAN = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2',
  '',
  '',
  'md:col-span-2',
  '',
  '',
  'sm:col-span-2 md:col-span-4',
]

export function Communities() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead
            title="Explore communities"
            sub="Asking price per sq ft and gross yield by area, from Bayut and Engel & Völkers Q3 2026 data."
            action={
              <Link to="/communities" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                All communities <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </Link>
            }
          />
        </Reveal>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[200px] lg:auto-rows-[230px]">
          {COMMUNITIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/communities/$communitySlug"
              params={{ communitySlug: c.slug }}
              className={`group relative isolate overflow-hidden rounded-[16px] ${SPAN[i]}`}
            >
              <img decoding="async"
                src={c.image} srcSet={srcSetOf(c.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw"
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <span className="absolute top-3 start-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-plum">
                {c.tag}
              </span>
              <div className="flex h-full flex-col justify-end p-5">
                <h3 className={`font-display font-semibold text-white ${i === 0 ? 'text-[38px] leading-none' : 'text-[26px] leading-tight'}`}>
                  {c.name}
                </h3>
                <p className="mt-1.5 flex flex-wrap gap-x-3 text-[13.5px] text-white/85">
                  {c.ppsf ? (
                    <span>
                      {c.approx ? '~' : ''}AED {formatNumber(c.ppsf)} / sq ft
                    </span>
                  ) : (
                    <span>Prime market</span>
                  )}
                  {c.yieldPct && <span>{c.yieldPct.toFixed(2)}% gross yield</span>}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-muted">~ Earlier mid-2025 snapshot (Gulf News). Yields are gross and vary by unit size.</p>
      </div>
    </section>
  )
}
