import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ListingKind } from '@/types'

export type FiltersState = {
  kind: ListingKind
  location: string
  propertyType: string | null
  minPrice: number | null
  maxPrice: number | null
  beds: number | null
}

const initialState: FiltersState = {
  kind: 'sale',
  location: '',
  propertyType: null,
  minPrice: null,
  maxPrice: null,
  beds: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      Object.assign(state, action.payload)
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setFilters, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
