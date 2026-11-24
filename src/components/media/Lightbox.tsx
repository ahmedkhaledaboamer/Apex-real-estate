import { useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Portal } from '@/components/ui/Portal'
import { srcSetOf } from '@/assets/images'

/** Full-screen photo viewer. Arrow keys / Escape supported. */
export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  alt = 'Photo',
}: {
  images: string[]
  /** null = closed */
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
  alt?: string
}) {
  const n = images.length
  const go = useCallback((d: number) => index !== null && onIndexChange((index + d + n) % n), [index, n, onIndexChange])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [index, go, onClose])

  return <Portal>
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-[14px] text-white/70">
              {index + 1} / {n}
            </span>
            <button onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-full hover:bg-white/10">
              <X className="size-6" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-20">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img decoding="async"
                key={index}
                src={images[index]} srcSet={srcSetOf(images[index])} sizes="100vw"
                alt={`${alt} ${index + 1} of ${n}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-h-[78vh] max-w-full rounded-xl object-contain"
              />
            </AnimatePresence>
            {n > 1 && (
              <>
                <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute start-3 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:start-6">
                  <ChevronLeft className="size-6 rtl:rotate-180" />
                </button>
                <button onClick={() => go(1)} aria-label="Next photo" className="absolute end-3 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:end-6">
                  <ChevronRight className="size-6 rtl:rotate-180" />
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5 scrollbar-none">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity ${i === index ? 'opacity-100 ring-2 ring-white' : 'opacity-50 hover:opacity-80'}`}
              >
                <img decoding="async" loading="lazy" src={src} srcSet={srcSetOf(src)} sizes="80px" alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </Portal>
}
