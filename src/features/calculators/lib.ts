/**
 * Pure property-finance calculations used by the /tools and /invest pages.
 * No React here: every function is deterministic and typed so it can be unit-tested
 * and reused by the API later. All money values are AED.
 *
 * Figures are indicative. Fee constants come from `lib/constants.ts` (data pack §5).
 */
import {
  AGENCY_COMMISSION,
  DLD_TRANSFER_FEE,
  GOLDEN_VISA_THRESHOLD,
  MORTGAGE_REGISTRATION,
  MORTGAGE_REGISTRATION_ADMIN,
  TITLE_DEED_FEE,
  TRUSTEE_FEE_HIGH,
  TRUSTEE_FEE_LOW,
  VAT,
} from '@/lib/constants'

/* ------------------------------------------------------------------ */
/*  Local assumptions (indicative, not in shared constants)            */
/* ------------------------------------------------------------------ */

/** Bank valuation fee, typically AED 2,500–3,500 + VAT. */
export const VALUATION_FEE = 3_000
/** Bank arrangement / processing fee: up to 1% of the loan (+ VAT). */
export const BANK_ARRANGEMENT_PCT = 0.01
/** DLD knowledge + innovation fees (small fixed amounts, indicative). */
export const DLD_KNOWLEDGE_FEES = 20
/** Oqood (off-plan) registration admin fee, indicative; varies by developer and unit type. */
export const OQOOD_ADMIN_FEE = 1_150
/** Price below which the lower trustee-office fee applies. */
export const TRUSTEE_THRESHOLD = 500_000
/** Seller-side agency fee used in the rent-vs-buy sale assumption. */
export const SELLING_COST_PCT = AGENCY_COMMISSION * (1 + VAT)
/** Typical maximum mortgage term in the UAE. */
export const MAX_TERM_YEARS = 25

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const safe = (n: number) => (Number.isFinite(n) ? n : 0)

/* ------------------------------------------------------------------ */
/*  Mortgage                                                           */
/* ------------------------------------------------------------------ */

/** Monthly repayment on a standard capital-and-interest loan. `annualRate` is a percentage (e.g. 4.25). */
export function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const n = Math.round(years * 12)
  if (principal <= 0 || n <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return safe((principal * r) / (1 - Math.pow(1 + r, -n)))
}

export type AmortisationYear = { year: number; principal: number; interest: number; balance: number }

/** Principal / interest paid in each year of the loan, and the balance left at the end of the year. */
export function amortisationByYear(principal: number, annualRate: number, years: number): AmortisationYear[] {
  const pay = monthlyPayment(principal, annualRate, years)
  const r = annualRate / 100 / 12
  const rows: AmortisationYear[] = []
  let balance = principal
  for (let y = 1; y <= Math.round(years); y++) {
    let p = 0
    let i = 0
    for (let m = 0; m < 12 && balance > 0.005; m++) {
      const interest = balance * r
      const capital = Math.min(balance, pay - interest)
      i += interest
      p += capital
      balance -= capital
    }
    rows.push({ year: y, principal: p, interest: i, balance: Math.max(0, balance) })
  }
  return rows
}

/** Outstanding balance after `monthsPaid` payments. */
export function balanceAfter(principal: number, annualRate: number, years: number, monthsPaid: number): number {
  const n = Math.round(years * 12)
  if (monthsPaid >= n) return 0
  const r = annualRate / 100 / 12
  const pay = monthlyPayment(principal, annualRate, years)
  if (r === 0) return Math.max(0, principal - pay * monthsPaid)
  const g = Math.pow(1 + r, monthsPaid)
  return Math.max(0, principal * g - (pay * (g - 1)) / r)
}

export type MortgageResult = {
  loan: number
  downPayment: number
  monthly: number
  totalInterest: number
  totalPaid: number
}

