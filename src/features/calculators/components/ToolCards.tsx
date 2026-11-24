import { ArrowRight, Calculator, Landmark, Percent, Scale } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

export type ToolPath = '/tools/mortgage' | '/tools/roi' | '/tools/dld-fees' | '/tools/rent-vs-buy'

export const TOOLS: { to: ToolPath; icon: typeof Calculator; title: string; body: string }[] = [
  { to: '/tools/mortgage', icon: Calculator, title: 'Mortgage calculator', body: 'Monthly repayment, total interest and the cash you need upfront.' },
  { to: '/tools/roi', icon: Percent, title: 'Rental ROI calculator', body: 'Gross and net yield, cash flow and cash-on-cash return.' },
  { to: '/tools/dld-fees', icon: Landmark, title: 'DLD & buying fees', body: 'Every one-off cost on a ready or off-plan purchase, itemised.' },
  { to: '/tools/rent-vs-buy', icon: Scale, title: 'Rent vs buy', body: 'When owning beats renting, year by year, on your assumptions.' },
]

/** Grid of calculator cards. Pass `exclude` to hide the current tool on a tool page. */
export function ToolCards({ exclude, className }: { exclude?: ToolPath; className?: string }) {
  const tools = TOOLS.filter((t) => t.to !== exclude)
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2', tools.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3', className)}>
      {tools.map((t, i) => (
        <li key={t.to}>
          <Reveal delay={i * 0.04} className="h-full">
            <Link to={t.to} className="group flex h-full flex-col rounded-[16px] bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-full bg-mist text-indigo transition-colors duration-150 group-hover:bg-plum group-hover:text-white">
                <t.icon className="size-5" strokeWidth={1.6} />
              </span>
              <span className="mt-5 block font-display text-[26px] leading-tight font-semibold text-plum">{t.title}</span>
              <span className="mt-2 block text-[14.5px] leading-relaxed text-muted">{t.body}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-aura group-hover:text-plum">
                Open calculator <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
