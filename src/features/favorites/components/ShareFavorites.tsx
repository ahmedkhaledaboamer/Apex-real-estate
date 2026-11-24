import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button, ButtonAnchor } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { whatsappLink } from '@/lib/constants'
import type { Listing } from '@/types'

export function listingUrl(l: Listing) {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/${l.kind === 'rent' ? 'rent' : 'buy'}/${l.id}`
}

/** Share the saved list as plain text (clipboard) or via WhatsApp. */
export function ShareFavorites({ items }: { items: Listing[] }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(t)
  }, [copied])

  const text = ['My saved properties on Apex Aora:', ...items.map((l, i) => `${i + 1}. ${l.title} (${l.community}) – ${listingUrl(l)}`)].join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copy}>
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        {copied ? 'Copied' : 'Copy list'}
      </Button>
      <ButtonAnchor href={whatsappLink('', text)} target="_blank" rel="noreferrer" variant="whatsapp" size="sm">
        <WhatsAppIcon /> Share
      </ButtonAnchor>
      <span role="status" className="sr-only">
        {copied ? 'List copied to clipboard' : ''}
      </span>
    </div>
  )
}
