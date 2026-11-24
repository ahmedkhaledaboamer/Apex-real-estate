import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { motion } from '@/lib/motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { z } from 'zod'

import { submitLead } from '@/api/leads'
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Chip, SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { WhatsAppIcon } from '@/components/ui/icons'
import { WHATSAPP_NUMBER, whatsappLink } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { COMMUNITY_DETAILS } from '@/mocks/communities'

/* ------------------------------------------------------------------ */
/*  Model                                                              */
/* ------------------------------------------------------------------ */

export const OTHER_COMMUNITY = 'other'

export type ValuationValues = {
  community: string
  otherCommunity: string
  building: string
  propertyType: string
  beds: string
  size: string
  condition: string
  occupancy: string
  goal: string
  timeline: string
  name: string
  phone: string
  email: string
  message: string
}

export const EMPTY_VALUATION: ValuationValues = {
  community: '',
  otherCommunity: '',
  building: '',
  propertyType: 'Apartment',
  beds: '2',
  size: '',
  condition: 'Good / original',
  occupancy: 'Vacant',
  goal: '',
  timeline: '',
  name: '',
  phone: '',
  email: '',
  message: '',
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Hotel apartment']
const BEDS = [
  { value: '0', label: 'Studio' },
  ...['1', '2', '3', '4', '5', '6'].map((b) => ({ value: b, label: `${b} bed${b === '1' ? '' : 's'}` })),
  { value: '7+', label: '7+ beds' },
]
const CONDITIONS = ['Needs work', 'Good / original', 'Upgraded', 'Fully renovated']
const OCCUPANCY = ['Vacant', 'Tenanted', 'Owner-occupied']
const GOALS = ['Sell', 'Rent it out', 'Just curious']
const TIMELINES = ['As soon as possible', 'Within 3 months', '3–6 months', 'More than 6 months', 'No fixed plan']

const propertySchema = z
  .object({
    community: z.string().min(1, 'Choose a community'),
    otherCommunity: z.string(),
    building: z.string().trim().min(2, 'Enter the building, villa cluster or street'),
    size: z
      .string()
      .trim()
      .regex(/^\d{2,6}$/, 'Enter the size in sq ft (numbers only)')
      .refine((v) => Number(v) >= 150 && Number(v) <= 100_000, 'Size should be between 150 and 100,000 sq ft'),
  })
  .refine((v) => v.community !== OTHER_COMMUNITY || v.otherCommunity.trim().length >= 2, {
    path: ['otherCommunity'],
    message: 'Enter the community name',
  })

const goalsSchema = z.object({
  goal: z.string().min(1, 'Choose what you would like to do'),
  timeline: z.string().min(1, 'Choose a timeline'),
})

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email'),
})

const STEP_SCHEMAS = [propertySchema, goalsSchema, contactSchema] as const
const STEPS = ['Property', 'Your goals', 'Contact'] as const

