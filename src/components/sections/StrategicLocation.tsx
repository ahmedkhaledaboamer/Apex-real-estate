import { useReducedMotion } from 'framer-motion'
import { motion } from '@/lib/motion'
import { ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/ui/Reveal'
import { ConnectionsMap } from '@/features/location/ConnectionsMap'
import { OFFICE_MAP_URL } from '@/lib/constants'

/** Dark band: where we are, with the dotted map of routes into Dubai. Clicking opens the office in Google Maps. */
export function StrategicLocation() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="location-title" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Brand glow, bottom end side */}
      <div className="pointer-events-none absolute -end-40 -bottom-40 -z-10 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(60_180_232/0.22),rgb(132_63_150/0.12)_55%,transparent)]" />
      <div className="pointer-events-none absolute -start-40 -top-40 -z-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(132_63_150/0.18),transparent)]" />

      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
        <Reveal>
          <p className="text-[13px] font-semibold tracking-[0.32em] text-cyan">STRATEGIC LOCATION</p>
          <h2 id="location-title" className="mt-4 font-display text-[38px] leading-[1.05] font-semibold md:text-[50px]">
            From Dubai Marina, at the heart of the world
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/70">
            Our office sits in Dubai Marina, within a few hours’ flight of London, Moscow, Karachi, New Delhi, Mumbai and the Gulf — so you can view, sign and
            collect your keys without the guesswork.
          </p>

          {/* Signal line */}
          <div className="relative mt-9 h-px max-w-sm bg-white/15" aria-hidden="true">
            <motion.span
              className="absolute top-1/2 block size-3 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_0_5px_rgb(60_180_232/0.2),0_0_18px_rgb(60_180_232/0.8)]"
              initial={{ left: '0%' }}
              animate={reduce ? undefined : { left: ['0%', '96%', '0%'] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          <a
            href={OFFICE_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="group mt-9 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:border-white hover:bg-white hover:text-plum"
          >
            Explore our location
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Reveal>

        <a
          href={OFFICE_MAP_URL}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="-mx-5 block md:mx-0"
        >
          <ConnectionsMap className="h-auto w-full" />
        </a>
      </div>
    </section>
  )
}
