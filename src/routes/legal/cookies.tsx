import { Link, createFileRoute } from '@tanstack/react-router'

import { CookiePreferences } from '@/features/legal/components/CookiePreferences'
import { LegalPage, type LegalSection } from '@/features/legal/components/LegalPage'
import { CONTACT_EMAIL } from '@/lib/constants'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/legal/cookies')({
  head: () => seo({ title: "Cookie policy", description: "Which cookies we use, why, and how to change your preferences." }), component: Page })

type CookieRow = { name: string; purpose: string; duration: string; type: 'Essential' | 'Analytics' | 'Marketing' }

const COOKIES: CookieRow[] = [
  { name: 'aa-session', purpose: 'Keeps the site secure and your session stable while you browse.', duration: 'Session', type: 'Essential' },
  { name: 'aa-preferences', purpose: 'Remembers your currency and language choice.', duration: '12 months', type: 'Essential' },
  { name: 'aa-cookie-preferences', purpose: 'Stores the cookie choices you make on this page.', duration: '12 months', type: 'Essential' },
  { name: 'aa-favourites', purpose: 'Keeps your saved properties and comparison list in this browser.', duration: 'Session', type: 'Essential' },
  { name: '_ga, _ga_*', purpose: 'Google Analytics: counts visits and shows which pages are used.', duration: '13 months', type: 'Analytics' },
  { name: '_clck, _clsk', purpose: 'Microsoft Clarity: aggregated heatmaps of how pages are used.', duration: '1 day – 12 months', type: 'Analytics' },
  { name: '_fbp', purpose: 'Meta Pixel: measures our ads on Facebook and Instagram.', duration: '3 months', type: 'Marketing' },
  { name: '_gcl_au', purpose: 'Google Ads: measures conversions from our advertising.', duration: '3 months', type: 'Marketing' },
]

function CookieTable() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[16px] bg-white shadow-soft">
      <table className="w-full min-w-[560px] text-start text-[14px]">
        <caption className="sr-only">Cookies used on this website</caption>
        <thead>
          <tr className="border-b border-line/70 bg-mist text-[12.5px] text-muted">
            <th scope="col" className="px-4 py-3 text-start font-semibold">Name</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Purpose</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Duration</th>
            <th scope="col" className="px-4 py-3 text-start font-semibold">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {COOKIES.map((c) => (
            <tr key={c.name} className="align-top">
              <th scope="row" className="px-4 py-3 text-start text-[13px] font-semibold whitespace-nowrap text-plum">{c.name}</th>
              <td className="px-4 py-3 leading-relaxed text-ink/80">{c.purpose}</td>
              <td className="px-4 py-3 whitespace-nowrap text-ink/80">{c.duration}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold text-plum">{c.type}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SECTIONS: LegalSection[] = [
  {
    id: 'what-are-cookies',
    title: 'What cookies are',
    content: (
      <p>
        Cookies are small text files placed on your device when you visit a website. We also use similar technologies such as local storage. Some are
        essential for the site to work; others help us understand usage or measure advertising and are used only with your consent, as required by the UAE
        Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).
      </p>
    ),
  },
  {
    id: 'types',
    title: 'Types of cookies we use',
    content: (
      <>
        <ul>
          <li><strong>Essential</strong> — needed for security, your preferences and saved properties. These cannot be switched off.</li>
          <li><strong>Analytics</strong> — help us see how visitors use the site so we can improve it. Off unless you allow them.</li>
          <li><strong>Marketing</strong> — set by advertising partners to measure campaigns and show relevant ads. Off unless you allow them.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookie-list',
    title: 'Cookies on this website',
    content: (
      <>
        <p>The table below lists the cookies and storage items we use. Third-party cookie names may change; we review this list regularly.</p>
        <CookieTable />
      </>
    ),
  },
  {
    id: 'manage',
    title: 'Manage preferences',
    content: (
      <>
        <p>Choose which optional cookies you allow. Your choice is saved in this browser and you can change it at any time.</p>
        <CookiePreferences />
      </>
    ),
  },
  {
    id: 'browser-settings',
    title: 'Browser controls',
    content: (
      <p>
        You can also block or delete cookies through your browser settings. Blocking essential cookies may stop parts of the site, such as saved properties
        and currency selection, from working.
      </p>
    ),
  },
  {
    id: 'more-information',
    title: 'More information',
    content: (
      <p>
        For details on how we handle personal data, see our <Link to="/legal/privacy">privacy policy</Link>. Questions about cookies can be sent to{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Cookies`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
]

function Page() {
  return (
    <LegalPage
      title="Cookie policy"
      sections={SECTIONS}
      intro={
        <p>
          This policy explains how Apex Aora Real Estate LLC uses cookies and similar technologies on this website, and how you can control them. You can update
          your choices at any time in <a href="#manage">Manage preferences</a>.
        </p>
      }
    />
  )
}
