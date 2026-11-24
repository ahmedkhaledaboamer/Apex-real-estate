import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { motion } from '@/lib/motion'

import { IMG, srcSetOf } from '@/assets/images'

/** Full-bleed parallax photo band between content sections. */
export function PhotoBand() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section ref={ref} className="relative isolate aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
      <motion.img decoding="async"
        style={{ y }}
        src={IMG.coastBand} srcSet={srcSetOf(IMG.coastBand)} sizes="100vw"
        alt="Dubai coastline and Palm Jumeirah from above at dusk"
        loading="lazy"
        className="absolute inset-0 -z-10 h-[116%] w-full -translate-y-[8%] object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-plum/75 via-plum/30 to-transparent rtl:bg-gradient-to-l" />
      <div className="mx-auto flex h-full max-w-[1280px] items-center px-5 md:px-8">
        <blockquote className="max-w-lg">
          <p className="font-display text-[32px] leading-[1.1] font-medium text-white italic sm:text-[44px] lg:text-[56px]">
            Beyond the address.
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/85">
            We look at the light, the commute, the service charge and the resale data before we show you a single door.
          </p>
        </blockquote>
      </div>
    </section>
  )
}
