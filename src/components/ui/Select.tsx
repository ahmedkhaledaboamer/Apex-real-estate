import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Check, ChevronDown } from 'lucide-react'
import { Portal } from '@/components/ui/Portal'

import { cn } from '@/lib/cn'

/**
 * Branded dropdown (listbox) that replaces the native <select>.
 *
 * - Same contract as a select: `value`/`onChange(e => e.target.value)` (controlled) or
 *   `name` + `defaultValue` (uncontrolled, submitted with the form through a hidden input).
 * - Keyboard: ↑/↓, Home/End, Enter/Space, Escape, Tab, type-ahead.
 * - The menu renders in a portal (never clipped by overflow/modals) and flips above when needed.
 * - The menu is anchored to the closest `[data-select-anchor]` ancestor (e.g. the whole labelled
 *   field box) so it lines up with the field, not just the text.
 */

export type SelectOption = string | { value: string; label: string }
export type SelectChangeEvent = { target: { value: string; name?: string } }

type Props = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (e: SelectChangeEvent) => void
  name?: string
  id?: string
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Extra classes for the popover. */
  menuClassName?: string
  /** Hide the chevron (e.g. custom trigger styling). */
  hideChevron?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

const norm = (o: SelectOption) => (typeof o === 'string' ? { value: o, label: o } : o)

export const Select = forwardRef<HTMLButtonElement, Props>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    name,
    id,
    disabled,
    placeholder = 'Select',
    className,
    menuClassName,
    hideChevron,
    ...aria
  },
  ref,
) {
  const items = useMemo(() => options.map(norm), [options])
  const controlled = value !== undefined
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value ?? '')
  const current = controlled ? value : inner
  const selectedIndex = items.findIndex((o) => o.value === current)
  const selected = items[selectedIndex]

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(Math.max(selectedIndex, 0))
  const [pos, setPos] = useState<{ left: number; top: number; width: number; maxHeight: number; above: boolean } | null>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', t: 0 })
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

  const uid = useId()
  const listId = `${uid}-list`
  const optionId = (i: number) => `${uid}-opt-${i}`

  const commit = (i: number) => {
    const o = items[i]
    if (!o) return
    if (!controlled) setInner(o.value)
    if (o.value !== current) onChange?.({ target: { value: o.value, name } })
    setOpen(false)
    buttonRef.current?.focus()
  }

  const place = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    const anchor = (btn.closest('[data-select-anchor]') as HTMLElement | null) ?? btn
    const r = anchor.getBoundingClientRect()
    const gap = 8
    const below = window.innerHeight - r.bottom - gap - 12
    const aboveSpace = r.top - gap - 12
    const wanted = Math.min(items.length * 44 + 12, 320)
    const above = below < Math.min(wanted, 220) && aboveSpace > below
    const maxHeight = Math.max(120, Math.min(320, above ? aboveSpace : below))
    const width = Math.max(r.width, 180)
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8)
    setPos({ left, width, maxHeight, above, top: above ? r.top - gap : r.bottom + gap })
  }, [items.length])

  useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      // The anchor box (e.g. the whole labelled field) counts as "inside": its click toggles the menu itself.
      const anchor = buttonRef.current?.closest('[data-select-anchor]') ?? buttonRef.current
      if (!anchor?.contains(t) && !menuRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Keep the active option in view.
  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open])

  const openMenu = (at = Math.max(selectedIndex, 0)) => {
    if (disabled) return
    setActive(at)
    setOpen(true)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openMenu()
        else setActive((a) => Math.min(a + 1, last))
        return
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openMenu()
        else setActive((a) => Math.max(a - 1, 0))
        return
      case 'Home':
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        return
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(last)
        }
        return
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open) commit(active)
        else openMenu()
        return
      case 'Escape':
        if (open) {
          e.preventDefault()
          e.stopPropagation()
          setOpen(false)
        }
        return
      case 'Tab':
        if (open) setOpen(false)
        return
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const now = Date.now()
          const ta = typeahead.current
          ta.text = now - ta.t > 600 ? e.key.toLowerCase() : ta.text + e.key.toLowerCase()
          ta.t = now
          const start = open ? active : selectedIndex
          const order = [...items.slice(start + 1), ...items.slice(0, start + 1)]
          const hit = order.find((o) => o.label.toLowerCase().startsWith(ta.text))
          if (hit) {
            const i = items.indexOf(hit)
            if (open) setActive(i)
            else commit(i)
          }
        }
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 text-start outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...aria}
      >
        <span className={cn('truncate', !selected && 'text-muted/70')}>{selected?.label ?? placeholder}</span>
        {!hideChevron && (
          <ChevronDown className={cn('size-4 shrink-0 opacity-60 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
        )}
      </button>
      {name !== undefined && <input type="hidden" name={name} value={current} />}

      <Portal>
        <AnimatePresence>
          {open && pos && (
            <motion.ul
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-labelledby={aria['aria-labelledby']}
              aria-label={aria['aria-label']}
              tabIndex={-1}
              initial={{ opacity: 0, y: pos.above ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: pos.above ? 4 : -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'fixed',
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxHeight,
                ...(pos.above ? { bottom: window.innerHeight - pos.top } : { top: pos.top }),
                transformOrigin: pos.above ? 'bottom' : 'top',
              }}
              className={cn(
                'z-[80] overflow-y-auto overscroll-contain rounded-xl border border-line/70 bg-white p-1.5 shadow-lift scrollbar-none',
                menuClassName,
              )}
            >
              {items.map((o, i) => {
                const isSelected = i === selectedIndex
                const isActive = i === active
                return (
                  <li
                    key={o.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => active !== i && setActive(i)}
                    onClick={() => commit(i)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[14.5px] transition-colors duration-100 select-none',
                      isActive ? 'bg-mist text-plum' : 'text-ink',
                      isSelected && 'font-semibold text-plum',
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {isSelected && <Check className="size-4 shrink-0 text-aura" aria-hidden="true" />}
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </Portal>
    </>
  )
})