export function mortgageSummary(price: number, downPct: number, annualRate: number, years: number): MortgageResult {
  const downPayment = price * (downPct / 100)
  const loan = Math.max(0, price - downPayment)
  const monthly = monthlyPayment(loan, annualRate, years)
  const totalPaid = monthly * Math.round(years * 12)
  return { loan, downPayment, monthly, totalInterest: Math.max(0, totalPaid - loan), totalPaid }
}

/** Typical minimum down payment (% of price). UAE Central Bank caps; banks may ask for more. */
export function typicalMinDownPct(price: number, residency: 'expat' | 'national' | 'non-resident'): number {
  if (residency === 'national') return price > 5_000_000 ? 30 : 15
  if (residency === 'non-resident') return price > 5_000_000 ? 40 : 25
  return price > 5_000_000 ? 30 : 20
}

/* ------------------------------------------------------------------ */
/*  Purchase costs                                                     */
/* ------------------------------------------------------------------ */

export type CostItem = { key: string; label: string; amount: number; note?: string; payer: string }

export type PurchaseCostOptions = {
  /** Buying with a mortgage. */
  mortgage?: boolean
  loanAmount?: number
  /** Off-plan purchase from the developer (Oqood registration instead of a title-deed transfer). */
  offPlan?: boolean
  /** Buyer pays a 2% agency fee (usually not charged on off-plan bought directly from the developer). */
  agency?: boolean
  /** Include the bank arrangement fee (up to 1% of the loan). */
  arrangementFee?: boolean
}

/** Trustee-office fee for a ready transfer, before VAT. */
export const trusteeFee = (price: number) => (price < TRUSTEE_THRESHOLD ? TRUSTEE_FEE_LOW : TRUSTEE_FEE_HIGH)

/** Itemised one-off buyer costs on top of the price. */
export function purchaseCosts(price: number, opts: PurchaseCostOptions = {}): CostItem[] {
  const { mortgage = false, offPlan = false, agency = !offPlan, arrangementFee = true } = opts
  const loan = mortgage ? Math.max(0, opts.loanAmount ?? 0) : 0
  const items: CostItem[] = []

  if (offPlan) {
    items.push({
      key: 'oqood',
      label: 'DLD Oqood registration (4%)',
      amount: price * DLD_TRANSFER_FEE,
      note: 'Paid to DLD, usually collected through the developer',
      payer: 'Buyer',
    })
    items.push({ key: 'oqood-admin', label: 'Oqood admin fee', amount: OQOOD_ADMIN_FEE, note: 'Indicative; varies by developer', payer: 'Buyer' })
  } else {
    items.push({ key: 'dld', label: 'DLD transfer fee (4%)', amount: price * DLD_TRANSFER_FEE, note: 'Paid to Dubai Land Department', payer: 'Buyer (by market practice)' })
    items.push({ key: 'title', label: 'Title deed issuance', amount: TITLE_DEED_FEE, payer: 'Buyer' })
    const trustee = trusteeFee(price)
    items.push({
      key: 'trustee',
      label: `Trustee office fee (${price < TRUSTEE_THRESHOLD ? 'under' : 'AED 500K and over'}) + VAT`,
      amount: trustee * (1 + VAT),
      note: price < TRUSTEE_THRESHOLD ? 'AED 2,000 + VAT for prices under AED 500K' : 'AED 4,000 + VAT for prices of AED 500K and above',
      payer: 'Buyer',
    })
  }
  items.push({ key: 'knowledge', label: 'DLD knowledge & innovation fees', amount: DLD_KNOWLEDGE_FEES, note: 'Small fixed fees, indicative', payer: 'Buyer' })

  if (agency) {
    items.push({ key: 'agency', label: 'Agency commission (2%) + VAT', amount: price * AGENCY_COMMISSION * (1 + VAT), payer: 'Buyer' })
  }

  if (mortgage && loan > 0) {
    items.push({
      key: 'mortgage-reg',
      label: 'Mortgage registration (0.25% of loan + AED 290)',
      amount: loan * MORTGAGE_REGISTRATION + MORTGAGE_REGISTRATION_ADMIN,
      note: 'Paid to DLD',
      payer: 'Buyer',
    })
    items.push({ key: 'valuation', label: 'Bank valuation fee + VAT', amount: VALUATION_FEE * (1 + VAT), note: 'Typically AED 2,500–3,500', payer: 'Buyer' })
    if (arrangementFee) {
      items.push({
        key: 'arrangement',
        label: 'Bank arrangement fee (up to 1%) + VAT',
        amount: loan * BANK_ARRANGEMENT_PCT * (1 + VAT),
        note: 'Some banks waive or cap it',
        payer: 'Buyer',
      })
    }
  }
  return items
}

