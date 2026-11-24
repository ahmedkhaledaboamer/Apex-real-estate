import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { ConnectedPropertyCard } from '@/components/cards/ConnectedPropertyCard'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/misc'
import { PROPERTIES } from '@/mocks/properties'
import type { Property } from '@/types'

/** Up to 3 listings of the same kind, ranked by same community, then same type, then closest price. */
export function similarTo(p: Property, limit = 3): Property[] {
  return PROPERTIES.filter((x) => x.kind === p.kind && x.id !== p.id)
    .map((x) => ({
      x,
      score: (x.communitySlug === p.communitySlug ? 2 : 0) + (x.type === p.type ? 1 : 0),
      gap: Math.abs(Math.log(x.priceAed / p.priceAed)),
    }))
    .sort((a, b) => b.score - a.score || a.gap - b.gap)
    .slice(0, limit)
    .map((s) => s.x)
}

export function SimilarProperties({ property }: { property: Property }) {
  const items = similarTo(property)
  if (items.length === 0) return null
  const rent = property.kind === 'rent'
  return (
    <section className="border-t border-line/70">
      <Container className="py-16 md:py-24">
        <Reveal>
          <SectionHead
            title="Similar properties"
            sub={`More ${rent ? 'rentals' : property.kind === 'offplan' ? 'off-plan homes' : 'homes for sale'} like this one, picked by community, type and price.`}
            action={
              <Link to={rent ? '/rent' : '/buy'} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                View all {rent ? 'rentals' : 'properties for sale'} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.05}>
              <ConnectedPropertyCard listing={l} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
