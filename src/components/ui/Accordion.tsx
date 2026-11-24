import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Plus } from 'lucide-react'

import { cn } from '@/lib/cn'

export type AccordionItem = { q: string; a: React.ReactNode }

/** FAQ-style accordion with hairline dividers (matches the Services list). */
export function Accordion({ items, className, defaultOpen = null }: { items: AccordionItem[]; className?: string; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <ul className={cn('divide-y divide-line/80 border-y border-line/80', className)}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <li key={it.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-start"
            >
              <span className="text-[16.5px] font-semibold text-plum">{it.q}</span>
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-full bg-mist text-indigo transition-transform duration-200', isOpen && 'rotate-45')}>
                <Plus className="size-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-3xl pb-6 text-[15px] leading-relaxed text-muted">{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
