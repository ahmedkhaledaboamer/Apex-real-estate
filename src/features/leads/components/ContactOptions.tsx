import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

import { Reveal } from '@/components/ui/Reveal'
import { WhatsAppIcon } from '@/components/ui/icons'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, OFFICE_ADDRESS, WHATSAPP_URL } from '@/lib/constants'

import { OFFICE_DIRECTIONS_URL } from './OfficeLocation'

const OPTIONS = [
  { icon: Phone, title: 'Call us', value: CONTACT_PHONE, note: 'Mon–Fri 9:00–19:00, weekends 10:00–18:00', href: CONTACT_PHONE_HREF, ltr: true, external: false },
  { icon: WhatsAppIcon, title: 'WhatsApp', value: 'Chat with an adviser', note: 'Usually replies within 15 minutes', href: WHATSAPP_URL, ltr: false, external: true },
  { icon: Mail, title: 'Email', value: CONTACT_EMAIL, note: 'We reply within one working day', href: `mailto:${CONTACT_EMAIL}`, ltr: false, external: false },
  { icon: MapPin, title: 'Visit', value: 'Marina Plaza, Dubai Marina', note: OFFICE_ADDRESS, href: OFFICE_DIRECTIONS_URL, ltr: false, external: true },
] as const

/** Four contact channels as cards (call, WhatsApp, email, visit). */
export function ContactOptions() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {OPTIONS.map((o, i) => (
        <li key={o.title}>
          <Reveal delay={i * 0.04} className="h-full">
            <a
              href={o.href}
              {...(o.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo transition-colors duration-150 group-hover:bg-plum group-hover:text-white">
                <o.icon className="size-5" />
              </span>
              <span className="mt-5 text-[13px] font-semibold text-muted">{o.title}</span>
              <span className="mt-1 text-[17px] font-semibold break-words text-plum" dir={o.ltr ? 'ltr' : undefined}>
                {o.value}
              </span>
              <span className="mt-1 flex-1 text-[13.5px] leading-relaxed text-muted">{o.note}</span>
              <ArrowRight className="mt-4 size-4 text-muted transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
