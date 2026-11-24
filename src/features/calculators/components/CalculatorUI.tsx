import { useId, useState } from 'react'
import { Info, RotateCcw } from 'lucide-react'

import { Chip } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

/* ------------------------------------------------------------------ */
/*  Shell: inputs on the start side, results on the end side           */
/* ------------------------------------------------------------------ */

export function CalculatorShell({
  title,
  onReset,
  inputs,
  results,
  className,
}: {
  title: string
  onReset: () => void
  inputs: React.ReactNode
  results: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid overflow-hidden rounded-[24px] bg-white shadow-soft lg:grid-cols-[1fr_1fr]', className)}>
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-[28px] leading-tight font-semibold text-plum md:text-[32px]">{title}</h2>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] font-semibold text-aura transition-colors duration-150 hover:bg-mist hover:text-plum"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
        <div className="grid gap-4">{inputs}</div>
      </div>
      <div className="border-t border-line/70 bg-mist/60 p-6 md:p-8 lg:border-t-0 lg:border-s">{results}</div>
    </div>
  )
}

/** Big result figure. The wrapper is a polite live region so screen readers hear updates. */
export function ResultHeadline({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      <p className="text-[13px] font-semibold text-aura">{label}</p>
      <p className="mt-1 text-[34px] leading-tight font-bold text-plum md:text-[40px]">{value}</p>
      {sub && <p className="mt-1 text-[13.5px] text-muted">{sub}</p>}
    </div>
  )
}

/** Key / value list with hairlines. */
export function Breakdown({ rows, className }: { rows: { label: React.ReactNode; value: React.ReactNode; strong?: boolean; note?: string }[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-line/70 border-y border-line/70', className)}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className={cn('text-[14px]', r.strong ? 'font-semibold text-plum' : 'text-ink/80')}>
            {r.label}
            {r.note && <span className="block text-[12px] font-normal text-muted">{r.note}</span>}
          </dt>
          <dd className={cn('shrink-0 text-end text-[14.5px] tabular-nums', r.strong ? 'font-bold text-plum' : 'font-semibold text-ink')}>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Small "indicative only" note under a calculator. */
export function Disclaimer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex gap-2 text-[12px] leading-relaxed text-muted', className)}>
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/** Small uppercase-free group heading inside the inputs column. */
export function InputGroupTitle({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[13px] font-semibold text-plum">{children}</p>
}

/* ------------------------------------------------------------------ */
/*  Number input + synced range slider                                 */
/* ------------------------------------------------------------------ */

const parse = (s: string) => Number(s.replace(/[^0-9.-]/g, ''))

export function NumberSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  inputMax,
  prefix,
  suffix,
  hint,
  decimals = 0,
  className,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  /** Slider range. */
  min: number
  max: number
  step?: number
  /** Highest value accepted when typed (defaults to `max`). */
  inputMax?: number
  prefix?: string
  suffix?: string
  hint?: React.ReactNode
  decimals?: number
  className?: string
}) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const hardMax = inputMax ?? max
  const shown = draft ?? (decimals ? value.toFixed(decimals).replace(/\.?0+$/, '') : formatNumber(Math.round(value)))

  return (
    <div className={className}>
      <div className="rounded-xl border border-line bg-white px-4 py-2.5 transition-[border-color,box-shadow] duration-150 focus-within:border-aura focus-within:shadow-soft">
        <label htmlFor={id} className="block text-[11.5px] font-semibold text-muted">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {prefix && <span className="text-[14px] font-semibold text-muted">{prefix}</span>}
          <input
            id={id}
            type="text"
            inputMode={decimals ? 'decimal' : 'numeric'}
            value={shown}
            onFocus={() => setDraft(shown.replace(/,/g, ''))}
            onChange={(e) => {
              setDraft(e.target.value)
              const n = parse(e.target.value)
              if (Number.isFinite(n)) onChange(Math.min(n, hardMax))
            }}
            onBlur={() => {
              setDraft(null)
              onChange(Math.min(hardMax, Math.max(min, value)))
            }}
            className="w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink tabular-nums outline-none"
          />
          {suffix && <span className="shrink-0 text-[14px] font-semibold text-muted">{suffix}</span>}
        </div>
        <input
          type="range"
          aria-label={`${label} slider`}
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 mb-1 h-1.5 w-full cursor-pointer accent-aura"
        />
      </div>
      {hint && <p className="mt-1 ps-1 text-[12px] text-muted">{hint}</p>}
    </div>
  )
}

/** Pill options (radio-like) using the shared Chip. */
export function ChoiceChips<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-[11.5px] font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o.value} active={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}

export const pct = (n: number, d = 2) => `${(Number.isFinite(n) ? n : 0).toFixed(d)}%`
