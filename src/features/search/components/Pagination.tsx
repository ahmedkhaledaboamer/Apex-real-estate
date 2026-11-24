import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/cn'

/** Simple numbered pagination. */
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null
  const btn = 'grid size-10 place-items-center rounded-full text-[14px] font-semibold transition-colors duration-150'
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btn, 'border border-line bg-white text-plum hover:bg-mist disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronLeft className="size-4 rtl:rotate-180" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          aria-label={`Page ${n}`}
          className={cn(btn, n === page ? 'bg-plum text-white' : 'text-plum hover:bg-mist')}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className={cn(btn, 'border border-line bg-white text-plum hover:bg-mist disabled:pointer-events-none disabled:opacity-40')}
      >
        <ChevronRight className="size-4 rtl:rotate-180" />
      </button>
    </nav>
  )
}
