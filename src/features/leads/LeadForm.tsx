import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Check } from 'lucide-react'
import { z } from 'zod'

import { submitLead } from '@/api/leads'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import type { Lead, LeadType } from '@/types'

/**
 * Generic lead form used by every enquiry on the site (property enquiry, viewing request,
 * valuation, contact, register interest, callback).
 *
 * Name + phone are always present. Add email / message / date / extra selects through props.
 * Validates with zod, submits through React Query, then shows a success state.
 */

export type ExtraField =
  | { name: string; label: string; kind: 'text'; placeholder?: string; required?: boolean; full?: boolean }
  | { name: string; label: string; kind: 'select'; options: string[]; defaultValue?: string; full?: boolean }

const baseSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Please enter a valid phone number'),
  email: z.union([z.literal(''), z.string().trim().email('Please enter a valid email')]).optional(),
  message: z.string().optional(),
  preferredDate: z.string().optional(),
})

export function LeadForm({
  type,
  context,
  withEmail = true,
  emailRequired = false,
  withMessage = false,
  withDate = false,
  defaultMessage = '',
  extraFields = [],
  submitLabel = 'Send enquiry',
  successText = 'Thanks — an adviser will contact you within one working day.',
  tone = 'outline',
  columns = 1,
  className,
  onSuccess,
}: {
  type: LeadType
  /** Linked ids: propertyId, projectSlug, agentId. */
  context?: Pick<Lead, 'propertyId' | 'projectSlug' | 'agentId'>
  withEmail?: boolean
  emailRequired?: boolean
  withMessage?: boolean
  withDate?: boolean
  defaultMessage?: string
  extraFields?: ExtraField[]
  submitLabel?: string
  successText?: string
  /** "solid" on dark/glass backgrounds, "outline" on white. */
  tone?: 'solid' | 'outline'
  columns?: 1 | 2
  className?: string
  onSuccess?: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mutation = useMutation({ mutationFn: submitLead, onSuccess })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const schema = emailRequired ? baseSchema.extend({ email: z.string().trim().email('Please enter a valid email') }) : baseSchema
    const parsed = schema.safeParse(data)
    const errs: Record<string, string> = {}
    if (!parsed.success) for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message
    for (const f of extraFields) if (f.kind === 'text' && f.required && !data[f.name]?.trim()) errs[f.name] = `Please enter ${f.label.toLowerCase()}`
    setErrors(errs)
    if (Object.keys(errs).length || !parsed.success) return

    const extra = Object.fromEntries(extraFields.map((f) => [f.label, data[f.name] ?? '']))
    mutation.mutate({
      type,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      message: parsed.data.message || undefined,
      preferredDate: parsed.data.preferredDate || undefined,
      extra,
      ...context,
    })
  }

  const full = columns === 2 ? 'sm:col-span-2' : ''

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mutation.isSuccess ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'flex items-center gap-4 rounded-[16px] p-6',
            tone === 'solid' ? 'bg-white/12 text-white backdrop-blur-md' : 'bg-mist text-ink',
            className,
          )}
        >
          <span className={cn('grid size-11 shrink-0 place-items-center rounded-full', tone === 'solid' ? 'bg-white text-plum' : 'bg-plum text-white')}>
            <Check className="size-5" />
          </span>
          <p className="text-[15.5px]">{successText}</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onSubmit={onSubmit}
          className={cn('grid gap-3', columns === 2 && 'sm:grid-cols-2', className)}
        >
          <TextField tone={tone} name="name" label="Full name" placeholder="Your name" autoComplete="name" error={errors.name} />
          <TextField tone={tone} name="phone" type="tel" label="Phone / WhatsApp" placeholder="+971 50 000 0000" autoComplete="tel" error={errors.phone} />
          {withEmail && (
            <TextField
              tone={tone}
              name="email"
              type="email"
              label={emailRequired ? 'Email' : 'Email (optional)'}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
              className={columns === 2 && !withDate ? full : ''}
            />
          )}
          {withDate && <TextField tone={tone} name="preferredDate" type="date" label="Preferred date" min={new Date().toISOString().slice(0, 10)} />}
          {extraFields.map((f) =>
            f.kind === 'select' ? (
              <SelectField key={f.name} tone={tone} name={f.name} label={f.label} options={f.options} defaultValue={f.defaultValue} className={f.full ? full : ''} />
            ) : (
              <TextField key={f.name} tone={tone} name={f.name} label={f.label} placeholder={f.placeholder} error={errors[f.name]} className={f.full ? full : ''} />
            ),
          )}
          {withMessage && <TextAreaField tone={tone} name="message" label="Message" defaultValue={defaultMessage} className={full} />}
          <Button type="submit" variant={tone === 'solid' ? 'white' : 'primary'} size="lg" disabled={mutation.isPending} className={cn('w-full', full)}>
            {mutation.isPending ? 'Sending…' : submitLabel}
          </Button>
          <p className={cn('text-[11.5px] leading-relaxed', tone === 'solid' ? 'text-white/60' : 'text-muted', full)}>
            By sending, you agree to be contacted about this enquiry. See our{' '}
            <Link to="/legal/privacy" className={cn('underline underline-offset-2', tone === 'solid' ? 'hover:text-white' : 'hover:text-plum')}>
              privacy policy
            </Link>
            .
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
