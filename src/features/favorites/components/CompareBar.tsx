import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Scale, X } from 'lucide-react'

import { ButtonLink } from '@/components/ui/Button'
import { propertyById } from '@/mocks/properties'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { MAX_COMPARE, clearCompare, toggleCompare } from '@/store/slices/compareSlice'
import { srcSetOf } from '@/assets/images'

/** Floating tray shown while 1+ properties are selected for comparison. Mounted once in the root layout. */
export function CompareBar() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)
  const items = ids.map(propertyById).filter((p) => p !== undefined)

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6"
        >
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-line bg-white/95 p-2 ps-4 shadow-lift backdrop-blur">
            <Scale className="size-5 shrink-0 text-aura" />
            <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
              {items.map((p) => (
                <li key={p.id} className="flex shrink-0 items-center gap-1.5 rounded-full bg-mist py-1 ps-1 pe-2">
                  <img decoding="async" loading="lazy" src={p.images[0]} srcSet={srcSetOf(p.images[0])} sizes="28px" alt="" className="size-7 rounded-full object-cover" />
                  <span className="max-w-[110px] truncate text-[12.5px] font-medium text-plum">{p.title}</span>
                  <button onClick={() => dispatch(toggleCompare(p.id))} aria-label={`Remove ${p.title}`} className="text-muted hover:text-plum">
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <span className="hidden shrink-0 text-[12px] text-muted sm:block">
              {items.length}/{MAX_COMPARE}
            </span>
            <button onClick={() => dispatch(clearCompare())} className="hidden shrink-0 text-[13px] font-semibold text-muted hover:text-plum sm:block">
              Clear
            </button>
            <ButtonLink to="/compare" variant="plum" size="sm" className="shrink-0">
              Compare
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
