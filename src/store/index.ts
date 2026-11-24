import { configureStore } from '@reduxjs/toolkit'

import compare from './slices/compareSlice'
import favorites from './slices/favoritesSlice'
import filters from './slices/filtersSlice'
import preferences from './slices/preferencesSlice'
import ui from './slices/uiSlice'

export const store = configureStore({
  reducer: { filters, ui, preferences, favorites, compare },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
