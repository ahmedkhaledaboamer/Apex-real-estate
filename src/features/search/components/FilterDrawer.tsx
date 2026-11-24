import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { SearchParams } from '../schemas'
import type { SearchScope } from '../options'
import { FilterFields } from './FilterFields'

/** Mobile / tablet filters in a bottom sheet. Filters apply live; the footer button closes the sheet. */
export function FilterDrawer({
  open,
  onClose,
  scope,
  filters,
  setFilters,
  onClearAll,
  resultCount,
}: {
  open: boolean
  onClose: () => void
  scope: SearchScope
  filters: SearchParams
  setFilters: (next: Partial<SearchParams>) => void
  onClearAll: () => void
  resultCount: number | undefined
}) {
  return (
    <Modal open={open} onClose={onClose} title="Filters">
      <FilterFields scope={scope} filters={filters} setFilters={setFilters} layout="drawer" />
      <div className="mt-6 flex items-center gap-3 border-t border-line/70 pt-5">
        <Button variant="ghost" onClick={onClearAll}>
          Clear all
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={onClose}>
          {resultCount === undefined ? 'Show results' : `Show ${resultCount} ${resultCount === 1 ? 'property' : 'properties'}`}
        </Button>
      </div>
    </Modal>
  )
}
