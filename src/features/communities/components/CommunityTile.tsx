import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/cn'
import type { Community } from '@/types'
import { ppsfLabel } from './helpers'
import { srcSetOf } from '@/assets/images'

/** Photo tile in the same recipe as the home "Explore communities" mosaic. */
export function CommunityTile({ community: c, className, size = 'md' }: { community: Community; className?: string; size?: 'md' | 'lg' }) {
  return (
    <Link
      to="/communities/$communitySlug"
      params={{ communitySlug: c.slug }}
      className={cn('group relative isolate block overflow-hidden rounded-[16px]', size === 'lg' ? 'h-[280px]' : 'h-[230px]', className)}
    >
      <img decoding="async"
        src={c.image} srcSet={srcSetOf(c.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw"
        alt={c.name}
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <span className="absolute top-3 start-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-plum">{c.tag}</span>
      <div className="flex h-full flex-col justify-end p-5">
        <h3 className="font-display text-[28px] leading-tight font-semibold text-white">{c.name}</h3>
        <p className="mt-1.5 flex flex-wrap gap-x-3 text-[13.5px] text-white/85">
          <span>{ppsfLabel(c)}</span>
          {c.yieldPct && <span>{c.yieldPct.toFixed(2)}% gross yield</span>}
        </p>
      </div>
    </Link>
  )
}
