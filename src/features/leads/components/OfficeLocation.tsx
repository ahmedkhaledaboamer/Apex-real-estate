import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'

import { ButtonAnchor } from '@/components/ui/Button'
import { LocationMap } from '@/components/media/LocationMap'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, OFFICE_ADDRESS, OFFICE_LOCATION as OFFICE } from '@/lib/constants'
import { cn } from '@/lib/cn'
import type { LatLng } from '@/types'

/** Head office — Marina Plaza, Dubai Marina. */
export const OFFICE_LOCATION: LatLng = OFFICE
export const OFFICE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}`

export const OFFICE_HOURS: { days: string; hours: string }[] = [
  { days: 'Monday – Friday', hours: '9:00 – 19:00' },
  { days: 'Saturday', hours: '10:00 – 18:00' },
  { days: 'Sunday', hours: '11:00 – 17:00' },
  { days: 'Viewings', hours: '7 days, until 21:00 by appointment' },
]

export function OfficeMap({ className }: { className?: string }) {
  return (
    <LocationMap
      className={cn('h-[320px] md:h-[420px]', className)}
      markers={[
        {
          id: 'office',
          position: OFFICE_LOCATION,
          label: 'Apex Aura',
          popup: (
            <span className="text-[13px]">
              <strong className="block text-plum">Apex Aura Real Estate</strong>
              {OFFICE_ADDRESS}
            </span>
          ),
        },
      ]}
    />
  )
}

/** Office card: map + address, contact lines and directions. */
export function OfficeCard({ showHours = false }: { showHours?: boolean }) {
  return (
    <div className="grid overflow-hidden rounded-[24px] bg-white shadow-soft lg:grid-cols-[1.25fr_1fr]">
      <OfficeMap className="rounded-none" />
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[12.5px] font-semibold text-aura">Head office</p>
        <h3 className="mt-1 font-display text-[30px] leading-tight font-semibold text-plum">Marina Plaza, Dubai Marina</h3>
        <ul className="mt-5 space-y-3 text-[14.5px] text-ink/80">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted" /> {OFFICE_ADDRESS}
          </li>
          <li className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-muted" />
            <a href={CONTACT_PHONE_HREF} className="hover:text-aura" dir="ltr">
              {CONTACT_PHONE}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="size-4 shrink-0 text-muted" />
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-aura">
              {CONTACT_EMAIL}
            </a>
          </li>
          {!showHours && (
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-muted" /> Mon–Fri 9:00–19:00 · Sat–Sun by appointment
            </li>
          )}
        </ul>
        {showHours && (
          <table className="mt-6 w-full text-[14px]">
            <caption className="mb-2 text-start text-[13px] font-semibold text-plum">Office hours (GST)</caption>
            <tbody className="divide-y divide-line/70 border-y border-line/70">
              {OFFICE_HOURS.map((h) => (
                <tr key={h.days}>
                  <th scope="row" className="py-2.5 pe-4 text-start font-medium text-ink">
                    {h.days}
                  </th>
                  <td className="py-2.5 text-end text-muted">{h.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-5 text-[13px] leading-relaxed text-muted">
          Visitor parking in the Marina Plaza basement. Two minutes’ walk from Dubai Marina tram stop and DMCC metro station.
        </p>
        <div className="mt-auto pt-6">
          <ButtonAnchor href={OFFICE_DIRECTIONS_URL} target="_blank" rel="noreferrer" variant="outline">
            <Navigation className="size-4" /> Get directions
          </ButtonAnchor>
        </div>
      </div>
    </div>
  )
}
