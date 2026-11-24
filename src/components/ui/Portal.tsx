import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders children into <body>, but only in the browser after mount — safe for server rendering
 * (no `document` on the server) and for hydration (first client render matches the server: nothing).
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? createPortal(children, document.body) : null
}
