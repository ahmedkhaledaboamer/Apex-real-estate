import { lazy, Suspense, useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

export type { MapMarker } from './LeafletMap'

// Leaflet touches `window` on import, so it is loaded only in the browser — and lazily, so the
// ~45 KB map library never blocks the page from rendering.
const LeafletMap = lazy(() => import('./LeafletMap'))

type Props = React.ComponentProps<typeof LeafletMap>

/** OpenStreetMap map with branded pins (client-only). Same box as the map while it loads — no layout shift. */
export function LocationMap(props: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const placeholder = <div aria-hidden="true" className={cn('relative isolate z-0 overflow-hidden rounded-[16px] bg-mist', props.className)} />
  if (!mounted) return placeholder
  return (
    <Suspense fallback={placeholder}>
      <LeafletMap {...props} />
    </Suspense>
  )
}
