import { Link } from '@tanstack/react-router'

import type { ArticleDetail } from '@/types'
import { srcSetOf } from '@/assets/images'

/** Grid card: image, category, title, excerpt, meta, author. */
export function ArticleCard({ article: a }: { article: ArticleDetail }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-soft transition-shadow duration-200 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img decoding="async" src={a.image} srcSet={srcSetOf(a.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[12px] font-semibold text-aura">{a.category}</p>
        <h3 className="mt-1.5 text-[18px] leading-snug font-semibold text-ink group-hover:text-plum">
          <Link to="/insights/$articleSlug" params={{ articleSlug: a.slug }} className="after:absolute after:inset-0">
            {a.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{a.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-5 text-[12.5px] text-muted">
          <span className="font-medium text-ink/80">{a.author}</span>
          <span>
            {a.date} · {a.read} read
          </span>
        </div>
      </div>
    </article>
  )
}

/** Large featured card: image beside copy on desktop. */
export function FeaturedArticleCard({ article: a }: { article: ArticleDetail }) {
  return (
    <article className="group relative grid h-full overflow-hidden rounded-[16px] bg-white shadow-soft transition-shadow duration-200 hover:shadow-lift md:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist md:aspect-auto md:min-h-[360px]">
        <img decoding="async" loading="lazy" src={a.image} srcSet={srcSetOf(a.image)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        <span className="absolute top-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-plum shadow-soft">Latest</span>
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[13px] font-semibold text-aura">{a.category}</p>
        <h2 className="mt-2 font-display text-[30px] leading-tight font-semibold text-plum md:text-[36px]">
          <Link to="/insights/$articleSlug" params={{ articleSlug: a.slug }} className="after:absolute after:inset-0 group-hover:text-aura">
            {a.title}
          </Link>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.excerpt}</p>
        <div className="mt-auto pt-6 text-[13px] text-muted">
          <p className="font-semibold text-ink">{a.author}</p>
          <p>
            {a.authorRole} · {a.date} · {a.read} read
          </p>
        </div>
      </div>
    </article>
  )
}
