import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UiState = {
  megaMenu: string | null
  mobileDrawerOpen: boolean
  modal: string | null
  cookieBannerOpen: boolean
}

const initialState: UiState = { megaMenu: null, mobileDrawerOpen: false, modal: null, cookieBannerOpen: true }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMegaMenu(state, action: PayloadAction<string | null>) {
      state.megaMenu = action.payload
    },
    setMobileDrawer(state, action: PayloadAction<boolean>) {
      state.mobileDrawerOpen = action.payload
    },
    openModal(state, action: PayloadAction<string>) {
      state.modal = action.payload
    },
    closeModal(state) {
      state.modal = null
    },
    setCookieBanner(state, action: PayloadAction<boolean>) {
      state.cookieBannerOpen = action.payload
    },
  },
})

export const { setMegaMenu, setMobileDrawer, openModal, closeModal, setCookieBanner } = uiSlice.actions
export default uiSlice.reducer
