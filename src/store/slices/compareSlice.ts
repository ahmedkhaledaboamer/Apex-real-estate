import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const MAX_COMPARE = 4

type CompareState = { ids: string[] }

const initialState: CompareState = { ids: [] }

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) state.ids = state.ids.filter((x) => x !== id)
      else if (state.ids.length < MAX_COMPARE) state.ids.push(id)
    },
    clearCompare(state) {
      state.ids = []
    },
  },
})

export const { toggleCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer
