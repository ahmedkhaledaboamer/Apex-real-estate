import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Check } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { InfinityMark } from '@/components/ui/InfinityMark'

const email = z.string().trim().email('Please enter a valid email')

/** Newsletter signup with inline validation and a success state (local only until the API exists). */
export function NewsletterBand() {
  const [error, setError] = useState<string>()
  const [done, setDone] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = email.safeParse(new FormData(e.currentTarget).get('email'))
    if (!parsed.success) return setError(parsed.error.issues[0]?.message)
    setError(undefined)
    setDone(true)
  }

  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)]">
        <InfinityMark className="pointer-events-none absolute -end-24 -bottom-20 -z-10 w-[520px] opacity-20" strokeWidth={14} />
        <div className="grid gap-8 px-6 py-14 md:grid-cols-[1fr_minmax(0,440px)] md:items-end md:px-14 md:py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-[38px] leading-[1.02] font-semibold text-white md:text-[52px]">The Dubai market, monthly</h2>
            <p className="mt-4 text-[16px] text-white/80">Prices, rents, new launches and rule changes in one short email. No spam; unsubscribe any time.</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="done"
                role="status"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-4 rounded-[16px] bg-white/12 p-6 text-white backdrop-blur-md"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-plum">
                  <Check className="size-5" aria-hidden="true" />
                </span>
                <p className="text-[15.5px]">You’re subscribed. The next market update lands in your inbox at the start of the month.</p>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onSubmit={onSubmit} className="grid gap-3">
                <TextField tone="solid" name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" error={error} />
                <Button type="submit" variant="white" size="lg" className="w-full">
                  Subscribe
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
