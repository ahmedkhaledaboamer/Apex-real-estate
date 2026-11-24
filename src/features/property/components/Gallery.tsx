import { useState } from 'react'
import { Images } from 'lucide-react'

import { Lightbox } from '@/components/media/Lightbox'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { srcSetOf } from '@/assets/images'

/**
 * Desktop: one large photo + 4 thumbnails. Mobile: horizontal swipe strip with snap.
 * Any photo (or "Show all photos") opens the Lightbox.
 */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [current, setCurrent] = useState(0)
  const thumbs = images.slice(1, 5)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const w = el.firstElementChild?.clientWidth ?? el.clientWidth
    setCurrent(Math.min(images.length - 1, Math.round(Math.abs(el.scrollLeft) / (w + 12))))
  }

  return (
    <div className="relative">
      {/* Mobile strip */}
      <div className="relative md:hidden">
        <div onScroll={onScroll} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 scrollbar-none" aria-label={`${title} photos`}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
              className="aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-[16px] bg-mist"
            >
              <img decoding="async" src={src} srcSet={srcSetOf(src)} sizes="88vw" alt="" loading={i === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute end-3 bottom-3 rounded-full bg-ink/60 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
          {current + 1} / {images.length}
        </span>
      </div>

      {/* Desktop grid */}
      <div className={cn('hidden h-[460px] gap-2 overflow-hidden rounded-[24px] md:grid lg:h-[520px]', thumbs.length ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1')}>
        {images.slice(0, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={cn('group relative overflow-hidden bg-mist', i === 0 && thumbs.length > 0 && 'col-span-2 row-span-2')}
          >
            <img decoding="async"
              src={src} srcSet={srcSetOf(src)} sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
              alt={i === 0 ? title : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <Button variant="white" size="sm" onClick={() => setOpen(0)} className="mt-3 shadow-soft md:absolute md:end-4 md:bottom-4 md:mt-0">
        <Images className="size-4" /> Show all photos ({images.length})
      </Button>

      <Lightbox images={images} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} alt={title} />
    </div>
  )
}
