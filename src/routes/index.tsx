import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { HeroSection } from '@/components/sections/HeroSection'
import { Deferred } from '@/components/ui/Deferred'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleFavorite } from '@/store/slices/favoritesSlice'
import { SITE_TITLE, seo } from '@/lib/seo'

// Everything after the hero: separate chunks, hydrated progressively inside <Deferred> (Suspense),
// so the header and hero search become interactive first. Their HTML is visible from the start.
const StatsStrip = lazy(() => import('@/components/sections/StatsStrip').then((m) => ({ default: m.StatsStrip })))
const FeaturedProperties = lazy(() => import('@/components/sections/FeaturedProperties').then((m) => ({ default: m.FeaturedProperties })))
const Agents = lazy(() => import('@/components/sections/Agents').then((m) => ({ default: m.Agents })))
const Communities = lazy(() => import('@/components/sections/Communities').then((m) => ({ default: m.Communities })))
const Developers = lazy(() => import('@/components/sections/Developers').then((m) => ({ default: m.Developers })))
const FinalCta = lazy(() => import('@/components/sections/FinalCta').then((m) => ({ default: m.FinalCta })))
const Insights = lazy(() => import('@/components/sections/Insights').then((m) => ({ default: m.Insights })))
const OffPlanLaunches = lazy(() => import('@/components/sections/OffPlanLaunches').then((m) => ({ default: m.OffPlanLaunches })))
const PhotoBand = lazy(() => import('@/components/sections/PhotoBand').then((m) => ({ default: m.PhotoBand })))
const Services = lazy(() => import('@/components/sections/Services').then((m) => ({ default: m.Services })))
const StrategicLocation = lazy(() => import('@/components/sections/StrategicLocation').then((m) => ({ default: m.StrategicLocation })))
const Testimonials = lazy(() => import('@/components/sections/Testimonials').then((m) => ({ default: m.Testimonials })))
const Valuation = lazy(() => import('@/components/sections/Valuation').then((m) => ({ default: m.Valuation })))

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: SITE_TITLE,
      description: 'Buy, rent and invest in Dubai property with RERA-licensed advisers: verified listings, off-plan launches, community guides and clear data.',
    }),
  component: HomePage,
})

function HomePage() {
  const dispatch = useAppDispatch()
  const currency = useAppSelector((s) => s.preferences.currency)
  const language = useAppSelector((s) => s.preferences.language)
  const favorites = useAppSelector((s) => s.favorites.ids)

  return (
    <>
      <HeroSection lang={language} />
      <Deferred minHeight={900}>
        <StatsStrip />
        <FeaturedProperties
          currency={currency}
          state="default"
          initialTab="sale"
          favorites={favorites}
          onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
        />
      </Deferred>
      {/* Below the fold: prerendered in the HTML, hydrated progressively; deferred on client navigation. */}
      <Deferred minHeight={1400}>
        <Communities />
        <PhotoBand />
      </Deferred>
      <Deferred minHeight={1100}>
        <OffPlanLaunches currency={currency} />
        <Developers />
      </Deferred>
      <Deferred minHeight={1300}>
        <StrategicLocation />
        <Services />
      </Deferred>
      <Deferred minHeight={1300}>
        <Valuation />
        <Insights />
      </Deferred>
      <Deferred minHeight={1500}>
        <Agents />
        <Testimonials />
        <FinalCta />
      </Deferred>
    </>
  )
}
