import type { SearchParams } from '@/features/search/schemas'
import { PROPERTIES, propertyById } from '@/mocks/properties'
import type { Property } from '@/types'
import { filterProperties } from '@/lib/filterProperties'
import { mockDelay } from './client'

export { filterProperties }

// Mock-backed for now. When the API is ready, swap the bodies for
// apiClient<Property[]>('/properties', { params }) and keep the signatures.


export async function getProperties(filters: Partial<SearchParams> = {}): Promise<Property[]> {
  return mockDelay(filterProperties(PROPERTIES, filters))
}

export async function getProperty(id: string): Promise<Property | undefined> {
  return mockDelay(propertyById(id))
}
