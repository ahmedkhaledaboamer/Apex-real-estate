import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'

import type { NavLink } from '@/mocks/navigation'
import { Logo } from './Logo'

const COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Buy',
    links: [
      { label: 'Properties for sale', to: '/buy' },
      { label: 'Apartments', to: '/buy', search: { type: 'Apartment' } },
      { label: 'Villas & townhouses', to: '/buy', search: { type: 'Villa' } },
      { label: 'Off-plan projects', to: '/off-plan' },
      { label: 'Mortgage calculator', to: '/tools/mortgage' },
    ],
  },
  {
    title: 'Rent',
    links: [
      { label: 'Properties for rent', to: '/rent' },
      { label: 'Furnished homes', to: '/rent', search: { furnishing: 'furnished' } },
      { label: 'Family villas', to: '/rent', search: { type: 'Villa' } },
      { label: 'Tenant guide', to: '/insights/$articleSlug', params: { articleSlug: 'marina-business-bay-rents-ease' } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Our agents', to: '/agents' },
      { label: 'Careers', to: '/contact' },
      { label: 'Market insights', to: '/insights' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/legal/privacy' },
      { label: 'Terms of use', to: '/legal/terms' },
      { label: 'Cookies', to: '/legal/cookies' },
      { label: 'Complaints', to: '/contact' },
      { label: 'Accessibility', to: '/legal/terms' },
    ],
  },
]

const SOCIAL = ['https://www.instagram.com', 'https://www.linkedin.com', 'https://www.facebook.com', 'https://www.youtube.com']

export function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  return (
    <footer className="bg-plum text-white print:hidden">
      <div className="mx-auto max-w-[1280px] px-5 pt-16 pb-8 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/70">
              A Dubai brokerage for buying, renting and investing with clear data, licensed advisers and no surprises at transfer.
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-white/80">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-white/50" /> Office 1204, Marina Plaza, Dubai Marina, Dubai, UAE</li>
              <li className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-white/50" /> +971 4 000 0000</li>
              <li className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-white/50" /> hello@apexaora.ae</li>
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubscribed(true)
              }}
              className="mt-8 max-w-sm"
            >
              <label htmlFor="nl" className="text-[14px] font-semibold">Quarterly market report, in your inbox</label>
              {subscribed ? (
                <p role="status" className="mt-2 rounded-full bg-white/10 px-4 py-3 text-[14px] text-white/85">Thanks — you're subscribed.</p>
              ) : (
                <div className="mt-2 flex rounded-full bg-white/10 p-1 focus-within:bg-white/15">
                  <input id="nl" type="email" required placeholder="Email address" className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-white outline-none placeholder:text-white/50" />
                  <button className="shrink-0 rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-plum transition-colors duration-150 hover:bg-mist">Subscribe</button>
                </div>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h3 className="text-[14px] font-semibold text-white">{c.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} params={l.params as never} search={l.search as never} className="text-[14px] text-white/65 transition-colors duration-150 hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 rounded-[16px] border border-white/15 p-5 text-[13px] text-white/75 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="w-fit rounded-md bg-white/10 px-2.5 py-1 text-[12px] font-bold tracking-wide text-white">RERA</span>
          <p>
            RERA ORN: <span className="text-white">[placeholder]</span> &nbsp;|&nbsp; Trade Licence: <span className="text-white">[placeholder]</span>. Licensed by the Dubai Land Department. Every listing shows its Trakheesi permit number; agent BRNs can be verified at dubailand.gov.ae.
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/55">© 2026 Apex Aora Real Estate LLC. All rights reserved.</p>
          <ul className="flex gap-2">
            {[Instagram, Linkedin, Facebook, Youtube].map((Icon, i) => (
              <li key={i}>
                <a href={SOCIAL[i]} target="_blank" rel="noreferrer" aria-label={['Instagram', 'LinkedIn', 'Facebook', 'YouTube'][i]} className="grid size-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors duration-150 hover:bg-white/20 hover:text-white">
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
