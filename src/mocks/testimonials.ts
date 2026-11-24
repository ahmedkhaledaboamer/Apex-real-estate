import { IMG } from '@/assets/images'
import type { Testimonial } from '@/types'

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Claire & Marco Bianchi', context: 'Bought in Dubai Marina', quote: 'Layla shortlisted five homes that genuinely matched our brief, explained every fee before we asked, and had the transfer done in three weeks.', avatar: IMG.couple, rating: 5 },
  { name: 'Rahul Mehta', context: 'Investor, JVC and Business Bay', quote: 'The yield numbers they showed me were the ones I actually got. No hype, just clear data and a team that answers WhatsApp at 10pm.', avatar: IMG.omar, rating: 5 },
  { name: 'Anastasia Volkova', context: 'Off-plan buyer, Creek Harbour', quote: 'Daniel walked me through the payment plan milestone by milestone and checked the escrow registration with me. I felt protected throughout.', avatar: IMG.sofia, rating: 5 },
]
