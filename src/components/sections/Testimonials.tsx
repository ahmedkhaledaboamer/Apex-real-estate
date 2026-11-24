import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

import { TESTIMONIALS } from '@/mocks/testimonials'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { srcSetOf } from '@/assets/images'

export function Testimonials() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const t = TESTIMONIALS[i]
  const go = (d: number) => {
    setDir(d)
    setI((v) => (v + d + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28">
      <InfinityMark className="pointer-events-none absolute start-1/2 top-1/2 -z-10 w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] rtl:translate-x-1/2" strokeWidth={6} />
      <div className="mx-auto max-w-[960px] px-5 text-center md:px-8">
        <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-soft">
          <span className="text-[15px] font-bold">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
          <span className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="size-3.5 fill-[#FBBC05] text-[#FBBC05]" />
            ))}
          </span>
          <span className="text-[13px] font-semibold text-ink">4.9 · 312 reviews</span>
        </div>

        <div className="relative mt-10 min-h-[300px] sm:min-h-[260px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex justify-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-5 fill-aura text-aura" />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-[26px] leading-[1.3] font-medium text-plum md:text-[36px]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <img decoding="async" loading="lazy" src={t.avatar} srcSet={srcSetOf(t.avatar)} sizes="48px" alt="" className="size-12 rounded-full object-cover" />
                <span className="text-start">
                  <span className="block text-[15px] font-semibold text-ink">{t.name}</span>
                  <span className="block text-[13px] text-muted">{t.context}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous review" className="grid size-11 place-items-center rounded-full border border-line bg-white text-plum transition-colors duration-150 hover:bg-mist">
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, d) => (
              <span key={d} className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${d === i ? 'w-6 bg-plum' : 'w-1.5 bg-line'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next review" className="grid size-11 place-items-center rounded-full border border-line bg-white text-plum transition-colors duration-150 hover:bg-mist">
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  )
}
