import { Car, GraduationCap, HeartPulse, ShoppingBag, Sparkles, TrainFront, Trees, Waves } from 'lucide-react'

import type { CommunityDetail } from '@/types'

const ICONS: [RegExp, typeof Sparkles][] = [
  [/mall|avenue|retail|shop/i, ShoppingBag],
  [/beach|lagoon|canal|marina|creek|waterfront|yacht|wave|pool/i, Waves],
  [/park|golf|green|sanctuary|garden|cycling|track/i, Trees],
  [/metro|tram|monorail|road|access/i, TrainFront],
  [/school|nurser/i, GraduationCap],
  [/hospital|clinic/i, HeartPulse],
]

const iconFor = (text: string) => ICONS.find(([re]) => re.test(text))?.[1] ?? Sparkles

export function LifestyleList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = iconFor(item)
        return (
          <li key={item} className="flex items-center gap-3 rounded-[16px] bg-white p-4 shadow-soft">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-aura">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-[15px] font-medium text-ink">{item}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function SchoolList({ schools }: { schools: string[] }) {
  return (
    <ul className="divide-y divide-line/70 rounded-[16px] bg-white shadow-soft">
      {schools.map((s) => (
        <li key={s} className="flex items-center gap-3 px-5 py-4 text-[15px] text-ink">
          <GraduationCap className="size-5 shrink-0 text-aura" aria-hidden="true" /> {s}
        </li>
      ))}
    </ul>
  )
}

/** Drive times as proportional bars (scale fixed at 45 minutes so communities read consistently). */
export function CommuteList({ commute }: { commute: CommunityDetail['commute'] }) {
  const scale = Math.max(45, ...commute.map((c) => c.minutes))
  return (
    <ul className="space-y-4 rounded-[16px] bg-white p-5 shadow-soft md:p-6">
      {commute.map((c) => (
        <li key={c.to}>
          <div className="flex items-center justify-between gap-3 text-[14.5px]">
            <span className="flex items-center gap-2 font-medium text-ink">
              <Car className="size-4 text-muted" aria-hidden="true" /> {c.to}
            </span>
            <span className="font-semibold text-plum">{c.minutes} min</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist" aria-hidden="true">
            <div className="h-full rounded-full bg-aura-gradient" style={{ width: `${(c.minutes / scale) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
