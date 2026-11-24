import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import { cn } from '@/lib/cn'
import type { LatLng } from '@/types'

export type MapMarker = {
  id: string
  position: LatLng
  /** Short text on the pin (e.g. "AED 2.3M"). Omit for a plain dot pin. */
  label?: string
  popup?: React.ReactNode
  active?: boolean
}

const pinIcon = (label?: string, active?: boolean) =>
  L.divIcon({
    className: '',
    iconSize: undefined,
    html: label
      ? `<span style="transform:translate(-50%,-100%);position:absolute;white-space:nowrap;font:600 12px 'Plus Jakarta Sans',sans-serif;padding:5px 9px;border-radius:999px;box-shadow:0 2px 8px rgb(56 26 76/.25);background:${active ? '#843f96' : '#381a4c'};color:#fff;border:2px solid #fff">${label}</span>`
      : `<span style="transform:translate(-50%,-50%);position:absolute;display:block;width:18px;height:18px;border-radius:999px;background:linear-gradient(100deg,#843f96,#275ba8);border:3px solid #fff;box-shadow:0 2px 8px rgb(56 26 76/.35)"></span>`,
  })

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  // Re-fit only when the set of pin positions changes — not when a pin is highlighted —
  // so the user's own zoom/pan survives clicks.
  const key = markers.map((m) => `${m.position.lat},${m.position.lng}`).join('|')
  useEffect(() => {
    if (markers.length === 0) return
    if (markers.length === 1) {
      map.setView([markers[0].position.lat, markers[0].position.lng], 14)
      return
    }
    map.fitBounds(L.latLngBounds(markers.map((m) => [m.position.lat, m.position.lng])), { padding: [48, 48], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])
  return null
}

/** OpenStreetMap map with branded pins. Auto-fits to the markers. Browser-only: load through LocationMap. */
export default function LeafletMap({
  markers,
  className,
  onMarkerClick,
  scrollWheelZoom = false,
}: {
  markers: MapMarker[]
  className?: string
  onMarkerClick?: (id: string) => void
  scrollWheelZoom?: boolean
}) {
  const center = markers[0]?.position ?? { lat: 25.15, lng: 55.25 }
  return (
    <div className={cn('relative isolate z-0 overflow-hidden rounded-[16px] bg-mist', className)}>
      <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={scrollWheelZoom} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.position.lat, m.position.lng]}
            icon={pinIcon(m.label, m.active)}
            zIndexOffset={m.active ? 1000 : 0}
            eventHandlers={onMarkerClick ? { click: () => onMarkerClick(m.id) } : undefined}
          >
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
