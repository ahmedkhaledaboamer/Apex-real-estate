import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, MapPin } from 'lucide-react'

import { LocationMap } from '@/components/media/LocationMap'
import { communityBySlug } from '@/mocks/communities'
import type { Property } from '@/types'

/** Single-pin map plus a short community summary. */
export function LocationSection({ property: p }: { property: Property }) {
  const community = communityBySlug(p.communitySlug)
  const markers = useMemo(() => [{ id: p.id, position: p.location }], [p.id, p.location])

  return (
    <div>
      <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
        <MapPin className="size-4 text-aura" aria-hidden="true" /> {p.building}, {p.community}, Dubai
      </p>
      <LocationMap markers={markers} className="mt-4 h-[300px] md:h-[360px]" />
      {community && (
        <div className="mt-6">
          <p className="text-[15px] leading-relaxed text-muted">{community.summary}</p>
          {community.commute?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {community.commute.map((c) => (
                <li key={c.to} className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[13px] font-medium text-plum">
                  <Clock className="size-3.5" aria-hidden="true" /> {c.minutes} min to {c.to}
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/communities/$communitySlug"
            params={{ communitySlug: community.slug }}
            className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum"
          >
            Explore the {community.name} guide <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      )}
    </div>
  )
}