export const sumCosts = (items: CostItem[]) => items.reduce((s, i) => s + i.amount, 0)

/* ------------------------------------------------------------------ */
/*  Yield / ROI                                                        */
/* ------------------------------------------------------------------ */

/** Gross yield (%) = annual rent / price. */
export const grossYield = (annualRent: number, price: number) => (price > 0 ? (annualRent / price) * 100 : 0)

/** Net yield (%) = (rent − running costs) / (price + purchase costs). */
export const netYield = (netIncome: number, totalInvested: number) => (totalInvested > 0 ? (netIncome / totalInvested) * 100 : 0)

/** Cash-on-cash (%) = annual pre-tax cash flow / cash put in. */
export const cashOnCash = (annualCashFlow: number, cashInvested: number) => (cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0)

export type RoiInputs = {
  price: number
  annualRent: number
  /** Annual service charge in AED. */
  serviceCharge: number
  /** Maintenance as % of annual rent. */
  maintenancePct: number
  vacancyWeeks: number
  /** Management fee as % of rent collected. */
  managementPct: number
  mortgage: boolean
  downPct: number
  rate: number
  years: number
}

export type RoiResult = {
  grossYield: number
  netYield: number
  vacancyLoss: number
  effectiveRent: number
  serviceCharge: number
  maintenance: number
  management: number
  netIncome: number
  purchaseCosts: number
  cashInvested: number
  annualDebtService: number
  annualCashFlow: number
  monthlyCashFlow: number
  cashOnCash: number | null
  loan: number
}

export function roi(i: RoiInputs): RoiResult {
  const vacancyLoss = i.annualRent * (clamp(i.vacancyWeeks, 0, 52) / 52)
  const effectiveRent = i.annualRent - vacancyLoss
  const maintenance = i.annualRent * (i.maintenancePct / 100)
  const management = effectiveRent * (i.managementPct / 100)
  const netIncome = effectiveRent - i.serviceCharge - maintenance - management

  const loan = i.mortgage ? i.price * (1 - i.downPct / 100) : 0
  const costs = sumCosts(purchaseCosts(i.price, { mortgage: i.mortgage, loanAmount: loan }))
  const totalInvested = i.price + costs
  const cashInvested = i.mortgage ? i.price - loan + costs : totalInvested
  const annualDebtService = i.mortgage ? monthlyPayment(loan, i.rate, i.years) * 12 : 0
  const annualCashFlow = netIncome - annualDebtService

  return {
    grossYield: grossYield(i.annualRent, i.price),
    netYield: netYield(netIncome, totalInvested),
    vacancyLoss,
    effectiveRent,
    serviceCharge: i.serviceCharge,
    maintenance,
    management,
    netIncome,
    purchaseCosts: costs,
    cashInvested,
    annualDebtService,
    annualCashFlow,
    monthlyCashFlow: annualCashFlow / 12,
    cashOnCash: i.mortgage ? cashOnCash(annualCashFlow, cashInvested) : null,
    loan,
  }
}

/* ------------------------------------------------------------------ */
/*  Rent vs buy                                                        */
/* ------------------------------------------------------------------ */

