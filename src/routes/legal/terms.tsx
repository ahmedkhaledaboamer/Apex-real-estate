import { Link, createFileRoute } from '@tanstack/react-router'

import { LegalPage, type LegalSection } from '@/features/legal/components/LegalPage'
import { CONTACT_EMAIL, OFFICE_ADDRESS } from '@/lib/constants'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/legal/terms')({
  head: () => seo({ title: "Terms of use", description: "The terms that apply when you use the Apex Aora Real Estate website." }), component: Page })

const SECTIONS: LegalSection[] = [
  {
    id: 'about-these-terms',
    title: 'About these terms',
    content: (
      <>
        <p>
          These terms govern your use of this website, operated by <strong>Apex Aora Real Estate LLC</strong>, a real estate brokerage licensed in Dubai
          (Trade Licence No. [Trade Licence No.]; RERA ORN [RERA ORN]), whose office is at {OFFICE_ADDRESS}.
        </p>
        <p>By using the website you accept these terms. If you do not agree, please do not use the website.</p>
      </>
    ),
  },
  {
    id: 'listings',
    title: 'Property listings and information',
    content: (
      <>
        <p>
          Every listing we advertise carries a valid advertising permit (Trakheesi) issued by the Dubai Land Department, and the permit number is shown on the
          listing. We take care to keep information accurate, but:
        </p>
        <ul>
          <li>Prices, sizes, layouts, service charges and availability are provided by owners or developers and may change without notice.</li>
          <li>Images and floor plans may be indicative, and off-plan renderings are artistic impressions.</li>
          <li>A listing is an invitation to make an enquiry, not an offer capable of acceptance.</li>
        </ul>
        <p>You should verify all material facts, including title, through the DLD and your own advisers before committing to a transaction.</p>
      </>
    ),
  },
  {
    id: 'no-advice',
    title: 'No financial or legal advice',
    content: (
      <>
        <p>
          Market data, yield figures, calculators (mortgage, DLD fees, ROI, rent vs buy) and instant estimates on this website are for general information
          only. They are indicative and are not a formal valuation, financial, tax, immigration or legal advice.
        </p>
        <p>A formal valuation for mortgage purposes must be carried out by a RERA-registered valuer appointed by the lender.</p>
      </>
    ),
  },
  {
    id: 'brokerage',
    title: 'Brokerage services and fees',
    content: (
      <>
        <p>
          Our brokerage services are provided under separate written agreements in the form required by RERA — Form A (seller / landlord listing), Form B
          (buyer / tenant), and Form I (agent-to-agent) — and, for sales, a Memorandum of Understanding (Form F). These agreements, not these website terms,
          set out the fees payable.
        </p>
        <p>
          Unless agreed otherwise in writing, commission on sales is typically 2% of the purchase price and on rentals typically 5% of the annual rent, plus
          VAT at 5%. Government fees (such as the DLD transfer fee and trustee office fees) are paid to the relevant authority and are separate from our fees.
        </p>
      </>
    ),
  },
  {
    id: 'your-use',
    title: 'Your use of the website',
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Submit false enquiries or impersonate another person.</li>
          <li>Copy, scrape or republish listings or content without our written consent.</li>
          <li>Interfere with the security or operation of the website, or introduce malicious code.</li>
          <li>Use the website for any unlawful purpose, including in breach of Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    content: (
      <p>
        The Apex Aora name, logo, design, text, photography and software on this website are owned by or licensed to Apex Aora Real Estate LLC. You may view
        and print pages for personal, non-commercial use. Any other use requires our prior written permission.
      </p>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party links and services',
    content: (
      <p>
        The website links to third-party sites such as the DLD, developer pages, map providers and WhatsApp. We are not responsible for their content or
        privacy practices, and a link does not imply endorsement.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    content: (
      <>
        <p>
          To the fullest extent permitted by UAE law, Apex Aora is not liable for any indirect or consequential loss, or for any loss arising from reliance on
          information on this website, including indicative estimates and calculator results.
        </p>
        <p>Nothing in these terms limits liability that cannot be limited under UAE law, including liability for fraud or gross negligence.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy and cookies',
    content: (
      <p>
        Our use of personal data is described in our <Link to="/legal/privacy">privacy policy</Link>, and our use of cookies in our{' '}
        <Link to="/legal/cookies">cookie policy</Link>.
      </p>
    ),
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    content: (
      <p>
        We aim to meet WCAG 2.1 level AA across the website. If you have difficulty using any part of it, email{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Accessibility`}>{CONTACT_EMAIL}</a> and we will provide the information in another format.
      </p>
    ),
  },
  {
    id: 'complaints',
    title: 'Complaints',
    content: (
      <p>
        If you are unhappy with our service, please <Link to="/contact">contact us</Link> and choose “Complaint”. We aim to acknowledge complaints within two
        working days and resolve them within 14 days. If a complaint is not resolved, you may refer it to the Real Estate Regulatory Agency (RERA) through the
        Dubai Land Department.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    content: (
      <p>
        These terms are governed by the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. The courts of Dubai have exclusive
        jurisdiction over any dispute arising from them.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    content: <p>We may update these terms at any time. The version published on this page, with its “last updated” date, applies to your use of the website.</p>,
  },
]

function Page() {
  return (
    <LegalPage
      title="Terms of use"
      sections={SECTIONS}
      intro={<p>Please read these terms carefully. They explain the rules for using the Apex Aora website and how our listings and tools should be relied on.</p>}
    />
  )
}
