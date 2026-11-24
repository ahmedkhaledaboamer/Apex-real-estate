import { useId } from 'react'
import { motion } from '@/lib/motion'

import { cn } from '@/lib/cn'

/** Pill tabs with a sliding plum indicator — same look as the Featured properties tabs. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: { key: T; label: React.ReactNode }[]
  value: T
  onChange: (key: T) => void
  label: string
  className?: string
}) {
  const layoutId = useId()
  return (
    <div role="tablist" aria-label={label} className={cn('flex w-fit max-w-full overflow-x-auto rounded-full bg-mist p-1 scrollbar-none', className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            'relative rounded-full px-4 py-2 text-[14px] font-semibold whitespace-nowrap transition-colors duration-150',
            value === t.key ? 'text-white' : 'text-plum hover:text-aura',
          )}
        >
          {value === t.key && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-full bg-plum"
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            />
          )}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
