import { Link } from '@tanstack/react-router'
import { Languages, MapPin } from 'lucide-react'

import { WhatsAppIcon } from '@/components/ui/icons'
import { whatsappLink } from '@/lib/constants'
import type { AgentProfile } from '@/types'
import { srcSetOf } from '@/assets/images'

/** Agent card in the home "Meet our agents" recipe: tall photo, BRN badge, serif name, WhatsApp. */
export function AgentCard({ agent: a, whatsappText }: { agent: AgentProfile; whatsappText?: string }) {
  const first = a.name.split(' ')[0]
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-mist">
        <img decoding="async" src={a.photo} srcSet={srcSetOf(a.photo)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        <span className="absolute bottom-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-semibold text-plum">BRN {a.brn}</span>
      </div>
      <h3 className="mt-4 font-display text-[24px] leading-tight font-semibold text-plum">
        <Link to="/agents/$agentSlug" params={{ agentSlug: a.slug }} className="hover:text-aura">
          {a.name}
        </Link>
      </h3>
      <p className="text-[14px] text-muted">{a.role}</p>
      <ul className="mt-3 space-y-1.5 text-[13.5px] text-ink/80">
        <li className="flex items-start gap-2">
          <Languages className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
          <span>
            <span className="sr-only">Languages: </span>
            {a.languages.join(', ')}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
          <span>
            <span className="sr-only">Areas: </span>
            {a.communities.join(', ')}
          </span>
        </li>
      </ul>
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <a
          href={whatsappLink(a.whatsapp, whatsappText ?? `Hi ${first}, I found you on the Apex Aura website.`)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-[14px] font-semibold text-plum transition-colors duration-150 hover:border-[#1f9d55] hover:bg-[#1f9d55] hover:text-white"
        >
          <WhatsAppIcon /> WhatsApp {first}
        </a>
        <Link
          to="/agents/$agentSlug"
          params={{ agentSlug: a.slug }}
          className="text-center text-[13.5px] font-semibold text-aura hover:text-plum"
          aria-label={`View ${a.name}’s profile`}
        >
          View profile
        </Link>
      </div>
    </article>
  )
}
