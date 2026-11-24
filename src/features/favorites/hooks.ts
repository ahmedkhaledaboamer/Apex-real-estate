import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { MAX_COMPARE, toggleCompare } from '@/store/slices/compareSlice'
import { toggleFavorite } from '@/store/slices/favoritesSlice'

export function useFavorite(id: string) {
  const dispatch = useAppDispatch()
  const favorite = useAppSelector((s) => s.favorites.ids.includes(id))
  return { favorite, toggle: () => dispatch(toggleFavorite(id)) }
}

export function useCompare(id: string) {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)
  const inCompare = ids.includes(id)
  return { inCompare, full: !inCompare && ids.length >= MAX_COMPARE, toggle: () => dispatch(toggleCompare(id)) }
}

export function useCurrency() {
  return useAppSelector((s) => s.preferences.currency)
}
