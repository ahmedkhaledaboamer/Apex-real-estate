import { useEffect, useState } from 'react'
import { Check, Link2, Linkedin } from 'lucide-react'

import { WhatsAppIcon } from '@/components/ui/icons'

const btn =
  'flex w-full items-center gap-3 rounded-full border border-line bg-white px-4 py-2.5 text-[14px] font-semibold text-plum transition-colors duration-150 hover:border-aura hover:text-aura'

/** Copy link (with confirmation), WhatsApp and LinkedIn share. */
export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => setUrl(window.location.href), [])
  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href)
      setCopied(true)
    } catch {
      window.prompt('Copy this link', url || window.location.href)
    }
  }

  return (
    <div>
      <p className="mb-3 text-[12.5px] font-semibold text-muted">Share this article</p>
      <ul className="grid gap-2">
        <li>
          <button type="button" onClick={copy} className={btn}>
            {copied ? <Check className="size-4 text-success" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
        </li>
        <li>
          <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noreferrer" className={btn}>
            <WhatsAppIcon /> WhatsApp
          </a>
        </li>
        <li>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={btn}>
            <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
          </a>
        </li>
      </ul>
    </div>
  )
}
