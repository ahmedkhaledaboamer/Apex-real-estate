import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/cn'

/** Small rounded label, e.g. status / category. */
export function Badge({ className, tone = 'mist', children }: { className?: string; tone?: 'mist' | 'white' | 'plum' | 'success'; children: React.ReactNode }) {
  const tones = {
    mist: 'bg-mist text-plum',
    white: 'bg-white/95 text-plum shadow-soft',
    plum: 'bg-plum text-white',
    success: 'bg-white/95 text-success shadow-soft',
  }
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold', tones[tone], className)}>{children}</span>
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded bg-mist', className)} />
}

export type Crumb = { label: string; to?: LinkProps['to']; params?: LinkProps['params'] }

/** Breadcrumb trail. Use tone="light" on top of dark PageHero bands. */
export function Breadcrumbs({ items, tone = 'dark', className }: { items: Crumb[]; tone?: 'dark' | 'light'; className?: string }) {
  const base = tone === 'light' ? 'text-white/70' : 'text-muted'
  const hover = tone === 'light' ? 'hover:text-white' : 'hover:text-aura'
  const current = tone === 'light' ? 'text-white' : 'text-plum'
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[13px]', className)}>
      <ol className={cn('flex flex-wrap items-center gap-1.5', base)}>
        <li>
          <Link to="/" className={hover}>
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 opacity-60 rtl:rotate-180" />
            {c.to && i < items.length - 1 ? (
              <Link to={c.to} params={c.params as never} className={hover}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn('font-medium', current)}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Empty / error state block. */
export function EmptyState({ title, body, action, className }: { title: string; body?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center rounded-[16px] border border-line bg-white px-6 py-16 text-center', className)}>
      <p className="font-display text-[28px] font-semibold text-plum">{title}</p>
      {body && <p className="mt-2 max-w-md text-[15px] text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/** White content card used across inner pages. */
export function Card({ className, children, as: As = 'div' }: { className?: string; children: React.ReactNode; as?: 'div' | 'section' | 'article' | 'aside' }) {
  return <As className={cn('rounded-[16px] bg-white p-6 shadow-soft md:p-8', className)}>{children}</As>
}

/** Standard page container width + padding. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto max-w-[1280px] px-5 md:px-8', className)}>{children}</div>
}

/** Key/value stat used in fact grids. */
export function Stat({ label, value, sub, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[20px] font-bold text-plum">{value}</dd>
      {sub && <dd className="text-[12px] text-muted">{sub}</dd>}
    </div>
  )
}
