import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_CURRENCY, DEFAULT_LANG } from '@/lib/constants'
import type { Currency, Direction, Lang } from '@/types'

type PreferencesState = { currency: Currency; language: Lang; direction: Direction }

const initialState: PreferencesState = { currency: DEFAULT_CURRENCY, language: DEFAULT_LANG, direction: 'ltr' }

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      state.currency = action.payload
    },
    setLanguage(state, action: PayloadAction<Lang>) {
      state.language = action.payload
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr'
    },
  },
})

export const { setCurrency, setLanguage } = preferencesSlice.actions
export default preferencesSlice.reducer
