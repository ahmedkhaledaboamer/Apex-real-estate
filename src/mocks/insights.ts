import { IMG } from '@/assets/images'
import type { Article, ArticleDetail } from '@/types'

export const ARTICLES: Article[] = [
  { id: 'a1', category: 'Market', title: 'Ready homes take 29% of sales as the market steadies', date: '18 Nov 2026', read: '6 min', image: IMG.downtown },
  { id: 'a2', category: 'Renting', title: 'Rents in Marina and Business Bay ease by 12%: what it means for tenants', date: '11 Nov 2026', read: '5 min', image: IMG.marina },
  { id: 'a3', category: 'Guides', title: 'The true cost of buying in Dubai, line by line', date: '4 Nov 2026', read: '8 min', image: IMG.kitchen },
]

export const ARTICLE_CATEGORIES = ['Market', 'Renting', 'Guides', 'Investing', 'Off-plan'] as const

/* Placeholder editorial copy. Figures quoted are from the data pack and should be re-checked before publishing. */
export const ARTICLE_DETAILS: ArticleDetail[] = [
  {
    ...ARTICLES[0],
    slug: 'ready-homes-29-percent-of-sales',
    excerpt: 'Ready homes made up 29% of Dubai residential sales in Q3 2026 as buyers favoured immediate occupancy over long payment plans.',
    author: 'Layla Haddad',
    authorRole: 'Senior Sales Consultant',
    body: [
      { type: 'p', text: 'Dubai’s residential market moved into a steadier phase in Q3 2026. Transaction volumes eased from the 2025 peak, but ready homes increased their share of sales to 29%, according to betterhomes.' },
      { type: 'h2', text: 'Why buyers are choosing ready homes' },
      { type: 'p', text: 'With rents still high, many end users would rather move in now than pay rent for three more years while an off-plan unit is built. Mortgage-backed buyers also favour ready stock because banks lend against completed property.' },
      { type: 'list', items: ['Immediate occupancy or rental income', 'Mortgage finance available from day one', 'What you see is what you get: no completion risk'] },
      { type: 'h2', text: 'What it means if you are buying' },
      { type: 'p', text: 'Competition for well-priced ready apartments in established communities is firm. Have your mortgage pre-approval in place and be ready to move quickly on the right unit.' },
      { type: 'quote', text: 'The best ready homes in Marina are still going under offer within two weeks.', cite: 'Layla Haddad' },
    ],
  },
  {
    ...ARTICLES[1],
    slug: 'marina-business-bay-rents-ease',
    excerpt: 'Asking rents in Dubai Marina and Business Bay have eased by around 12% as new supply arrives. Here is how tenants can use that.',
    author: 'Omar Siddiqui',
    authorRole: 'Leasing Manager',
    body: [
      { type: 'p', text: 'After three years of sharp increases, asking rents in Dubai Marina and Business Bay have eased by around 12% as new towers complete and landlords compete for tenants.' },
      { type: 'h2', text: 'Negotiating power is back' },
      { type: 'p', text: 'Tenants can now realistically ask for more cheques, a rent-free period on longer leases, or for the landlord to cover maintenance before move-in.' },
      { type: 'list', items: ['Ask for 4 or more cheques instead of 1–2', 'Check the RERA rental index before renewing', 'Compare service quality between buildings, not just price'] },
      { type: 'h2', text: 'Renewing? Know the rules' },
      { type: 'p', text: 'Rent increases on renewal are capped by the RERA rental index, and landlords must give 90 days’ notice of any change to the terms.' },
    ],
  },
  {
    ...ARTICLES[2],
    slug: 'true-cost-of-buying-in-dubai',
    excerpt: 'The price on the listing is only part of the bill. Here is every fee you should budget for when buying in Dubai.',
    author: 'Sofia Petrova',
    authorRole: 'Luxury Homes Director',
    body: [
      { type: 'p', text: 'On top of the purchase price, buyers in Dubai should budget roughly 7–8% for fees and charges. Here is how that breaks down.' },
      { type: 'h2', text: 'Government fees' },
      { type: 'list', items: ['DLD transfer fee: 4% of the price', 'Title deed issuance: AED 580', 'Trustee office fee: AED 4,000 + VAT (AED 2,000 + VAT under AED 500K)'] },
      { type: 'h2', text: 'Agency and finance costs' },
      { type: 'list', items: ['Agency commission: typically 2% + VAT', 'Mortgage registration: 0.25% of the loan + AED 290', 'Bank arrangement fee: up to 1% of the loan', 'Valuation fee: about AED 2,500–3,500'] },
      { type: 'h2', text: 'After you move in' },
      { type: 'p', text: 'Service charges are billed per square foot each year and vary widely between buildings. Always ask for the latest service-charge statement before you commit.' },
      { type: 'quote', text: 'We give every buyer a line-by-line cost sheet before they make an offer.', cite: 'Sofia Petrova' },
    ],
  },
  {
    id: 'a4', category: 'Investing', title: 'JVC still leads Dubai on gross rental yield', date: '28 Oct 2026', read: '5 min', image: IMG.jvc,
    slug: 'jvc-leads-on-gross-yield',
    excerpt: 'At 7.10% gross, JVC continues to out-yield Dubai’s premium districts. We look at what drives the number and the risks behind it.',
    author: 'Omar Siddiqui',
    authorRole: 'Leasing Manager',
    body: [
      { type: 'p', text: 'Jumeirah Village Circle recorded average gross yields of 7.10% in Q3 2026 (Bayut), the highest of any major Dubai community.' },
      { type: 'h2', text: 'What drives the yield' },
      { type: 'p', text: 'Lower entry prices combined with steady tenant demand from families and young professionals push yields above waterfront districts.' },
      { type: 'h2', text: 'What to watch' },
      { type: 'list', items: ['Service charges vary widely between buildings', 'New supply can soften rents in the short term', 'Gross yield is before fees, vacancy and maintenance'] },
    ],
  },
  {
    id: 'a5', category: 'Off-plan', title: 'How to check an off-plan project before you pay a deposit', date: '21 Oct 2026', read: '7 min', image: IMG.offplanTower,
    slug: 'check-off-plan-project-before-deposit',
    excerpt: 'Escrow, DLD registration and developer track record: the five checks we run on every off-plan launch.',
    author: 'Daniel Moore',
    authorRole: 'Off-Plan Advisor',
    body: [
      { type: 'p', text: 'Off-plan can be a good way into Dubai property, but the protections only work if you check them. These are the steps we follow on every launch.' },
      { type: 'list', items: ['Confirm the project is registered with DLD (Oqood)', 'Check payments go into the named escrow account', 'Review the developer’s delivery record', 'Read the SPA, especially delay and cancellation clauses', 'Make sure your payment plan matches construction milestones'] },
      { type: 'quote', text: 'If a payment is not going into escrow, walk away.', cite: 'Daniel Moore' },
    ],
  },
  {
    id: 'a6', category: 'Guides', title: 'Golden Visa through property: the 2026 rules', date: '14 Oct 2026', read: '6 min', image: IMG.palm,
    slug: 'golden-visa-property-2026',
    excerpt: 'A property worth AED 2 million or more can qualify you for a 10-year UAE Golden Visa. Here is how it works.',
    author: 'Sofia Petrova',
    authorRole: 'Luxury Homes Director',
    body: [
      { type: 'p', text: 'Investors who own property in Dubai worth at least AED 2 million can apply for a 10-year renewable Golden Visa.' },
      { type: 'h2', text: 'Key requirements' },
      { type: 'list', items: ['Property value of AED 2M or more (one or several units)', 'Off-plan and mortgaged property can qualify, subject to conditions', 'Visa covers spouse and children'] },
      { type: 'p', text: 'Rules change from time to time, so always confirm current eligibility with ICP or GDRFA before you buy.' },
    ],
  },
]

export const articleBySlug = (slug: string) => ARTICLE_DETAILS.find((a) => a.slug === slug)
