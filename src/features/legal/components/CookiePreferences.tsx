import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Check, Lock } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export const COOKIE_PREFS_KEY = 'aa-cookie-preferences'

type Prefs = { analytics: boolean; marketing: boolean }

const DEFAULTS: Prefs = { analytics: false, marketing: false }

function readPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(COOKIE_PREFS_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Prefs>
    return { analytics: parsed.analytics === true, marketing: parsed.marketing === true }
  } catch {
    return DEFAULTS
  }
}

const CATEGORIES: { key: 'essential' | keyof Prefs; title: string; body: string }[] = [
  { key: 'essential', title: 'Essential', body: 'Needed for the site to work: security, your currency and language choice, saved properties and this preference itself. Always on.' },
  { key: 'analytics', title: 'Analytics', body: 'Helps us understand which pages are used so we can improve them. Data is aggregated and not used to identify you.' },
  { key: 'marketing', title: 'Marketing', body: 'Lets us measure our advertising and show relevant Apex Aora ads on other sites and social platforms.' },
]

/** Cookie preference centre — saved to localStorage. */
export function CookiePreferences() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => setPrefs(readPrefs()), [])

  useEffect(() => {
    if (!saved) return
    const t = window.setTimeout(() => setSaved(false), 3000)
    return () => window.clearTimeout(t)
  }, [saved])

  const save = (next: Prefs) => {
    setPrefs(next)
    try {
      window.localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify({ ...next, essential: true, savedAt: new Date().toISOString() }))
    } catch {
      /* storage unavailable (private mode) — keep the in-memory choice */
    }
    setSaved(true)
  }

  return (
    <div className="mt-6 rounded-[16px] bg-white p-5 shadow-soft md:p-6">
      <ul className="divide-y divide-line/70">
        {CATEGORIES.map((c) => {
          const locked = c.key === 'essential'
          const on = locked ? true : prefs[c.key as keyof Prefs]
          const id = `cookie-${c.key}`
          return (
            <li key={c.key} className="flex items-start justify-between gap-5 py-4 first:pt-0">
              <div>
                <p id={`${id}-label`} className="flex items-center gap-2 text-[15.5px] font-semibold text-plum">
                  {c.title}
                  {locked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11.5px] font-semibold text-muted">
                      <Lock className="size-3" /> Always on
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{c.body}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-labelledby={`${id}-label`}
                disabled={locked}
                onClick={() => !locked && setPrefs((p) => ({ ...p, [c.key]: !on }))}
                className={cn(
                  'relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-150 disabled:cursor-not-allowed',
                  on ? 'bg-plum' : 'bg-line',
                  locked && 'opacity-60',
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 size-5 rounded-full bg-white shadow-soft transition-[inset-inline-start] duration-150',
                    on ? 'start-6' : 'start-1',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line/70 pt-5">
        <Button variant="primary" onClick={() => save(prefs)}>
          Save preferences
        </Button>
        <Button variant="outline" onClick={() => save({ analytics: true, marketing: true })}>
          Accept all
        </Button>
        <Button variant="ghost" onClick={() => save(DEFAULTS)}>
          Essential only
        </Button>
        <AnimatePresence>
          {saved && (
            <motion.span
              role="status"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-success"
            >
              <Check className="size-4" /> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
