/**
 * Optional prefill for calculators, e.g. `/tools/mortgage?price=2300000` or `/tools/roi?price=1500000&rent=110000`.
 * Hand-written (no zod) because route `validateSearch` runs on the critical path.
 */
export type CalcSearch = { price?: number; rent?: number }

const positive = (v: unknown, max: number): number | undefined => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  return Number.isFinite(n) && n > 0 && n <= max ? n : undefined
}

/** TanStack Router `validateSearch`: bad params are dropped instead of throwing. */
export function validateCalcSearch(search: Record<string, unknown>): CalcSearch {
  const price = positive(search.price, 1_000_000_000)
  const rent = positive(search.rent, 100_000_000)
  return {
    ...(price !== undefined ? { price } : {}),
    ...(rent !== undefined ? { rent } : {}),
  }
}
