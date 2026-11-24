import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, FileText } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Container, EmptyState } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { Tabs } from '@/components/ui/Tabs'
import { ArticleCard, FeaturedArticleCard } from '@/features/insights/components/ArticleCard'
import { NewsletterBand } from '@/features/insights/components/NewsletterBand'
import { ARTICLES_BY_DATE } from '@/features/insights/components/helpers'
import { ARTICLE_CATEGORIES } from '@/mocks/insights'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/insights/')({
  head: () => seo({ title: "Market insights", description: "Dubai property market reports, renting and buying guides from the advisers who work the market every day." }), component: Page })

const ALL = 'All'
const CATEGORIES = [ALL, ...ARTICLE_CATEGORIES.filter((c) => ARTICLES_BY_DATE.some((a) => a.category === c))]
const FEATURED = ARTICLES_BY_DATE[0]
const LATEST_MARKET = ARTICLES_BY_DATE.find((a) => a.category === 'Market') ?? FEATURED

function Page() {
  const [category, setCategory] = useState<string>(ALL)

  // "All" skips the featured article (already shown above); a category shows everything in it.
  const list = useMemo(
    () => (category === ALL ? ARTICLES_BY_DATE.filter((a) => a.slug !== FEATURED.slug) : ARTICLES_BY_DATE.filter((a) => a.category === category)),
    [category],
  )

  return (
    <>
      <PageHero
        title="Market insights"
        sub="Prices, rents, rules and practical guides for buying, renting and investing in Dubai, written by the advisers who work the market every day."
        crumbs={[{ label: 'Insights' }]}
      />

      <section className="pt-16 md:pt-24">
        <Container className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <Reveal className="h-full">
            <FeaturedArticleCard article={FEATURED} />
          </Reveal>

          <Reveal delay={0.04} className="h-full">
            <aside className="flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft md:p-8">
              <span className="grid size-12 place-items-center rounded-full bg-mist text-aura">
                <FileText className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-[13px] font-semibold text-aura">Quarterly market report · Q3 2026</p>
              <h2 className="mt-2 font-display text-[28px] leading-tight font-semibold text-plum">Apartment prices ease 4.8% as ready homes reach 29% of sales</h2>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[12px] text-muted">Avg apartment price</dt>
                  <dd className="text-[20px] font-bold text-plum">
                    AED 1,817<span className="text-[12.5px] font-medium text-muted"> /sq ft</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-muted">Residential deals</dt>
                  <dd className="text-[20px] font-bold text-plum">~34,500</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11.5px] text-muted">Source: Savills Dubai Residential Market Report Q3 2026.</p>
              <div className="mt-auto pt-6">
                <ButtonLink to="/insights/$articleSlug" params={{ articleSlug: LATEST_MARKET.slug }} className="w-full">
                  Read the market report <ArrowRight className="size-4 rtl:rotate-180" />
                </ButtonLink>
              </div>
            </aside>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHead title="All articles" sub="Filter by topic to find what matters to you." />
          </Reveal>
          <Tabs label="Article categories" value={category} onChange={setCategory} tabs={CATEGORIES.map((c) => ({ key: c, label: c }))} />

          {list.length === 0 ? (
            <EmptyState className="mt-8" title="Nothing here yet" body="We have not published in this category recently. Try another topic." />
          ) : (
            <ul role="tabpanel" aria-label={`${category} articles`} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a, i) => (
                <li key={a.slug}>
                  <Reveal delay={Math.min(i, 5) * 0.04} className="h-full">
                    <ArticleCard article={a} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <NewsletterBand />
    </>
  )
}
