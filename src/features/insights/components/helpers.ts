import { ARTICLE_DETAILS } from '@/mocks/insights'
import type { ArticleDetail } from '@/types'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** Parses the mock "18 Nov 2026" format without relying on engine-specific Date parsing. */
export function articleTime(a: Pick<ArticleDetail, 'date'>) {
  const [d, m, y] = a.date.split(' ')
  return Date.UTC(Number(y), MONTHS.indexOf(m.slice(0, 3).toLowerCase()), Number(d))
}

/** Newest first. */
export const ARTICLES_BY_DATE: ArticleDetail[] = [...ARTICLE_DETAILS].sort((a, b) => articleTime(b) - articleTime(a))

export function relatedArticles(current: ArticleDetail, count = 3) {
  const rest = ARTICLES_BY_DATE.filter((a) => a.slug !== current.slug)
  const same = rest.filter((a) => a.category === current.category)
  const others = rest.filter((a) => a.category !== current.category)
  return [...same, ...others].slice(0, count)
}

/** Older and newer neighbours in date order. */
export function adjacentArticles(current: ArticleDetail) {
  const i = ARTICLES_BY_DATE.findIndex((a) => a.slug === current.slug)
  return { older: ARTICLES_BY_DATE[i + 1], newer: i > 0 ? ARTICLES_BY_DATE[i - 1] : undefined }
}
