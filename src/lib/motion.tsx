import { forwardRef, useState } from 'react'
import { m } from 'framer-motion'

import { useIsHydrating } from './hydration'

/**
 * Drop-in replacement for framer-motion's `motion` (LazyMotion-compatible `m` under the hood).
 *
 * Content that is part of the prerendered HTML is already visible when the page loads, so when an
 * element mounts by hydrating server HTML its `initial` state is skipped (`initial={false}` → renders
 * at its target). Hydration then matches the server HTML exactly and nothing flashes
 * "visible → hidden → fade in". Elements mounted later (client navigation, modals…) animate normally.
 */
type MotionMap = typeof m
const cache = new Map<PropertyKey, unknown>()

function wrap(tag: keyof MotionMap) {
  const Base = m[tag] as unknown as React.ComponentType<Record<string, unknown>>
  const Wrapped = forwardRef<unknown, Record<string, unknown>>(function MotionHydrationSafe(props, ref) {
    const hydrating = useIsHydrating()
    // Decided once per mount.
    const [skipInitial] = useState(hydrating)
    return <Base ref={ref} {...props} initial={skipInitial ? false : props.initial} />
  })
  Wrapped.displayName = `motion.${String(tag)}`
  return Wrapped
}

export const motion = new Proxy({} as MotionMap, {
  get(_target, tag: PropertyKey) {
    if (!cache.has(tag)) cache.set(tag, wrap(tag as keyof MotionMap))
    return cache.get(tag)
  },
})
