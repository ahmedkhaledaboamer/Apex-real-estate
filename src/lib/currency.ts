import type { Currency } from '@/types'

/** Indicative AED conversion rates (placeholder — wire to a rates API later). */
export const RATES: Record<Currency, number> = { AED: 1, USD: 0.2723, EUR: 0.2512, GBP: 0.2146 }
export const SYMBOL: Record<Currency, string> = { AED: 'AED', USD: '$', EUR: '€', GBP: '£' }

export const CURRENCIES: Currency[] = ['AED', 'USD', 'EUR', 'GBP']

export function convertFromAed(aed: number, currency: Currency) {
  return aed * RATES[currency]
}
