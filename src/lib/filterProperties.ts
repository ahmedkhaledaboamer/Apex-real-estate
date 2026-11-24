import type { SearchParams } from '@/features/search/schemas'
import type { Property } from '@/types'

/* Shared by the website and the mobile app — keep it free of browser/Vite APIs. */

/** Pure filter + sort, shared by the API mock and any client-side counts. */
export function filterProperties(items: Property[], f: Partial<SearchParams>): Property[] {
  const q = f.location?.trim().toLowerCase()
  const out = items.filter(
    (p) =>
      (!f.kind || p.kind === f.kind) &&
      (!q || p.community.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.building.toLowerCase().includes(q)) &&
      (!f.type || p.type === f.type || (f.type === 'Villa' && p.type === 'Townhouse')) &&
      (f.minPrice === undefined || p.priceAed >= f.minPrice) &&
      (f.maxPrice === undefined || p.priceAed <= f.maxPrice) &&
      // Exact match for Studio–4 beds; 5 means "5 or more".
      (f.beds === undefined || (f.beds >= 5 ? p.beds >= 5 : p.beds === f.beds)) &&
      (f.baths === undefined || p.baths >= f.baths) &&
      (!f.completion || p.completion === f.completion) &&
      (!f.furnishing || p.furnishing === f.furnishing),
  )
  if (f.sort === 'price-asc') out.sort((a, b) => a.priceAed - b.priceAed)
  else if (f.sort === 'price-desc') out.sort((a, b) => b.priceAed - a.priceAed)
  else out.sort((a, b) => b.listedOn.localeCompare(a.listedOn))
  return out
}
