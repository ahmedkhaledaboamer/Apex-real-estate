import { Link } from '@tanstack/react-router'

import { LOGO_URL } from '@/assets/images'

/** The glossy infinity mark, cropped out of the supplied logo file, plus wordmark. */
export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Apex Aura home">
      <span className={tone === 'light' ? 'block rounded-lg bg-white px-1.5 py-1' : 'contents'}>
        <span className="relative block w-11 overflow-hidden" style={{ aspectRatio: '1490 / 615' }}>
          {/* The file is pre-cropped to exactly this window (was a CSS crop of the full 2576px artwork). */}
          <img src={LOGO_URL} alt="" width={192} height={79} decoding="async" className="absolute inset-0 h-full w-full mix-blend-multiply" />
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[22px] font-semibold tracking-wide ${tone === 'light' ? 'text-white' : 'text-plum'}`}>
          Apex Aura
        </span>
        <span className={`mt-0.5 text-[9.5px] font-medium tracking-[0.22em] ${tone === 'light' ? 'text-white/60' : 'text-muted'}`}>
          REAL ESTATE · DUBAI
        </span>
      </span>
    </Link>
  )
}
