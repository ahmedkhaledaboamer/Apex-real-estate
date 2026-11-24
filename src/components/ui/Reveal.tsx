import React from 'react'
import { useReducedMotion } from 'framer-motion'
import { motion } from '@/lib/motion'

/** Subtle scroll reveal: 12px rise + fade, once. Honours reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.28, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Section header: serif title, optional supporting line, optional action on the end side. */
export function SectionHead({
  title,
  sub,
  action,
}: {
  title: React.ReactNode
  sub?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div className="max-w-2xl">
        <h2 className="font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[44px]">{title}</h2>
        {sub && <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
