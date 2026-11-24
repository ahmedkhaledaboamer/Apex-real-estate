import type { Currency } from '@/types'
import { SYMBOL, convertFromAed } from './currency'

export function formatPrice(aed: number, currency: Currency, opts: { compact?: boolean } = {}) {
  const value = convertFromAed(aed, currency)
  const num = opts.compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: value >= 10_000_000 ? 1 : 2 }).format(value)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
  return currency === 'AED' ? `AED ${num}` : `${SYMBOL[currency]}${num}`
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatArea(sqft: number) {
  return `${formatNumber(sqft)} sq ft`
}

export function formatDate(date: Date | string, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}
