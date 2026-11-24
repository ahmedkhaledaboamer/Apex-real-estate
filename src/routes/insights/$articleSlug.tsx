import { useMemo } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { ButtonLink } from '@/components/ui/Button'
import { Breadcrumbs, Container } from '@/components/ui/misc'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { ArticleBody } from '@/features/insights/components/ArticleBody'
import { ArticleCard } from '@/features/insights/components/ArticleCard'
import { ShareButtons } from '@/features/insights/components/ShareButtons'
import { adjacentArticles, relatedArticles } from '@/features/insights/components/helpers'
import { AGENT_PROFILES } from '@/mocks/agents'
import { articleBySlug } from '@/mocks/insights'
import { srcSetOf } from '@/assets/images'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/insights/$articleSlug')({
  loader: ({ params }) => {
    const article = articleBySlug(params.articleSlug)
    if (!article) throw notFound()
    return article
  },
  head: ({ loaderData: a }) => (a ? seo({ title: a.title, description: a.excerpt, image: a.image }) : {}),
  component: Page,
})

function Page() {
  const a = Route.useLoaderData()
  const author = useMemo(() => AGENT_PROFILES.find((p) => p.name === a.author), [a.author])
  const related = useMemo(() => relatedArticles(a), [a])
  const { older, newer } = useMemo(() => adjacentArticles(a), [a])

  return (
    <>
      <article>
        <header className="bg-white">
          <Container className="pt-8 pb-10 md:pt-10 md:pb-14">
            <Breadcrumbs items={[{ label: 'Insights', to: '/insights' }, { label: a.title }]} className="mb-8" />
            <div className="max-w-4xl">
              <p className="text-[13px] font-semibold text-aura">{a.category}</p>
              <h1 className="mt-2 font-display text-[40px] leading-[1.02] font-semibold text-plum md:text-[60px]">{a.title}</h1>
              <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed text-muted">{a.excerpt}</p>
              <div className="mt-6 flex items-center gap-3">
                {author && <img decoding="async" loading="lazy" src={author.photo} srcSet={srcSetOf(author.photo)} sizes="44px" alt="" className="size-11 rounded-full object-cover" />}
                <div className="text-[13.5px]">
                  <p className="font-semibold text-ink">
                    {author ? (
                      <Link to="/agents/$agentSlug" params={{ agentSlug: author.slug }} className="hover:text-aura">
                        {a.author}
                      </Link>
                    ) : (
                      a.author
                    )}
                    <span className="font-normal text-muted"> · {a.authorRole}</span>
                  </p>
                  <p className="text-muted">
                    <time>{a.date}</time> · {a.read} read
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </header>

        <Container className="pt-10 md:pt-14">
          <div className="aspect-[16/9] overflow-hidden rounded-[24px] bg-mist md:aspect-[21/9]">
            <img decoding="async" loading="lazy" src={a.image} srcSet={srcSetOf(a.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" className="h-full w-full object-cover" />
          </div>
        </Container>

        <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="min-w-0">
            <ArticleBody blocks={a.body} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ShareButtons key={a.slug} title={a.title} />
            <div className="rounded-[16px] bg-plum p-6 text-white">
              <h2 className="font-display text-[26px] leading-tight font-semibold">Talk to an adviser</h2>
              <p className="mt-2 text-[14.5px] text-white/80">Questions about this article or your own move? Get straight answers from a RERA-licensed adviser.</p>
              <ButtonLink to="/contact" variant="white" className="mt-5 w-full">
                Contact us
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </article>

      <section className="pb-16 md:pb-24">
        <Container>
          {/* Author */}
          <div className="flex flex-col gap-5 rounded-[16px] bg-white p-6 shadow-soft sm:flex-row sm:items-center md:p-8">
            {author && <img decoding="async" loading="lazy" src={author.photo} srcSet={srcSetOf(author.photo)} sizes="80px" alt="" className="size-20 shrink-0 rounded-full object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-muted">Written by</p>
              <p className="font-display text-[26px] leading-tight font-semibold text-plum">{a.author}</p>
              <p className="text-[14px] text-muted">{a.authorRole}</p>
              {author && <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink/80">{author.bio}</p>}
            </div>
            {author ? (
              <ButtonLink to="/agents/$agentSlug" params={{ agentSlug: author.slug }} variant="outline" className="self-start sm:self-center">
                View profile <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </ButtonLink>
            ) : (
              <ButtonLink to="/agents" variant="outline" className="self-start sm:self-center">
                Meet our agents
              </ButtonLink>
            )}
          </div>

          {/* Prev / next */}
          {(older || newer) && (
            <nav aria-label="More articles" className="mt-6 grid gap-4 sm:grid-cols-2">
              {older ? (
                <Link
                  to="/insights/$articleSlug"
                  params={{ articleSlug: older.slug }}
                  className="group rounded-[16px] border border-line/70 bg-white p-5 transition-shadow duration-200 hover:shadow-lift"
                >
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
                    <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" /> Previous article
                  </span>
                  <span className="mt-1 block text-[16px] leading-snug font-semibold text-ink group-hover:text-plum">{older.title}</span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {newer && (
                <Link
                  to="/insights/$articleSlug"
                  params={{ articleSlug: newer.slug }}
                  className="group rounded-[16px] border border-line/70 bg-white p-5 text-end transition-shadow duration-200 hover:shadow-lift"
                >
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
                    Next article <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-[16px] leading-snug font-semibold text-ink group-hover:text-plum">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <Container>
            <Reveal>
              <SectionHead
                title="Related articles"
                action={
                  <Link to="/insights" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-aura hover:text-plum">
                    All insights <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                }
              />
            </Reveal>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <ArticleCard article={r} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  )
}
