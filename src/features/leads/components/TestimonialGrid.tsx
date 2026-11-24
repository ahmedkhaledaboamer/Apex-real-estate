import { Star } from 'lucide-react'

import { Reveal } from '@/components/ui/Reveal'
import { TESTIMONIALS } from '@/mocks/testimonials'
import { srcSetOf } from '@/assets/images'

/** Static grid of client reviews (cards) — complements the home page carousel. */
export function TestimonialGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <li key={t.name}>
          <Reveal delay={i * 0.05} className="h-full">
            <figure className="flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft md:p-7">
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-aura text-aura" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-[22px] leading-[1.3] font-medium text-plum">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line/70 pt-5">
                <img decoding="async" src={t.avatar} srcSet={srcSetOf(t.avatar)} sizes="44px" alt="" loading="lazy" className="size-11 rounded-full object-cover" />
                <span>
                  <span className="block text-[14.5px] font-semibold text-ink">{t.name}</span>
                  <span className="block text-[12.5px] text-muted">{t.context}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
