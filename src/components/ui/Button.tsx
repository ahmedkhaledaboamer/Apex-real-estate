import { forwardRef } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'plum' | 'white' | 'outline' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

/** Same recipes the home page already uses (gradient CTA, plum, white-on-dark, outlined pill). */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-aura-gradient text-white shadow-soft hover:brightness-110 hover:shadow-lift',
  plum: 'bg-plum text-white hover:brightness-125',
  white: 'bg-white text-plum hover:bg-mist',
  outline: 'border border-plum/20 text-plum hover:bg-mist',
  ghost: 'text-plum hover:bg-mist',
  whatsapp: 'bg-[#1f9d55] text-white hover:brightness-110',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13.5px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-13 px-7 text-[15px]',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[filter,transform,background-color,box-shadow,color] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest} />
})

/** Router link styled as a button. */
export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: LinkProps & { variant?: ButtonVariant; size?: ButtonSize; className?: string; children?: React.ReactNode }) {
  return <Link {...rest} className={buttonClass(variant, size, className)} />
}

/** Plain anchor (tel:, wa.me, mailto:, downloads) styled as a button. */
export function ButtonAnchor({
  variant,
  size,
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <a {...rest} className={buttonClass(variant, size, className)} />
}
