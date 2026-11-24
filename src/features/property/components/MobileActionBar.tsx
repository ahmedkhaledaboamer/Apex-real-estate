import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/lib/motion'
import { Phone } from 'lucide-react'

import { Button, ButtonAnchor } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'

/**
 * Sticky bottom bar on < lg. Leaves room on the end side for the site's floating WhatsApp button,
 * and hides while the enquiry form is on screen or once the page content has been scrolled past
 * (so it never covers the footer).
 */
export function MobileActionBar({
  telHref,
  whatsappHref,
  agentName,
  endSentinelId,
}: {
  telHref: string
  whatsappHref: string
  agentName: string
  endSentinelId: string
}) {
  const [formVisible, setFormVisible] = useState(false)
  const [pastEnd, setPastEnd] = useState(false)

  useEffect(() => {
    const form = document.getElementById('enquire')
    const end = document.getElementById(endSentinelId)
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === form) setFormVisible(e.isIntersecting)
        if (e.target === end) setPastEnd(e.isIntersecting || e.boundingClientRect.top < 0)
      }
    })
    if (form) io.observe(form)
    if (end) io.observe(end)
    return () => io.disconnect()
  }, [endSentinelId])

  const show = !formVisible && !pastEnd

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-white/95 py-3 ps-4 pe-[100px] shadow-lift backdrop-blur lg:hidden"
        >
          <div className="flex items-center gap-2">
            <ButtonAnchor href={telHref} variant="outline" className="size-11 shrink-0 px-0" aria-label={`Call ${agentName}`}>
              <Phone className="size-4" />
            </ButtonAnchor>
            <ButtonAnchor href={whatsappHref} target="_blank" rel="noreferrer" variant="whatsapp" className="size-11 shrink-0 px-0" aria-label={`WhatsApp ${agentName}`}>
              <WhatsAppIcon />
            </ButtonAnchor>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                const el = document.getElementById('enquire')
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                el?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true })
              }}
            >
              Enquire
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