export type RentVsBuyInputs = {
  price: number
  annualRent: number
  years: number
  /** Expected annual price growth, %. */
  growthPct: number
  /** Expected annual rent increase, %. */
  rentIncreasePct: number
  /** Mortgage rate, %. */
  rate: number
  downPct: number
  /** Return the cash could earn if invested instead, %. */
  investReturnPct: number
  /** Annual service charge + maintenance when owning, AED. */
  ownershipCosts: number
  /** Mortgage term in years. */
  term?: number
}

export type RentVsBuyYear = {
  year: number
  /** Cumulative rent paid by the end of the year. */
  rentCost: number
  /** Net cost of owning if sold at the end of this year (after equity and sale). */
  buyCost: number
  homeValue: number
  equity: number
}

export type RentVsBuyResult = {
  rows: RentVsBuyYear[]
  upfrontCash: number
  monthlyMortgage: number
  breakEvenYear: number | null
  final: RentVsBuyYear
}

export function rentVsBuy(i: RentVsBuyInputs): RentVsBuyResult {
  const term = i.term ?? MAX_TERM_YEARS
  const loan = i.price * (1 - i.downPct / 100)
  const upfrontCash = i.price - loan + sumCosts(purchaseCosts(i.price, { mortgage: loan > 0, loanAmount: loan }))
  const monthly = monthlyPayment(loan, i.rate, term)
  const years = Math.max(1, Math.round(i.years))
  const g = i.growthPct / 100
  const ri = i.rentIncreasePct / 100
  const inv = i.investReturnPct / 100

  const rows: RentVsBuyYear[] = []
  let rentCum = 0
  let mortgageCum = 0
  let ownCum = 0
  let breakEvenYear: number | null = null

  for (let y = 1; y <= years; y++) {
    rentCum += i.annualRent * Math.pow(1 + ri, y - 1)
    mortgageCum += y <= term ? monthly * 12 : 0
    ownCum += i.ownershipCosts * Math.pow(1 + g, y - 1)
    const homeValue = i.price * Math.pow(1 + g, y)
    const balance = balanceAfter(loan, i.rate, term, y * 12)
    const saleProceeds = homeValue * (1 - SELLING_COST_PCT) - balance
    const opportunity = upfrontCash * (Math.pow(1 + inv, y) - 1)
    const buyCost = upfrontCash + mortgageCum + ownCum + opportunity - saleProceeds
    rows.push({ year: y, rentCost: rentCum, buyCost, homeValue, equity: homeValue - balance })
    if (breakEvenYear === null && buyCost < rentCum) breakEvenYear = y
  }

  return { rows, upfrontCash, monthlyMortgage: monthly, breakEvenYear, final: rows[rows.length - 1] }
}

/* ------------------------------------------------------------------ */
/*  Golden Visa (property route)                                       */
/* ------------------------------------------------------------------ */

export type GoldenVisaInputs = {
  totalValue: number
  offPlan: boolean
  mortgaged: boolean
  /** Amount paid so far (equity in a mortgaged home, or instalments paid on off-plan). */
  amountPaid: number
}

export type GoldenVisaResult =
  | { status: 'likely'; shortfall: 0 }
  | { status: 'check'; shortfall: number }
  | { status: 'not-yet'; shortfall: number }

/**
 * Indicative only. Value test: AED 2M+ in total (units can be combined).
 * Mortgaged / off-plan: the value can qualify, but conditions apply (bank NOC, approved developer,
 * amount paid). Under the stricter reading, the amount paid must itself reach AED 2M.
 */
export function goldenVisaCheck(i: GoldenVisaInputs): GoldenVisaResult {
  if (i.totalValue < GOLDEN_VISA_THRESHOLD) return { status: 'not-yet', shortfall: GOLDEN_VISA_THRESHOLD - i.totalValue }
  if (!i.mortgaged && !i.offPlan) return { status: 'likely', shortfall: 0 }
  if (i.amountPaid >= GOLDEN_VISA_THRESHOLD) return { status: 'likely', shortfall: 0 }
  return { status: 'check', shortfall: GOLDEN_VISA_THRESHOLD - i.amountPaid }
}
