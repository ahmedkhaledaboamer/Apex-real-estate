import { Link, createFileRoute } from '@tanstack/react-router'

import { LegalPage, type LegalSection } from '@/features/legal/components/LegalPage'
import { CONTACT_EMAIL, CONTACT_PHONE, OFFICE_ADDRESS } from '@/lib/constants'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/legal/privacy')({
  head: () => seo({ title: "Privacy policy", description: "How Apex Aora Real Estate collects, uses and protects your personal data under UAE law." }), component: Page })

const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    content: (
      <>
        <p>
          This website is operated by <strong>Apex Aora Real Estate LLC</strong> (“Apex Aora”, “we”, “us”), a real estate brokerage licensed in the Emirate of
          Dubai under Trade Licence No. [Trade Licence No.] and registered with the Real Estate Regulatory Agency (RERA) under Office Registration Number (ORN)
          [RERA ORN].
        </p>
        <p>
          Our registered office is {OFFICE_ADDRESS}. For the purposes of the UAE Personal Data Protection Law, Federal Decree-Law No. 45 of 2021 (“PDPL”), Apex
          Aora is the controller of the personal data described in this policy.
        </p>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: 'Personal data we collect',
    content: (
      <>
        <p>We collect only the information we need to help you buy, sell, rent or invest in property:</p>
        <h3>Information you give us</h3>
        <ul>
          <li>Contact details: name, phone / WhatsApp number, email address.</li>
          <li>Enquiry details: the properties, communities, budgets and timelines you tell us about, and any messages you send.</li>
          <li>Property details for valuations: address, building, size, condition and occupancy status.</li>
          <li>
            Know-your-customer (KYC) documents when a transaction proceeds: passport, Emirates ID, visa, proof of address and, where required, source-of-funds
            information.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>Device and usage data: IP address, browser type, pages viewed and referring site.</li>
          <li>
            Preferences stored on your device, such as currency, language and saved properties. See our <Link to="/legal/cookies">cookie policy</Link>.
          </li>
        </ul>
        <h3>Information from third parties</h3>
        <ul>
          <li>Property portals and partner agencies that pass on your enquiry.</li>
          <li>Public registers such as Dubai Land Department (DLD) title and transaction data, used to verify ownership and prepare valuations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use your data',
    content: (
      <>
        <ul>
          <li>To respond to enquiries, arrange viewings and send property recommendations you asked for.</li>
          <li>To prepare valuations and market appraisals.</li>
          <li>To perform our brokerage agreements (RERA Form A, Form B, Form F / MOU) and to facilitate transfers at a Real Estate Registration Trustee office.</li>
          <li>To meet our legal obligations, including anti-money laundering checks under Federal Decree-Law No. 20 of 2018 and related regulations.</li>
          <li>To send market updates and newsletters, only where you have agreed or where permitted by law; you can opt out at any time.</li>
          <li>To keep our website secure and improve how it works.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'legal-basis',
    title: 'Legal basis for processing',
    content: (
      <>
        <p>Under the PDPL we process personal data on one or more of the following grounds:</p>
        <ul>
          <li><strong>Consent</strong> — for example, marketing messages and non-essential cookies.</li>
          <li><strong>Contract</strong> — to take steps at your request before entering into, or to perform, a brokerage agreement.</li>
          <li><strong>Legal obligation</strong> — KYC, AML and record-keeping duties set by UAE law, RERA and the DLD.</li>
          <li><strong>Legitimate interests</strong> — running and protecting our business, where those interests are not overridden by your rights.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share data with',
    content: (
      <>
        <p>We never sell your personal data. We share it only where necessary with:</p>
        <ul>
          <li>The other party to a transaction, their agent and conveyancer, to the extent needed to complete the deal.</li>
          <li>Developers, for off-plan reservations and No Objection Certificates (NOCs).</li>
          <li>Government authorities, including the DLD, RERA and Real Estate Registration Trustee offices.</li>
          <li>Mortgage brokers and banks, only when you ask us to introduce you.</li>
          <li>Service providers who host our website, CRM and communications, under written data-processing terms.</li>
          <li>Law enforcement or regulators where required by law.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International transfers',
    content: (
      <p>
        Some of our service providers may store data outside the UAE. Where this happens we transfer data only to jurisdictions with adequate protection, or
        under safeguards permitted by Articles 22 and 23 of the PDPL and any implementing regulations, such as contractual clauses.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    content: (
      <>
        <p>We keep personal data only as long as needed for the purposes above:</p>
        <ul>
          <li>Enquiries that do not lead to a transaction: up to 24 months after our last contact.</li>
          <li>Transaction and KYC records: at least five years after the transaction, as required by UAE AML rules.</li>
          <li>Marketing preferences: until you withdraw consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    content: (
      <>
        <p>Subject to the PDPL, you have the right to:</p>
        <ul>
          <li>Obtain information about, and a copy of, the personal data we hold about you.</li>
          <li>Ask us to correct inaccurate or incomplete data.</li>
          <li>Ask us to erase data, where we no longer need it and no legal obligation requires us to keep it.</li>
          <li>Restrict or object to certain processing, including direct marketing.</li>
          <li>Withdraw consent at any time, without affecting earlier processing.</li>
          <li>Request transfer of your data to another controller in a structured, machine-readable format.</li>
        </ul>
        <p>
          To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may ask you to verify your identity and will
          respond within 30 days. You may also lodge a complaint with the UAE Data Office.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <p>
        We use technical and organisational measures appropriate to the risk, including encrypted connections, role-based access to our CRM, and staff
        training. KYC documents are stored separately with restricted access. No system is perfectly secure; if we become aware of a breach affecting your
        data we will notify you and the UAE Data Office as required by law.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: <p>We may update this policy from time to time. The “last updated” date at the top shows when it was last revised; significant changes will be highlighted on this page.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    content: (
      <>
        <p>Data protection contact: [Data Protection Officer name]</p>
        <ul>
          <li>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
          <li>Phone: <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</a></li>
          <li>Post: {OFFICE_ADDRESS}</li>
        </ul>
      </>
    ),
  },
]

function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      sections={SECTIONS}
      intro={
        <p>
          Your privacy matters to us. This policy explains what personal data Apex Aora collects when you use our website or services, why we collect it, how
          we protect it and the choices you have.
        </p>
      }
    />
  )
}
