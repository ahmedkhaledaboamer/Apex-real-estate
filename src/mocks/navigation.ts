import type { LinkProps } from '@tanstack/react-router'

import { IMG } from '@/assets/images'
import ar from '@/i18n/ar.json'
import en from '@/i18n/en.json'
import type { Lang } from '@/types'

export const NAV = [
  { key: 'buy' },
  { key: 'rent' },
  { key: 'offplan' },
  { key: 'communities' },
  { key: 'developers' },
  { key: 'sell' },
  { key: 'invest' },
  { key: 'insights' },
  { key: 'about' },
] as const

type Key = (typeof NAV)[number]['key'] | 'contact'

/** Nav labels per language (sourced from i18n/*.json). */
export const T: Record<Lang, Record<Key, string>> = { en: en.nav, ar: ar.nav }

/** Where each top-level nav item goes. */
export const NAV_TO = {
  buy: '/buy',
  rent: '/rent',
  offplan: '/off-plan',
  communities: '/communities',
  developers: '/developers',
  sell: '/sell',
  invest: '/invest',
  insights: '/insights',
  about: '/about',
} as const satisfies Record<(typeof NAV)[number]['key'], LinkProps['to']>

/** Image card shown on the right of a mega menu. */
export type MegaPreview = { image: string; title: string; sub: string }

export type NavLink = {
  label: string
  to: LinkProps['to']
  params?: Record<string, string>
  search?: Record<string, string | number>
  /** Card shown on the right of the mega menu while this link is hovered/focused. */
  preview?: MegaPreview
}

const pv = (image: string, title: string, sub: string): MegaPreview => ({ image, title, sub })

const community = (label: string, slug: string | undefined, preview: MegaPreview): NavLink =>
  slug
    ? { label, to: '/communities/$communitySlug', params: { communitySlug: slug }, preview }
    : { label, to: '/communities', preview }

type Mega = {
  columns: { title: string; links: NavLink[] }[]
  /** Default card (shown when no link is hovered). */
  feature: MegaPreview & { link: NavLink }
}