export function communityLabel(v: Pick<ValuationValues, 'community' | 'otherCommunity'>) {
  if (v.community === OTHER_COMMUNITY) return v.otherCommunity.trim()
  return COMMUNITY_DETAILS.find((c) => c.slug === v.community)?.name ?? ''
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Three-step valuation request (property → goals → contact).
 * Controlled from the parent so a sibling "instant estimate" card can read the inputs.
 */
export function ValuationForm({
  values,
  onChange,
  className,
}: {
  values: ValuationValues
  onChange: (next: ValuationValues) => void
  className?: string
}) {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const reduce = useReducedMotion()
  const mutation = useMutation({ mutationFn: submitLead })

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const set = <K extends keyof ValuationValues>(key: K, value: ValuationValues[K]) => {
    onChange({ ...values, [key]: value })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = (s: number) => {
    const parsed = STEP_SCHEMAS[s].safeParse(values)
    const errs: Record<string, string> = {}
    if (!parsed.success) for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message
    setErrors(errs)
    return parsed.success
  }

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < STEPS.length - 1) return next()
    if (!validate(step)) return
    const bedsLabel = BEDS.find((b) => b.value === values.beds)?.label ?? values.beds
    mutation.mutate({
      type: 'valuation',
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      message: values.message.trim() || undefined,
      extra: {
        Community: communityLabel(values),
        Building: values.building.trim(),
        'Property type': values.propertyType,
        Bedrooms: bedsLabel,
        'Size (sq ft)': values.size.trim(),
        Condition: values.condition,
        Occupancy: values.occupancy,
        Goal: values.goal,
        Timeline: values.timeline,
      },
    })
  }

  if (mutation.isSuccess) {
    const first = values.name.trim().split(' ')[0]
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className={cn('rounded-[16px] bg-white p-6 shadow-soft md:p-10', className)}
      >
        <span className="grid size-14 place-items-center rounded-full bg-plum text-white">
          <Check className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-[34px] leading-[1.05] font-semibold text-plum md:text-[42px]">Thank you, {first}.</h2>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-muted">
          Your valuation request for {values.building.trim()}, {communityLabel(values)} is with our team. A RERA-certified agent will review recent DLD
          transactions in your building and send your valuation within one working day.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['Today', 'We pull comparable sales and rentals for your building.'],
            ['Within 1 working day', 'Your agent calls or WhatsApps you with the valuation.'],
            ['When you are ready', 'Optional visit to confirm condition and finalise the figure.'],
          ].map(([t, b], i) => (
            <li key={t} className="rounded-[16px] bg-mist p-4">
              <p className="text-[12px] font-semibold text-aura">Step {i + 1}</p>
              <p className="mt-1 text-[14.5px] font-semibold text-plum">{t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/sell" variant="primary">
            How selling works
          </ButtonLink>
          <ButtonAnchor
            variant="whatsapp"
            href={whatsappLink(WHATSAPP_NUMBER, `Hi Apex Aora, I just requested a valuation for ${values.building.trim()}, ${communityLabel(values)}.`)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon /> WhatsApp us
          </ButtonAnchor>
        </div>
      </motion.div>
    )
  }

  const communityOptions = [
    { value: '', label: 'Select a community' },
    ...COMMUNITY_DETAILS.map((c) => ({ value: c.slug, label: c.name })),
    { value: OTHER_COMMUNITY, label: 'Other' },
  ]

  return (
    <form noValidate onSubmit={onSubmit} className={cn('rounded-[16px] bg-white p-5 shadow-soft sm:p-6 md:p-8', className)}>
      {/* Step indicator */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {STEPS.map((label, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={label} aria-current={current ? 'step' : undefined} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors duration-200',
                  done ? 'bg-plum text-white' : current ? 'bg-aura-gradient text-white' : 'bg-mist text-muted',
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn('hidden text-[13.5px] font-semibold sm:block', current || done ? 'text-plum' : 'text-muted')}>{label}</span>
              {i < STEPS.length - 1 && <span className={cn('h-px flex-1', done ? 'bg-plum' : 'bg-line')} />}
              <span className="sr-only">{done ? '(completed)' : current ? '(current step)' : ''}</span>
            </li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.fieldset
          key={step}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8"
        >
          <legend className="sr-only">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </legend>
          <p className="text-[12.5px] font-semibold text-aura">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 font-display text-[30px] leading-tight font-semibold text-plum outline-none md:text-[36px]">
            {step === 0 ? 'Tell us about the property' : step === 1 ? 'What would you like to do?' : 'Where should we send it?'}
          </h2>

          {step === 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Community"
                options={communityOptions}
                value={values.community}
                onChange={(e) => set('community', e.target.value)}
                error={errors.community}
                className={values.community === OTHER_COMMUNITY ? '' : 'sm:col-span-2'}
              />
              {values.community === OTHER_COMMUNITY && (
                <TextField
                  label="Community name"
                  placeholder="e.g. Arabian Ranches"
                  value={values.otherCommunity}
                  onChange={(e) => set('otherCommunity', e.target.value)}
                  error={errors.otherCommunity}
                />
              )}
              <TextField
                label="Building / cluster"
                placeholder="e.g. Marina Gate 2, unit 1804"
                value={values.building}
                onChange={(e) => set('building', e.target.value)}
                error={errors.building}
                className="sm:col-span-2"
              />
              <SelectField label="Property type" options={PROPERTY_TYPES} value={values.propertyType} onChange={(e) => set('propertyType', e.target.value)} />
              <SelectField label="Bedrooms" options={BEDS} value={values.beds} onChange={(e) => set('beds', e.target.value)} />
              <TextField
                label="Size (sq ft)"
                inputMode="numeric"
                placeholder="e.g. 1250"
                value={values.size}
                onChange={(e) => set('size', e.target.value.replace(/[^\d]/g, ''))}
                error={errors.size}
                hint="As shown on your title deed or Oqood."
              />
              <SelectField label="Condition" options={CONDITIONS} value={values.condition} onChange={(e) => set('condition', e.target.value)} />
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 ps-1 text-[12.5px] font-semibold text-muted">Occupancy</legend>
                <div className="flex flex-wrap gap-2">
                  {OCCUPANCY.map((o) => (
                    <Chip key={o} active={values.occupancy === o} onClick={() => set('occupancy', o)}>
                      {o}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 space-y-7">
              <fieldset>
                <legend className="mb-3 ps-1 text-[12.5px] font-semibold text-muted">I want to</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={values.goal === g}
                      onClick={() => set('goal', g)}
                      className={cn(
                        'rounded-[16px] border p-4 text-start transition-[border-color,background-color,box-shadow] duration-150',
                        values.goal === g ? 'border-plum bg-mist shadow-soft' : 'border-line bg-white hover:border-aura',
                      )}
                    >
                      <span className="block text-[15.5px] font-semibold text-plum">{g}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-muted">
                        {g === 'Sell' ? 'Achievable sale price and a marketing plan.' : g === 'Rent it out' ? 'Expected annual rent and yield.' : 'A market check, no obligation.'}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.goal && <p className="mt-2 ps-1 text-[12px] font-medium text-[#c0392b]">{errors.goal}</p>}
              </fieldset>
              <fieldset>
                <legend className="mb-3 ps-1 text-[12.5px] font-semibold text-muted">Timeline</legend>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <Chip key={t} active={values.timeline === t} onClick={() => set('timeline', t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
                {errors.timeline && <p className="mt-2 ps-1 text-[12px] font-medium text-[#c0392b]">{errors.timeline}</p>}
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <TextField label="Full name" autoComplete="name" placeholder="Your name" value={values.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
              <TextField
                label="Phone / WhatsApp"
                type="tel"
                autoComplete="tel"
                placeholder="+971 50 000 0000"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                error={errors.phone}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email}
                className="sm:col-span-2"
              />
              <TextAreaField
                label="Anything else? (optional)"
                rows={3}
                placeholder="Upgrades, tenancy end date, service charge, best time to call…"
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          )}
        </motion.fieldset>
      </AnimatePresence>

      {mutation.isError && (
        <p role="alert" className="mt-4 text-[13.5px] font-medium text-[#c0392b]">
          Something went wrong sending your request. Please try again, or WhatsApp us.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line/70 pt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={back}>
            <ArrowLeft className="size-4 rtl:rotate-180" /> Back
          </Button>
        ) : (
          <span className="text-[12.5px] text-muted">Takes about 1 minute</span>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="submit" variant="primary" size="lg">
            Next <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        ) : (
          <Button type="submit" variant="primary" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending…' : 'Get my valuation'}
          </Button>
        )}
      </div>
      {step === STEPS.length - 1 && (
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
          By sending, you agree to be contacted about this valuation. See our{' '}
          <Link to="/legal/privacy" className="font-semibold text-aura hover:underline">
            privacy policy
          </Link>
          .
        </p>
      )}
    </form>
  )
}
