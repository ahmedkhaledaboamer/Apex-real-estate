import { useEffect } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion } from 'framer-motion'
import { Provider as ReduxProvider } from 'react-redux'

import { queryClient } from '@/api/queryClient'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { FloatingExtras } from '@/components/layout/FloatingExtras'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { CompareBar } from '@/features/favorites/components/CompareBar'
import { useIsHydrating } from '@/lib/hydration'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrency, setLanguage } from '@/store/slices/preferencesSlice'
import appCss from '@/styles/index.css?url'

/** Fonts needed for the first screen — preloaded so text renders once, in the right face. */
const CRITICAL_FONTS = [
  'plus-jakarta-sans-latin-400-normal',
  'plus-jakarta-sans-latin-500-normal',
  'plus-jakarta-sans-latin-600-normal',
  'cormorant-garamond-latin-600-normal',
]

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Apex Aora Real Estate · Dubai' },
      { name: 'description', content: 'Apex Aora Real Estate — buy, rent and invest in Dubai with clear data and RERA-licensed advisers.' },
      { name: 'theme-color', content: '#381a4c' },
      { property: 'og:site_name', content: 'Apex Aora Real Estate' },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ...CRITICAL_FONTS.map((f) => ({ rel: 'preload', href: `/fonts/${f}.woff2`, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const })),
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

// Animation features stream in as their own chunk; components use the lightweight `m` (imported as `motion`).
// They are loaded only once the page has fully loaded and the browser is idle: LazyMotion updates a
// context when features arrive, and an update reaching a section that is still hydrating would make
// React throw that section's server HTML away (React #421). Nothing needs them earlier — prerendered
// content renders in its final state, and interactive animations start after the user acts.
const loadMotionFeatures = () =>
  new Promise<void>((resolve) => {
    const idle = () =>
      'requestIdleCallback' in window ? window.requestIdleCallback(() => resolve(), { timeout: 2000 }) : setTimeout(resolve, 300)
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  }).then(() => import('@/lib/motionFeatures').then((r) => r.default))

const PRELOADER_ONCE =
  "try{if(sessionStorage.getItem('aa-seen'))document.documentElement.classList.add('no-preloader');else sessionStorage.setItem('aa-seen','1')}catch(e){}"

/** The HTML document (rendered on the server at build time, then hydrated). */
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below may add a class to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Show the preloader only on the first page view of a session. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_ONCE }} />
      </head>
      <body>
        <Preloader />
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <LazyMotion features={loadMotionFeatures} strict>
              {children}
            </LazyMotion>
          </QueryClientProvider>
        </ReduxProvider>
        <Scripts />
      </body>
    </html>
  )
}

/** Site shell: Header + page + Footer, plus the floating WhatsApp button, cookie banner and compare tray. */
function RootLayout() {
  const dispatch = useAppDispatch()
  const { currency, language, direction } = useAppSelector((s) => s.preferences)
  const favoritesCount = useAppSelector((s) => s.favorites.ids.length)
  const showCookieBanner = useAppSelector((s) => s.ui.cookieBannerOpen)

  // i18n is not needed for the first paint (nav labels come from JSON), so load it in the background.
  useEffect(() => {
    void import('@/i18n').then((m) => m.default.changeLanguage(language))
  }, [language])

  return (
    <div dir={direction} lang={language} className="min-h-full bg-paper text-ink">
      <Header
        currency={currency}
        onCurrencyChange={(c) => dispatch(setCurrency(c))}
        lang={language}
        onLangChange={(l) => dispatch(setLanguage(l))}
        favoritesCount={favoritesCount}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingExtras showCookieBanner={showCookieBanner} />
      <CompareBar />
      <ScrollProgress />
      <CustomCursor />
    </div>
  )
}

function NotFound() {
  // Unknown URLs are served the app shell (/404.html), whose content area is empty — match it while
  // hydrating, then show the page right after.
  const hydrating = useIsHydrating()
  if (hydrating) return null
  return (
    <Container className="flex flex-col items-center py-28 text-center md:py-36">
      <p className="text-[13px] font-semibold text-aura">404</p>
      <h1 className="mt-2 font-display text-[44px] leading-tight font-semibold text-plum md:text-[60px]">We couldn't find that page</h1>
      <p className="mt-3 max-w-md text-[16px] text-muted">The link may be out of date, or the property may have been sold or let.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/" variant="primary" size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink to="/buy" variant="outline" size="lg">
          Browse properties
        </ButtonLink>
      </div>
    </Container>
  )
}
