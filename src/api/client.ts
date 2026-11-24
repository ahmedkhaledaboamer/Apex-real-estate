import { API_BASE_URL } from './config'

export class ApiError extends Error {
  status: number
  body?: unknown
  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  params?: Record<string, string | number | undefined>
}

/** Thin fetch wrapper: base URL, JSON in/out, typed errors. */
export async function apiClient<T>(path: string, { body, params, headers, ...init }: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v))
  }

  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) throw new ApiError(res.status, res.statusText, data)
  return data as T
}

/** Simulated latency for mock-backed endpoints. */
export const mockDelay = <T,>(value: T, ms = 300) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
