import { useState } from 'react'
import { Images } from 'lucide-react'

import { Lightbox } from '@/components/media/Lightbox'
import { cn } from '@/lib/cn'
import { srcSetOf } from '@/assets/images'

/** Main image + four thumbnails (desktop mosaic, mobile strip). Every tile opens the Lightbox. */
export function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [main, ...rest] = images
  const thumbs = rest.slice(0, 4)

  return (
    <>
      <div className="grid gap-3 md:h-[520px] md:grid-cols-4 md:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(0)}
          aria-label={`Open ${name} photo 1 of ${images.length}`}
          className="group relative aspect-[16/10] overflow-hidden rounded-[16px] bg-mist md:col-span-2 md:row-span-2 md:aspect-auto"
        >
          <img decoding="async" src={main} srcSet={srcSetOf(main)} sizes="(min-width: 1024px) 60vw, 100vw" {...{ fetchpriority: 'high' }} alt={`${name} render`} className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        </button>

        <div className="flex gap-3 overflow-x-auto scrollbar-none md:contents">
          {thumbs.map((src, i) => {
            const last = i === thumbs.length - 1
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setOpen(i + 1)}
                aria-label={`Open ${name} photo ${i + 2} of ${images.length}`}
                className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-[12px] bg-mist md:h-auto md:w-auto md:rounded-[16px]"
              >
                <img decoding="async" src={src} srcSet={srcSetOf(src)} sizes="auto, (min-width: 1024px) 33vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
                {last && (
                  <span
                    className={cn(
                      'absolute end-3 bottom-3 hidden items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-plum shadow-soft md:inline-flex',
                    )}
                  >
                    <Images className="size-4" aria-hidden="true" /> All {images.length} photos
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <Lightbox images={images} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} alt={name} />
    </>
  )
}
