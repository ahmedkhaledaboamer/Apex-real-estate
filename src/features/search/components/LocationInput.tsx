import { useEffect, useId, useState } from 'react'

import { TextField } from '@/components/ui/Field'
import { useDebounce } from '@/hooks/useDebounce'
import { COMMUNITY_NAMES } from '../options'

/** Free-text location with community suggestions. Writes to the URL after a short debounce. */
export function LocationInput({
  value,
  onCommit,
  className,
}: {
  value: string | undefined
  onCommit: (location: string | undefined) => void
  className?: string
}) {
  const listId = useId()
  const [text, setText] = useState(value ?? '')
  const debounced = useDebounce(text, 350)

  // Push typed text to the URL once the user pauses.
  useEffect(() => {
    const next = debounced.trim() || undefined
    if (next !== (value || undefined)) onCommit(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // Pull external URL changes (chip removed, "Clear all") back into the box.
  useEffect(() => {
    if ((value || undefined) !== (debounced.trim() || undefined)) setText(value ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <>
      <TextField
        label="Location"
        type="search"
        placeholder="Community or building"
        autoComplete="off"
        list={listId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={className}
      />
      <datalist id={listId}>
        {COMMUNITY_NAMES.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </>
  )
}
