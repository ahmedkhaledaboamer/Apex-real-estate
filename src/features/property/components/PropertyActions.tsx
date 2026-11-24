import { useEffect, useState } from 'react'
import { Check, Heart, Scale, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useCompare, useFavorite } from '@/features/favorites/hooks'
import { cn } from '@/lib/cn'

/** Save / compare / share buttons for the property header. */
export function PropertyActions({ id, title }: { id: string; title: string }) {
  const fav = useFavorite(id)
  const cmp = useCompare(id)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(t)
  }, [copied])

  const share = async () => {
    const url = window.location.href
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: `${title} — Apex Aora`, url })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={fav.toggle} aria-pressed={fav.favorite}>
        <Heart className={cn('size-4', fav.favorite && 'fill-aura text-aura')} />
        {fav.favorite ? 'Saved' : 'Save'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={cmp.toggle}
        aria-pressed={cmp.inCompare}
        disabled={cmp.full}
        title={cmp.full ? 'Your compare list is full (4 properties). Remove one to add this.' : undefined}
        className={cn(cmp.inCompare && 'bg-mist')}
      >
        {cmp.inCompare ? <Check className="size-4" /> : <Scale className="size-4" />}
        {cmp.inCompare ? 'In compare' : cmp.full ? 'Compare full' : 'Compare'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => void share()}>
        {copied ? <Check className="size-4 text-success" /> : <Share2 className="size-4" />}
        {copied ? 'Link copied' : 'Share'}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
