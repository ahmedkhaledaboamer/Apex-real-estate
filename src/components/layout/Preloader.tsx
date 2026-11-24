/**
 * Brand preloader: the infinity mark draws itself, the wordmark fades in, then the screen lifts away.
 * Pure CSS, no JS: its look is inlined below (styled from the first paint); the exit animation is in
 * styles/index.css, so it lifts ~1.1s after the site stylesheet has been applied.
 * Hidden entirely for prefers-reduced-motion.
 */
// Inlined so the overlay is styled from the first paint, even before the site stylesheet arrives.
const CSS = ".preloader{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:linear-gradient(110deg,#381a4c 0%,#563d96 55%,#275ba8 100%);pointer-events:none}.preloader-inner{display:flex;flex-direction:column;align-items:center}.preloader-mark{display:block;width:132px;height:auto}.preloader-path{stroke-dasharray:1;stroke-dashoffset:1;animation:preloader-draw .6s cubic-bezier(.65,0,.35,1) .05s forwards}.preloader-word{margin:18px 0 0;font-family:'Cormorant Garamond','Times New Roman',serif;font-size:34px;line-height:1.2;font-weight:600;letter-spacing:.02em;color:#fff;opacity:0;transform:translateY(8px);animation:preloader-fade .4s cubic-bezier(.23,1,.32,1) .25s forwards}.preloader-sub{margin:6px 0 0;font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;font-size:11px;line-height:1.5;font-weight:500;letter-spacing:.3em;color:rgb(255 255 255/.6);opacity:0;animation:preloader-fade .4s cubic-bezier(.23,1,.32,1) .35s forwards}@keyframes preloader-draw{to{stroke-dashoffset:0}}@keyframes preloader-fade{to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.preloader{display:none}}@media print{.preloader{display:none}}"

export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="preloader-inner">
        <svg viewBox="0 0 400 180" width="132" height="59" fill="none" className="preloader-mark">
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
