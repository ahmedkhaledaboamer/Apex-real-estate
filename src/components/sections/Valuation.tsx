import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Check } from 'lucide-react'

import { SelectField } from '@/components/ui/Field'
import { InfinityMark } from '@/components/ui/InfinityMark'

export function Valuation() {
  const [sent, setSent] = useState(false)
  return (
    <section className="px-5 md:px-8">
      <div className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-plum)_0%,var(--color-indigo)_55%,var(--color-royal)_100%)] px-6 py-12 md:px-12 md:py-16">
        <InfinityMark className="pointer-events-none absolute -end-24 -bottom-16 -z-10 w-[640px] opacity-25" strokeWidth={14} />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <h2 className="font-display text-[38px] leading-[1.05] font-semibold text-white md:text-[52px]">
              What is your home worth today?
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">
              A free valuation from a RERA-certified agent, backed by DLD transactions in your building over the last 12 months. Back to you within one working day.
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-4 rounded-[16px] bg-white/12 p-6 text-white backdrop-blur-md"
                role="status"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-plum">
                  <Check className="size-5" />
                </span>
                <p className="text-[16px]">Thanks. An agent will WhatsApp you within one working day.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="grid gap-3 rounded-[16px] border border-white/20 bg-white/10 p-3 backdrop-blur-md sm:grid-cols-2"
              >
                <Input label="Property address" placeholder="Building, community" className="sm:col-span-2" />
                <SelectField tone="solid" name="propertyType" label="Property type" options={['Apartment', 'Villa', 'Townhouse', 'Penthouse']} />
                <Input label="Phone / WhatsApp" placeholder="+971 50 000 0000" type="tel" />
                <button
                  type="submit"
                  className="h-13 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-plum transition-[transform,background-color] duration-150 hover:bg-mist active:scale-[0.98] sm:col-span-2"
                >
                  Get my free valuation
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Input({ label, className = '', ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col rounded-xl bg-white px-4 py-2.5 ${className}`}>
      <span className="text-[11.5px] font-semibold text-muted">{label}</span>
      <input {...rest} className="bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted/70" />
    </label>
  )
}
