import { Breadcrumbs, type Crumb } from '@/components/ui/misc'
import { InfinityMark } from '@/components/ui/InfinityMark'
import { cn } from '@/lib/cn'
import { srcSetOf } from '@/assets/images'

/**
 * Header band for inner pages.
 * - Without `image`: plum → royal gradient with the infinity watermark (same recipe as the Valuation band).
 * - With `image`: photo + brand overlay (same recipe as the Hero).
 */
export function PageHero({
  title,
  sub,
  crumbs,
  image,
  children,
  className,
}: {
  title: React.ReactNode
  sub?: React.ReactNode
  crumbs?: Crumb[]
  image?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('relative isolate overflow-hidden', !image && 'bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)]', className)}>
      {image ? (
        <div className="absolute inset-0 -z-10">
          <img decoding="async" src={image} srcSet={srcSetOf(image)} sizes="100vw" {...{ fetchpriority: 'high' }} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgb(56_26_76/0.88)_0%,rgb(86_61_150/0.6)_50%,rgb(39_91_168/0.3)_100%)]" />
        </div>
      ) : (
        <InfinityMark className="pointer-events-none absolute -end-24 -bottom-20 -z-10 w-[620px] opacity-20" strokeWidth={14} />
      )}
      <div className="mx-auto max-w-[1280px] px-5 pt-10 pb-14 md:px-8 md:pt-12 md:pb-20">
        {crumbs && <Breadcrumbs items={crumbs} tone="light" className="mb-8" />}
        {/* CSS entrance so the page title paints immediately. */}
        <div className="animate-rise max-w-3xl">
          <h1 className="font-display text-[42px] leading-[1] font-semibold text-white md:text-[60px]">{title}</h1>
          {sub && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/80 md:text-[17px]">{sub}</p>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
