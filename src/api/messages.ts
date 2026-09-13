import { request } from './client'
import type { Message, NewMessagePayload } from './types'

interface FetchMessagesParams {
  limit?: number
  after?: string
  before?: string
}

export function fetchMessages(params: FetchMessagesParams = {}, signal?: AbortSignal) {
  const query = new URLSearchParams()
  if (params.limit) query.set('limit', String(params.limit))
  if (params.after) query.set('after', params.after)
  if (params.before) query.set('before', params.before)

  const queryString = query.toString()
  return request<Message[]>(`/api/v1/messages${queryString ? `?${queryString}` : ''}`, {
    signal,
  })
}

export function postMessage(payload: NewMessagePayload, signal?: AbortSignal) {
  return request<Message>('/api/v1/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  })
}
