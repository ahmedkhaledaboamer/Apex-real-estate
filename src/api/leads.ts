import type { Lead } from '@/types'
import { mockDelay } from './client'

/** Submit an enquiry / viewing / valuation lead. Replace with apiClient('/leads', { method: 'POST', body: lead }). */
export async function submitLead(lead: Lead): Promise<{ ok: true }> {
  void lead
  return mockDelay({ ok: true as const }, 500)
}
