/**
 * Brand preloader: the infinity mark draws itself, the wordmark fades in, then the screen lifts away.
 * Pure CSS (see `.preloader` in styles/index.css) — no JS, so it is identical in the prerendered HTML and
 * after hydration, shows instantly on first paint and always clears itself (~1.2s).
 * Hidden entirely for prefers-reduced-motion.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-inner">
        <svg viewBox="0 0 400 180" fill="none" className="preloader-mark">
          <defs>
            <linearGradient id="preloader-grad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c58fd6" />
              <stop offset="0.55" stopColor="#ffffff" />
              <stop offset="1" stopColor="#3CB4E8" />
            </linearGradient>
          </defs>
          <path
            className="preloader-path"
            pathLength={1}
            d="M200 90 C 160 40, 120 20, 90 20 C 45 20, 15 52, 15 90 C 15 128, 45 160, 90 160 C 120 160, 160 140, 200 90 C 240 40, 280 20, 310 20 C 355 20, 385 52, 385 90 C 385 128, 355 160, 310 160 C 280 160, 240 140, 200 90 Z"
            stroke="url(#preloader-grad)"
            strokeWidth={12}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <p className="preloader-word">Apex Aora</p>
        <p className="preloader-sub">REAL ESTATE · DUBAI</p>
      </div>
    </div>
  )
}
