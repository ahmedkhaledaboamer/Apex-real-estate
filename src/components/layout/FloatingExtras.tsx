import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Link } from '@tanstack/react-router'

import { WhatsAppIcon } from '@/components/ui/icons'
import { WHATSAPP_URL } from '@/lib/constants'

/** Same key the cookie preference centre (/legal/cookies) uses. */
const COOKIE_PREFS_KEY = 'aa-cookie-preferences'

const hasCookieChoice = () => {
  try {
    return window.localStorage.getItem(COOKIE_PREFS_KEY) !== null
  } catch {
    return false
  }
}

const saveCookieChoice = (all: boolean) => {
  try {
    window.localStorage.setItem(
      COOKIE_PREFS_KEY,
      JSON.stringify({ essential: true, analytics: all, marketing: all, savedAt: new Date().toISOString() }),
    )
  } catch {
    /* storage unavailable (private mode) — banner just closes for this visit */
  }
}

export function FloatingExtras({ showCookieBanner }: { showCookieBanner: boolean }) {
  // Starts hidden on the server and during hydration (no localStorage there); shown after mount if no choice yet.
  const [cookies, setCookies] = useState(false)
  useEffect(() => setCookies(showCookieBanner && !hasCookieChoice()), [showCookieBanner])
  const choose = (all: boolean) => {
    saveCookieChoice(all)
    setCookies(false)
  }

  return (
    <>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Apex Aora on WhatsApp"
        className="bg-aura-gradient fixed end-5 bottom-5 z-40 grid size-16 place-items-center rounded-full p-[3px] shadow-glass transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <span className="grid size-full place-items-center rounded-full bg-[#1f9d55] text-white">
          <WhatsAppIcon className="size-7" />
        </span>
      </a>

      <AnimatePresence>
        {cookies && (
          <motion.div
            role="dialog"
            aria-label="Cookie preferences"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed start-5 bottom-5 z-40 w-[calc(100%-7.5rem)] max-w-[360px] rounded-[16px] border border-line bg-white/95 p-4 shadow-lift backdrop-blur"
          >
            <p className="text-[13.5px] leading-relaxed text-ink">
              We use cookies to remember your saved searches and currency, and to measure site traffic.{' '}
              <Link to="/legal/cookies" className="font-semibold text-aura underline-offset-2 hover:underline">Cookie policy</Link>
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => choose(true)} className="rounded-full bg-plum px-4 py-2 text-[13px] font-semibold text-white transition-[filter] duration-150 hover:brightness-125">
                Accept all
              </button>
              <button onClick={() => choose(false)} className="rounded-full px-4 py-2 text-[13px] font-semibold text-plum transition-colors duration-150 hover:bg-mist">
                Essential only
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
