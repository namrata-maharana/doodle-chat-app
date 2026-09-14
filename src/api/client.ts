import { ApiError } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN = import.meta.env.VITE_API_TOKEN
const REQUEST_TIMEOUT_MS = 10_000

function extractErrorMessage(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === 'object' &&
    'error' in body &&
    body.error &&
    typeof body.error === 'object' &&
    'message' in body.error &&
    Array.isArray(body.error.message)
  ) {
    return body.error.message.map((issue) => issue.message).join(', ')
  }

  return fallback
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const signal = init.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    signal,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(extractErrorMessage(body, response.statusText), response.status)
  }

  return response.json()
}
