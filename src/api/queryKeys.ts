import type { SearchParams } from '@/features/search/schemas'

/** All React Query cache keys in one place. */
export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    list: (filters: Partial<SearchParams>) => ['properties', 'list', filters] as const,
    detail: (id: string) => ['properties', 'detail', id] as const,
  },
}
