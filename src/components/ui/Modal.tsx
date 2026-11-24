import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { X } from 'lucide-react'
import { Portal } from '@/components/ui/Portal'

import { cn } from '@/lib/cn'

/** Centered dialog (bottom sheet on mobile). Closes on Escape and backdrop click. */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return <Portal>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              'relative max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] bg-paper p-6 shadow-glass sm:max-w-lg sm:rounded-[24px] md:p-8',
              className,
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              {title ? <h2 className="font-display text-[30px] leading-tight font-semibold text-plum">{title}</h2> : <span />}
              <button onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-mist">
                <X className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </Portal>
}
