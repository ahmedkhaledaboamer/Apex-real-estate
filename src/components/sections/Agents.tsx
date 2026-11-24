import { Languages, MapPin } from 'lucide-react'

import { Link } from '@tanstack/react-router'

import { AGENT_PROFILES as AGENTS } from '@/mocks/agents'
import { whatsappLink } from '@/lib/constants'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Reveal, SectionHead } from '@/components/ui/Reveal'
import { srcSetOf } from '@/assets/images'

export function Agents() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal>
          <SectionHead
            title="Meet our agents"
            sub="Every adviser is RERA-licensed. Check any BRN on the Dubai Land Department site."
          />
        </Reveal>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => (
            <li key={a.id}>
              <Reveal delay={i * 0.04} className="h-full">
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-mist">
                    <img decoding="async" src={a.photo} srcSet={srcSetOf(a.photo)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                    <span className="absolute bottom-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-semibold text-plum">
                      BRN {a.brn}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[24px] leading-tight font-semibold text-plum">
                    <Link to="/agents/$agentSlug" params={{ agentSlug: a.slug }} className="hover:text-aura">
                      {a.name}
                    </Link>
                  </h3>
                  <p className="text-[14px] text-muted">{a.role}</p>
                  <ul className="mt-3 space-y-1.5 text-[13.5px] text-ink/80">
                    <li className="flex items-start gap-2">
                      <Languages className="mt-0.5 size-4 shrink-0 text-muted" /> {a.languages.join(', ')}
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted" /> {a.communities.join(', ')}
                    </li>
                  </ul>
                  <div className="mt-auto pt-4">
                    <a
                      href={whatsappLink(a.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-[14px] font-semibold text-plum transition-colors duration-150 hover:border-[#1f9d55] hover:bg-[#1f9d55] hover:text-white"
                    >
                      <WhatsAppIcon /> WhatsApp {a.name.split(' ')[0]}
                    </a>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
