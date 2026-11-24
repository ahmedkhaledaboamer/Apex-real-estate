/**
 * Hand-written inline SVG charts for the calculators.
 * Colours follow the home-page chart: indigo #563D96, aura #843F96, royal #275BA8, cyan #3CB4E8.
 */
import { useId } from 'react'

import { cn } from '@/lib/cn'

export const CHART = { indigo: '#563D96', aura: '#843F96', royal: '#275BA8', cyan: '#3CB4E8', line: '#D9CFE3' } as const

/* ------------------------------------------------------------------ */
/*  Donut                                                              */
/* ------------------------------------------------------------------ */

export function Donut({
  segments,
  label,
  center,
  className,
}: {
  segments: { label: string; value: number; color: string; display: string }[]
  label: string
  center?: React.ReactNode
  className?: string
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1
  const r = 42
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <figure className={cn('flex items-center gap-5', className)} aria-label={label}>
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={r} fill="none" stroke={CHART.line} strokeWidth="12" />
          {segments.map((s) => {
            const len = (Math.max(0, s.value) / total) * c
            const el = (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="12"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
        </svg>
        {center && <div className="absolute inset-0 grid place-items-center text-center">{center}</div>}
      </div>
      <figcaption className="grid gap-2">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-[13px] text-ink/80">
            <svg viewBox="0 0 10 10" className="size-2.5 shrink-0" aria-hidden="true">
              <rect width="10" height="10" rx="3" fill={s.color} />
            </svg>
            <span>
              {s.label} <strong className="font-semibold text-plum">{s.display}</strong>
              <span className="text-muted"> · {Math.round((Math.max(0, s.value) / total) * 100)}%</span>
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  Horizontal bars (RTL-aware: the SVG mirrors in rtl)                */
/* ------------------------------------------------------------------ */

export function BarRows({
  rows,
  label,
  max,
  className,
}: {
  rows: { key: string; label: React.ReactNode; value: number; display: React.ReactNode; color: string }[]
  label: string
  max?: number
  className?: string
}) {
  const top = max ?? Math.max(1, ...rows.map((r) => Math.abs(r.value)))
  return (
    <figure aria-label={label} className={cn('grid gap-3', className)}>
      {rows.map((r) => {
        const w = Math.max(0, Math.min(100, (Math.abs(r.value) / top) * 100))
        return (
          <div key={r.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-ink/80">{r.label}</span>
              <span className="font-semibold text-plum tabular-nums">{r.display}</span>
            </div>
            <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 w-full rtl:-scale-x-100" aria-hidden="true">
              <rect width="100" height="8" rx="4" fill={CHART.line} fillOpacity="0.55" />
              {w > 0 && <rect width={Math.max(w, 1.5)} height="8" rx="4" fill={r.color} />}
            </svg>
          </div>
        )
      })}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  Two-line chart over years                                          */
/* ------------------------------------------------------------------ */

export function LineChart({
  series,
  xLabels,
  label,
  marker,
  className,
}: {
  series: { key: string; label: string; color: string; values: number[]; display: string }[]
  xLabels: string[]
  label: string
  /** Index on the x axis to mark with a dashed line (e.g. break-even). */
  marker?: number | null
  className?: string
}) {
  const gid = useId().replace(/:/g, '')
  const w = 360
  const h = 150
  const all = series.flatMap((s) => s.values)
  const minV = Math.min(0, ...all)
  const maxV = Math.max(1, ...all)
  const n = Math.max(2, xLabels.length)
  const x = (i: number) => (i / (n - 1)) * w
  const y = (v: number) => h - ((v - minV) / (maxV - minV || 1)) * h
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ticks = xLabels.length <= 8 ? xLabels : xLabels.filter((_, i) => i === 0 || i === xLabels.length - 1 || i % Math.ceil(xLabels.length / 6) === 0)

  return (
    <figure aria-label={label} className={className}>
      <svg viewBox={`0 -8 ${w} ${h + 16}`} className="h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`lc-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={series[0]?.color ?? CHART.indigo} stopOpacity="0.18" />
            <stop offset="1" stopColor={series[0]?.color ?? CHART.indigo} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke={CHART.line} strokeDasharray="3 4" strokeWidth="1" />
        ))}
        {minV < 0 && <line x1="0" x2={w} y1={y(0)} y2={y(0)} stroke={CHART.line} strokeWidth="1.5" />}
        {series[0] && <path d={`${path(series[0].values)} L${x(series[0].values.length - 1)},${h} L0,${h} Z`} fill={`url(#lc-${gid})`} />}
        {marker != null && marker >= 0 && (
          <line x1={x(marker)} x2={x(marker)} y1="0" y2={h} stroke={CHART.aura} strokeDasharray="4 4" strokeWidth="1.5" />
        )}
        {series.map((s) => (
          <g key={s.key}>
            <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {s.values.length > 0 && (
              <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="4.5" fill="#fff" stroke={s.color} strokeWidth="2.5" />
            )}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-[13px] text-ink/80">
            <svg viewBox="0 0 16 4" className="h-1 w-4 shrink-0" aria-hidden="true">
              <rect width="16" height="4" rx="2" fill={s.color} />
            </svg>
            {s.label} <strong className="font-semibold text-plum">{s.display}</strong>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
