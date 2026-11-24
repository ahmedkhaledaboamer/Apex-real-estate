import { createFileRoute } from '@tanstack/react-router'
import { Heart, Info, Scale } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container, EmptyState } from '@/components/ui/misc'
import { CompareTable } from '@/features/favorites/components/CompareTable'
import { propertyById } from '@/mocks/properties'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { MAX_COMPARE, clearCompare } from '@/store/slices/compareSlice'
import type { Property } from '@/types'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/compare')({
  head: () => seo({ title: "Compare properties", description: "Compare up to four Dubai properties side by side: price per sq ft, size, service charge and more." }), component: Page })

function Page() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)
  const favoritesCount = useAppSelector((s) => s.favorites.ids.length)
  const items = ids.map(propertyById).filter((p): p is Property => p !== undefined)
  const mixed = items.some((p) => p.kind === 'rent') && items.some((p) => p.kind !== 'rent')

  return (
    <>
      <PageHero
        title="Compare properties"
        sub={`Put up to ${MAX_COMPARE} homes side by side — price per sq ft, size, service charges and more. Best values in each row are highlighted.`}
        crumbs={[{ label: 'Compare' }]}
      />

      <Container className="py-12 md:py-16">
        {items.length === 0 ? (
          <EmptyState
            title="Nothing to compare yet"
            body={
              <>
                Open any property and choose “Add to compare”, or add homes from your saved list. You can compare up to {MAX_COMPARE} at a time — they’ll
                appear in the tray at the bottom of the screen.
              </>
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink to="/buy" variant="primary">
                  Browse homes for sale
                </ButtonLink>
                <ButtonLink to="/rent" variant="outline">
                  Browse rentals
                </ButtonLink>
                {favoritesCount > 0 && (
                  <ButtonLink to="/favorites" variant="ghost">
                    <Heart className="size-4" /> Saved properties ({favoritesCount})
                  </ButtonLink>
                )}
              </div>
            }
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[15px] text-muted">
                <Scale className="size-4 text-aura" />
                Comparing <span className="font-semibold text-plum">{items.length}</span> of {MAX_COMPARE}
                <span className="sm:hidden">· scroll sideways</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <ButtonLink to="/favorites" variant="outline" size="sm">
                  <Heart className="size-4" /> Saved properties
                </ButtonLink>
                <Button variant="ghost" size="sm" onClick={() => dispatch(clearCompare())}>
                  Clear comparison
                </Button>
              </div>
            </div>

            {mixed && (
              <p className="mb-4 flex items-start gap-2 rounded-xl bg-mist p-4 text-[13.5px] text-plum">
                <Info className="mt-0.5 size-4 shrink-0" />
                You are comparing rentals with homes for sale. Rental prices are annual rent, so price and price per sq ft are not like-for-like.
              </p>
            )}

            <CompareTable items={items} />

            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              <span className="font-semibold text-success">Green</span> marks the best value in each row (lowest price, price per sq ft and service charge;
              largest size, most bedrooms, bathrooms and parking). Service charges are indicative and set annually by each building’s owners’ association.
            </p>

            <div className="mt-12 flex flex-col items-start gap-4 rounded-[16px] bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="font-display text-[26px] leading-tight font-semibold text-plum">Need a second opinion?</p>
                <p className="mt-1 text-[14.5px] text-muted">An adviser can talk you through the trade-offs and arrange back-to-back viewings.</p>
              </div>
              <ButtonLink to="/contact" variant="primary">
                Talk to an adviser
              </ButtonLink>
            </div>
          </>
        )}
      </Container>
    </>
  )
}
