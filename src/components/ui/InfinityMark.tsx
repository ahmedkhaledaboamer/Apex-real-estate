/** Outline infinity loop used as a watermark / background motif on dark bands. */
export function InfinityMark({ className = '', strokeWidth = 10 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 400 180" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="aa-inf" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#843F96" />
          <stop offset="0.55" stopColor="#563D96" />
          <stop offset="1" stopColor="#3CB4E8" />
        </linearGradient>
      </defs>
      <path
        d="M200 90 C 160 40, 120 20, 90 20 C 45 20, 15 52, 15 90 C 15 128, 45 160, 90 160 C 120 160, 160 140, 200 90 C 240 40, 280 20, 310 20 C 355 20, 385 52, 385 90 C 385 128, 355 160, 310 160 C 280 160, 240 140, 200 90 Z"
        stroke="url(#aa-inf)"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}
