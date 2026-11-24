import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Heart, Menu, MessageCircle, Phone, X } from 'lucide-react'

import { Logo } from './Logo'
import { Select } from '@/components/ui/Select'
import { CURRENCIES } from '@/lib/currency'
import type { Currency, Lang } from '@/types'
import { CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_URL } from '@/lib/constants'
import { MEGA, NAV, NAV_TO, T, type NavLink } from '@/mocks/navigation'
import { srcSetOf } from '@/assets/images'

type Props = {
  currency: Currency
  onCurrencyChange: (c: Currency) => void
  lang: Lang
  onLangChange: (l: Lang) => void
  favoritesCount?: number
  onContact?: () => void
}

export function Header({ currency, onCurrencyChange, lang, onLangChange, favoritesCount = 0, onContact }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const t = T[lang]
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const contact = onContact ?? (() => navigate({ to: '/contact' }))

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(null)
    setDrawer(false)
  }, [pathname])

  // "Scrolled past 24px" via an observed sentinel: no scroll listener and no forced layout (reading
  // scrollY during load forced a full synchronous layout of the page).
  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const enter = (key: string) => {
    window.clearTimeout(closeTimer.current)
    setOpen(MEGA[key] ? key : null)
  }
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 120)
  }

  return (
    <>
    {/* Sentinel 24px from the top of the document: when it leaves the viewport, the header is "scrolled". */}
    <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute top-6 left-0 h-px w-px" />
    <header className="sticky top-0 z-40 print:hidden">
      {/* Utility bar: contact, currency, language, licence */}
      <div className="bg-plum text-[12.5px] text-white/80">
        <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-5">
            <a href={CONTACT_PHONE_HREF} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="size-3.5" /> <span dir="ltr">{CONTACT_PHONE}</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 hover:text-white sm:flex">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
            <span className="hidden text-white/50 lg:inline">RERA ORN: [placeholder]</span>
          </div>
          <div className="flex items-center gap-1">
            <Select
              id="aa-currency"
              aria-label="Currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              options={CURRENCIES}
              className="w-auto gap-1 rounded-md px-1.5 py-1 font-medium text-white hover:bg-white/10"
              menuClassName="!w-[120px]"
            />
            <span className="h-3.5 w-px bg-white/20" />
            <div role="group" aria-label="Language" className="flex items-center">
              {(['en', 'ar'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  aria-pressed={lang === l}
                  className={`rounded-md px-2 py-1 font-medium transition-colors duration-150 ${
                    lang === l ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : 'AR'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        onMouseLeave={leave}
        className={`relative border-b transition-[background-color,border-color,box-shadow] duration-200 ${
          scrolled || open
            ? 'border-line/70 bg-paper/95 shadow-soft backdrop-blur-md'
            : 'border-transparent bg-paper'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-5 md:px-8">
          <Logo />
          <nav aria-label="Main" className="hidden items-center xl:flex">
            {NAV.map((item) => (
              <div key={item.key} onMouseEnter={() => enter(item.key)} onFocus={() => enter(item.key)}>
                <Link
                  to={NAV_TO[item.key]}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 ${
                    open === item.key ? 'text-aura' : 'text-plum hover:text-aura'
                  }`}
                  aria-expanded={MEGA[item.key] ? open === item.key : undefined}
                >
                  {t[item.key]}
                  {MEGA[item.key] && (
                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${open === item.key ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/favorites" aria-label="Saved properties" className="relative grid size-10 place-items-center rounded-full text-plum hover:bg-mist">
              <Heart className="size-[18px]" />
              {favoritesCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 grid size-4.5 place-items-center rounded-full bg-aura text-[10px] font-semibold text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              onClick={contact}
              className="bg-aura-gradient hidden h-10 rounded-full px-5 text-[14px] font-semibold whitespace-nowrap text-white shadow-soft transition-[transform,box-shadow] duration-150 hover:shadow-lift active:scale-[0.97] sm:block"
            >
              {t.contact}
            </button>
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-full text-plum hover:bg-mist xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && MEGA[open] && (
            <motion.div
              key={open}
              onMouseEnter={() => enter(open)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-x-0 top-full hidden border-b border-line/70 bg-paper/95 shadow-lift backdrop-blur-xl xl:block"
            >
              <MegaPanel menu={MEGA[open]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-50 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-paper p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full hover:bg-mist">
                  <X className="size-5" />
                </button>
              </div>
              {NAV.map((item) => (
                <Link key={item.key} to={NAV_TO[item.key]} className="border-b border-line/60 py-3.5 text-[17px] font-medium text-plum">
                  {t[item.key]}
                </Link>
              ))}
              <button onClick={contact} className="bg-aura-gradient mt-auto h-12 rounded-full font-semibold text-white">
                {t.contact}
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  )
}

function MegaPanel({ menu }: { menu: (typeof MEGA)[string] }) {
  // The hovered/focused link drives the image card; leaving the panel restores the default.
  const [active, setActive] = useState<NavLink | null>(null)
  const preview = active?.preview ?? menu.feature
  const cardLink = active?.preview ? active : menu.feature.link

  // Preload every preview image so the swap is instant on first hover.
  useEffect(() => {
    for (const col of menu.columns) for (const l of col.links) if (l.preview) new Image().src = l.preview.image
  }, [menu])

  return (
    <div onMouseLeave={() => setActive(null)} className="mx-auto grid max-w-[1280px] grid-cols-[1fr_1fr_1fr_320px] gap-10 px-8 py-8">
      {menu.columns.map((col) => (
        <div key={col.title}>
          <p className="mb-3 text-[12px] font-semibold text-muted">{col.title}</p>
          <ul className="space-y-1">
            {col.links.map((l) => (
              <li key={l.label} onMouseEnter={() => setActive(l)} onFocus={() => setActive(l)}>
                <MenuLink
                  link={l}
                  className={`-mx-2 block rounded-lg px-2 py-1.5 text-[14.5px] transition-colors duration-150 hover:bg-mist hover:text-aura ${
                    active === l ? 'bg-mist text-aura' : 'text-plum'
                  }`}
                >
                  {l.label}
                </MenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <MenuLink link={cardLink} className="group relative isolate aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-plum">
        <AnimatePresence initial={false}>
          <motion.img decoding="async" loading="lazy"
            key={preview.image}
            src={preview.image} srcSet={srcSetOf(preview.image)} sizes="320px"
            alt=""
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={preview.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="font-display text-xl font-semibold">{preview.title}</p>
              <p className="text-[13px] text-white/80">{preview.sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </MenuLink>
    </div>
  )
}

function MenuLink({ link, className, children }: { link: NavLink; className?: string; children: React.ReactNode }) {
  return (
    <Link to={link.to} params={link.params as never} search={link.search as never} className={className}>
      {children}
    </Link>
  )
}
