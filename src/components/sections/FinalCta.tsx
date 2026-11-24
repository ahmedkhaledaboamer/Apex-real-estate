import { Search } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'

import { IMG, srcSetOf } from '@/assets/images'

export function FinalCta({ onContact }: { onContact?: () => void }) {
  const navigate = useNavigate()
  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px]">
        <img decoding="async" src={IMG.pool} srcSet={srcSetOf(IMG.pool)} sizes="100vw" alt="Infinity pool overlooking the Dubai skyline" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-plum/70" />
        <div className="flex flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-14 md:py-24">
          <div className="max-w-xl">
            <h2 className="font-display text-[40px] leading-[1.02] font-semibold text-white md:text-[64px]">Ready to make your move?</h2>
            <p className="mt-4 text-[16px] text-white/80">Talk to an adviser today, or start browsing verified homes across Dubai.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onContact ?? (() => navigate({ to: '/contact' }))}
              className="bg-aura-gradient rounded-full px-7 py-3.5 text-[15px] font-semibold text-white shadow-glass transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97]"
            >
              Speak to an adviser
            </button>
            <Link to="/buy" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-plum transition-colors duration-150 hover:bg-mist">
              <Search className="size-4" /> Browse properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
