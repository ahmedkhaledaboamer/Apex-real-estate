import { forwardRef, useId } from 'react'

import { cn } from '@/lib/cn'
import { Select, type SelectChangeEvent, type SelectOption } from './Select'

/**
 * Labelled field in the site's "stacked label" style (see Hero search / Valuation form).
 * tone="solid"   → white box, for use on dark or glass backgrounds.
 * tone="outline" → white box with a hairline border, for use on white/paper backgrounds.
 */
type Tone = 'solid' | 'outline'

const box = (tone: Tone, invalid?: boolean) =>
  cn(
    'flex flex-col rounded-xl bg-white px-4 py-2.5 transition-[border-color,box-shadow] duration-150',
    tone === 'outline' && 'border border-line focus-within:border-aura focus-within:shadow-soft',
    invalid && 'border-[#c0392b]',
  )
const labelCls = 'text-[11.5px] font-semibold text-muted'
const control = 'w-full min-w-0 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted/70'

type Common = { label: string; tone?: Tone; error?: string; hint?: string; className?: string }

export const TextField = forwardRef<HTMLInputElement, Common & React.InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, tone = 'outline', error, hint, className, id, ...rest },
  ref,
) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={className}>
      <label htmlFor={fid} className={box(tone, !!error)}>
        <span className={labelCls}>{label}</span>
        <input ref={ref} id={fid} aria-invalid={!!error || undefined} className={control} {...rest} />
      </label>
      <FieldNote error={error} hint={hint} />
    </div>
  )
})

type SelectFieldProps = Common & {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (e: SelectChangeEvent) => void
  name?: string
  id?: string
  disabled?: boolean
  placeholder?: string
}

/** Labelled branded dropdown. Same value/onChange contract as a native select. */
export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(function SelectField(
  { label, tone = 'outline', error, hint, className, id, ...rest },
  ref,
) {
  const auto = useId()
  const fid = id ?? auto
  const labelId = `${fid}-label`
  return (
    <div className={className}>
      <div
        data-select-anchor
        onClick={(e) => {
          // Make the whole box a click target, like a native labelled select.
          const btn = e.currentTarget.querySelector('button')
          if (btn && !btn.contains(e.target as Node)) btn.click()
        }}
        className={cn(box(tone, !!error), 'cursor-pointer focus-within:border-aura')}
      >
        <span id={labelId} className={labelCls}>
          {label}
        </span>
        <Select ref={ref} id={fid} aria-labelledby={labelId} aria-invalid={!!error || undefined} className={control} {...rest} />
      </div>
      <FieldNote error={error} hint={hint} />
    </div>
  )
})

export const TextAreaField = forwardRef<HTMLTextAreaElement, Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextAreaField({ label, tone = 'outline', error, hint, className, id, rows = 4, ...rest }, ref) {
    const auto = useId()
    const fid = id ?? auto
    return (
      <div className={className}>
        <label htmlFor={fid} className={box(tone, !!error)}>
          <span className={labelCls}>{label}</span>
          <textarea ref={ref} id={fid} rows={rows} className={cn(control, 'resize-none leading-relaxed')} {...rest} />
        </label>
        <FieldNote error={error} hint={hint} />
      </div>
    )
  },
)

function FieldNote({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <p className="mt-1 ps-1 text-[12px] font-medium text-[#c0392b]">{error}</p>
  if (hint) return <p className="mt-1 ps-1 text-[12px] text-muted">{hint}</p>
  return null
}

/** Pill checkbox / radio chip used for filters. */
export function Chip({
  active,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-150',
        active ? 'border-plum bg-plum text-white' : 'border-line bg-white text-plum hover:border-aura hover:text-aura',
        className,
      )}
      {...rest}
    />
  )
}
