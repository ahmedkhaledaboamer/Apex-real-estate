import {
  AirVent,
  Baby,
  BedSingle,
  Car,
  Check,
  ConciergeBell,
  CookingPot,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sun,
  Trees,
  Waves,
} from 'lucide-react'

const ICONS: [RegExp, React.ElementType][] = [
  [/pool|lagoon/i, Waves],
  [/gym/i, Dumbbell],
  [/security/i, ShieldCheck],
  [/parking/i, Car],
  [/concierge/i, ConciergeBell],
  [/wardrobe/i, Shirt],
  [/a\/c|air/i, AirVent],
  [/balcony|terrace/i, Sun],
  [/kitchen/i, CookingPot],
  [/smart/i, Smartphone],
  [/maid|driver/i, BedSingle],
  [/spa/i, Flower2],
  [/garden|park/i, Trees],
  [/kids|play/i, Baby],
  [/jogging|track/i, Footprints],
  [/bbq/i, Flame],
]

const iconFor = (name: string) => ICONS.find(([re]) => re.test(name))?.[1] ?? Check

export function Amenities({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((a) => {
        const Icon = iconFor(a)
        return (
          <li key={a} className="flex items-center gap-3 rounded-xl border border-line/70 px-4 py-3 text-[14.5px] font-medium text-ink">
            <Icon className="size-[18px] shrink-0 text-aura" aria-hidden="true" />
            {a}
          </li>
        )
      })}
    </ul>
  )
}
