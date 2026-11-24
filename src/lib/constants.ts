export const SITE_NAME = 'Apex Aura'
export const CONTACT_PHONE = '+971 4 000 0000'
export const CONTACT_PHONE_HREF = 'tel:+97140000000'
export const CONTACT_EMAIL = 'hello@apexaura.ae'
export const OFFICE_ADDRESS = 'Office 1204, Marina Plaza, Dubai Marina, Dubai, UAE'
export const OFFICE_LOCATION = { lat: 25.0772, lng: 55.1393 }
/** Opens the office pin in Google Maps. */
export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}`
/** Placeholder WhatsApp number — replace with the real business number. */
export const WHATSAPP_NUMBER = '97140000000'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const whatsappLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const DEFAULT_CURRENCY = 'AED' as const
export const DEFAULT_LANG = 'en' as const

/** Buyer-side costs (data pack §5). */
export const DLD_TRANSFER_FEE = 0.04
export const AGENCY_COMMISSION = 0.02
export const VAT = 0.05
export const TITLE_DEED_FEE = 580
export const TRUSTEE_FEE_HIGH = 4_000
export const TRUSTEE_FEE_LOW = 2_000
export const MORTGAGE_REGISTRATION = 0.0025
export const MORTGAGE_REGISTRATION_ADMIN = 290
export const GOLDEN_VISA_THRESHOLD = 2_000_000