export const MEGA: Record<string, Mega> = {
  buy: {
    columns: [
      {
        title: 'Property type',
        links: [
          { label: 'Apartments', to: '/buy', search: { type: 'Apartment' }, preview: pv(IMG.balcony, 'Apartments', 'Skyline, marina and canal views') },
          { label: 'Villas & townhouses', to: '/buy', search: { type: 'Villa' }, preview: pv(IMG.villa, 'Villas & townhouses', 'Space, gardens and private pools') },
          { label: 'Penthouses', to: '/buy', search: { type: 'Penthouse' }, preview: pv(IMG.pool, 'Penthouses', 'Top-floor living with private terraces') },
          { label: 'Luxury homes', to: '/buy', search: { minPrice: 10_000_000 }, preview: pv(IMG.palm, 'Luxury homes', 'Signature homes from AED 10M') },
          { label: 'Ready homes', to: '/buy', search: { completion: 'ready' }, preview: pv(IMG.living, 'Ready to move in', 'Ready homes now make up 29% of sales') },
        ],
      },
      {
        title: 'Popular searches',
        links: [
          { label: '2-bed in Dubai Marina', to: '/buy', search: { location: 'Dubai Marina', beds: 2 }, preview: pv(IMG.marina, '2-bed in Dubai Marina', 'Walkable waterfront living by JBR beach') },
          { label: 'Villas in Dubai Hills', to: '/buy', search: { location: 'Dubai Hills Estate', type: 'Villa' }, preview: pv(IMG.dubaiHills, 'Villas in Dubai Hills', 'Family homes around the golf course') },
          { label: 'Under AED 1.5M', to: '/buy', search: { maxPrice: 1_500_000 }, preview: pv(IMG.jvc, 'Under AED 1.5M', '84% of sales were priced under AED 3M') },
          { label: 'Golden Visa eligible (AED 2M+)', to: '/buy', search: { minPrice: 2_000_000 }, preview: pv(IMG.downtown, 'Golden Visa eligible', 'Homes from AED 2M can qualify') },
          { label: 'Waterfront homes', to: '/communities', preview: pv(IMG.creekHarbour, 'Waterfront homes', 'Marina, Palm, Creek and Bluewaters') },
        ],
      },
      {
        title: 'Buying tools',
        links: [
          { label: 'Mortgage calculator', to: '/tools/mortgage', preview: pv(IMG.kitchen, 'Mortgage calculator', 'Monthly payment and cash you need upfront') },
          { label: 'DLD fees calculator', to: '/tools/dld-fees', preview: pv(IMG.report, 'DLD fees calculator', 'Every buying fee, line by line') },
          { label: 'Buying guide for foreigners', to: '/insights/$articleSlug', params: { articleSlug: 'true-cost-of-buying-in-dubai' }, preview: pv(IMG.couple, 'Buying guide', 'The true cost of buying in Dubai') },
          { label: 'Compare properties', to: '/compare', preview: pv(IMG.bedroom, 'Compare properties', 'Up to four homes side by side') },
        ],
      },
    ],
    feature: { image: IMG.living, title: 'Ready to move in', sub: 'Ready homes now make up 29% of sales', link: { label: 'Ready homes', to: '/buy', search: { completion: 'ready' } } },
  },
  communities: {
    columns: [
      {
        title: 'Waterfront',
        links: [
          community('Dubai Marina', 'dubai-marina', pv(IMG.marina, 'Dubai Marina', '~AED 1,757 / sq ft · 5.92% gross yield')),
          community('Palm Jumeirah', 'palm-jumeirah', pv(IMG.palm, 'Palm Jumeirah', 'Ultra-prime beachfront villas')),
          community('Dubai Creek Harbour', 'creek-harbour', pv(IMG.creekHarbour, 'Dubai Creek Harbour', 'Waterfront towers · 5.37% gross yield')),
          community('Bluewaters', undefined, pv(IMG.coastBand, 'Bluewaters', 'Island living next to JBR')),
          community('Dubai Islands', undefined, pv(IMG.offplanWaterfront, 'Dubai Islands', 'New beachfront community by Nakheel')),
        ],
      },
      {
        title: 'City living',
        links: [
          community('Downtown Dubai', 'downtown', pv(IMG.downtown, 'Downtown Dubai', '~AED 2,504 / sq ft · 5.32% gross yield')),
          community('Business Bay', 'business-bay', pv(IMG.businessBay, 'Business Bay', 'AED 2,158 / sq ft · 6.33% gross yield')),
          community('JVC', 'jvc', pv(IMG.jvc, 'JVC', 'AED 1,419 / sq ft · 7.10% gross yield')),
          community('Meydan City', undefined, pv(IMG.offplanTower, 'Meydan City', 'New launches near Downtown')),
        ],
      },
      {
        title: 'Villa communities',
        links: [
          community('Dubai Hills Estate', 'dubai-hills', pv(IMG.dubaiHills, 'Dubai Hills Estate', 'Golf-course family community')),
          community('DAMAC Lagoons', 'damac-lagoons', pv(IMG.damacLagoons, 'DAMAC Lagoons', 'AED 1,499 / sq ft · crystal lagoons')),
          community('Arabian Ranches 3', undefined, pv(IMG.villa, 'Arabian Ranches 3', 'Townhouses and villas by Emaar')),
          community('DAMAC Hills 2', undefined, pv(IMG.offplanVillas, 'DAMAC Hills 2', 'Accessible villa living')),
          community('Dubai South', undefined, pv(IMG.hero, 'Dubai South', 'Next to Al Maktoum Airport and Expo City')),
        ],
      },
    ],
    feature: { image: IMG.palm, title: 'Explore on the map', sub: 'Prices, yields and schools by area', link: { label: 'Communities', to: '/communities' } },
  },
  invest: {
    columns: [
      {
        title: 'Advisory',
        links: [
          { label: 'Investment advisory', to: '/invest', preview: pv(IMG.businessBay, 'Investment advisory', 'Yield-led advice from licensed advisers') },
          { label: 'Off-plan investing', to: '/off-plan', preview: pv(IMG.offplanTower, 'Off-plan investing', 'Escrow-protected launches and payment plans') },
          { label: 'Rental yield guide', to: '/invest/yield-guide', preview: pv(IMG.jvc, 'Rental yield guide', 'JVC leads at 7.10% gross (Bayut)') },
          { label: 'Portfolio review', to: '/contact', preview: pv(IMG.report, 'Portfolio review', 'A free review of your Dubai holdings') },
        ],
      },
      {
        title: 'Residency',
        links: [
          { label: 'Golden Visa guide', to: '/invest/golden-visa', preview: pv(IMG.palm, 'Golden Visa guide', '10-year residency from AED 2M in property') },
          { label: '2-year investor visa', to: '/invest/golden-visa', preview: pv(IMG.downtown, '2-year investor visa', 'Residency options for smaller budgets') },
          { label: 'Check current eligibility', to: '/invest/golden-visa', preview: pv(IMG.couple, 'Check your eligibility', 'A quick check before you buy') },
        ],
      },
      {
        title: 'Tools',
        links: [
          { label: 'Yield / ROI calculator', to: '/tools/roi', preview: pv(IMG.kitchen, 'Yield / ROI calculator', 'Gross, net and cash-on-cash returns') },
          { label: 'Rent vs buy', to: '/tools/rent-vs-buy', preview: pv(IMG.living, 'Rent vs buy', 'Find your break-even year') },
          { label: 'Q3 2026 market report', to: '/insights', preview: pv(IMG.report, 'Q3 2026 market report', 'Ready homes reach 29% of sales') },
        ],
      },
    ],
    feature: { image: IMG.businessBay, title: 'Yield-led advice', sub: 'JVC leads at 7.10% gross (Bayut)', link: { label: 'Yield guide', to: '/invest/yield-guide' } },
  },
}
