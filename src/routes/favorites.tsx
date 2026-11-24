import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Info, Scale, Trash2 } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Container, EmptyState } from '@/components/ui/misc'
import { FavoriteItem } from '@/features/favorites/components/FavoriteItem'
import { ShareFavorites } from '@/features/favorites/components/ShareFavorites'
import { propertyById } from '@/mocks/properties'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import type { Property } from '@/types'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/favorites')({
  head: () => seo({ title: "Saved properties", description: "The Dubai homes you have saved, ready to compare or share." }), component: Page })

type Sort = 'recent' | 'price-asc' | 'price-desc'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'recent', label: 'Recently saved' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

function Page() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.favorites.ids)
  const compareCount = useAppSelector((s) => s.compare.ids.length)
  const [sort, setSort] = useState<Sort>('recent')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const items = useMemo(() => {
    const list = ids.map(propertyById).filter((p): p is Property => p !== undefined)
    if (sort === 'recent') return [...list].reverse()
    return [...list].sort((a, b) => (sort === 'price-asc' ? a.priceAed - b.priceAed : b.priceAed - a.priceAed))
  }, [ids, sort])

  return (
    <>
      <PageHero
        title="Saved properties"
        sub="Homes you have hearted while browsing. Compare them side by side, share the list or ask an adviser to arrange viewings."
        crumbs={[{ label: 'Saved properties' }]}
      />

      <Container className="py-12 md:py-16">
        {items.length === 0 ? (
          <EmptyState
            title="No saved properties yet"
            body="Tap the heart on any listing to save it here. Your shortlist stays in this browser while you search."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink to="/buy" variant="primary">
                  Browse homes for sale
                </ButtonLink>
                <ButtonLink to="/rent" variant="outline">
                  Browse rentals
                </ButtonLink>
              </div>
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-line/70 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[15px] text-muted" aria-live="polite">
                  <span className="font-semibold text-plum">{items.length}</span> saved {items.length === 1 ? 'property' : 'properties'}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                  <Info className="size-3.5 shrink-0" /> Favourites are stored in this browser session only.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ShareFavorites items={items} />
                {compareCount > 0 && (
                  <ButtonLink to="/compare" variant="plum" size="sm">
                    <Scale className="size-4" /> Compare ({compareCount})
                  </ButtonLink>
                )}
                <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="size-4" /> Clear all
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <Tabs label="Sort saved properties" tabs={SORTS} value={sort} onChange={setSort} />
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {items.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <FavoriteItem listing={p} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-12 flex flex-col items-start gap-4 rounded-[16px] bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="font-display text-[26px] leading-tight font-semibold text-plum">Ready to see them in person?</p>
                <p className="mt-1 text-[14.5px] text-muted">An adviser can line up viewings for your whole shortlist on the same day.</p>
              </div>
              <ButtonLink to="/contact" variant="primary">
                Arrange viewings
              </ButtonLink>
            </div>
          </>
        )}
      </Container>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Clear all saved properties?">
        <p className="text-[15px] leading-relaxed text-muted">
          This removes all {items.length} {items.length === 1 ? 'property' : 'properties'} from your saved list. You can’t undo this.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Keep them
          </Button>
          <Button
            variant="plum"
            onClick={() => {
              dispatch(clearFavorites())
              setConfirmOpen(false)
            }}
          >
            Clear all
          </Button>
        </div>
      </Modal>
    </>
  )
}
