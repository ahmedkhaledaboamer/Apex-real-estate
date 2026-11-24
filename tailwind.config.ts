/**
 * Apex Aura design tokens — brand colors, fonts, radii, shadows, easing.
 *
 * Tailwind v4 reads the live tokens from the `@theme` block in src/styles/index.css
 * (that is what generates bg-aura, text-plum, font-display, rounded-card, shadow-soft…).
 * This file mirrors them as typed values for TS code that needs raw colors
 * (maps, charts, canvas, meta theme-color). Keep both in sync.
 */
export const brand = {
  colors: {
    aura: '#843f96',
    plum: '#381a4c',
    indigo: '#563d96',
    royal: '#275ba8',
    cyan: '#3cb4e8',
    ink: '#1e1828',
    paper: '#faf8fc',
    line: '#d9cfe3',
    mist: '#f2edf7',
    muted: '#6b6178',
    success: '#1f8a5b',
  },
  fontFamily: {
    display: ['Cormorant Garamond', 'Times New Roman', 'serif'],
    sans: ['Plus Jakarta Sans', 'IBM Plex Sans Arabic', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    arabic: ['IBM Plex Sans Arabic', 'Plus Jakarta Sans', 'sans-serif'],
  },
  borderRadius: {
    card: '16px',
    panel: '24px',
  },
  boxShadow: {
    soft: '0 1px 2px rgb(56 26 76 / 0.04), 0 4px 12px rgb(56 26 76 / 0.06)',
    lift: '0 2px 4px rgb(56 26 76 / 0.05), 0 12px 32px rgb(56 26 76 / 0.12)',
    glass: '0 8px 40px rgb(30 24 40 / 0.18)',
  },
  transitionTimingFunction: {
    'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
} as const

export type BrandColor = keyof typeof brand.colors

export default brand
