import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as messagesApi from '../api/messages'
import type { Message } from '../api/types'
import { useMessagesQuery } from '../hooks/useMessagesQuery'

function renderUseMessagesQuery() {
  const queryClient = new QueryClient()
  const { result } = renderHook(() => useMessagesQuery(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
  return { result, queryClient }
}

describe('useMessagesQuery', () => {
  it('loads the latest messages on first fetch instead of the oldest', async () => {
    const fetchMessagesSpy = vi.spyOn(messagesApi, 'fetchMessages').mockResolvedValue([])

    renderUseMessagesQuery()

    await waitFor(() => expect(fetchMessagesSpy).toHaveBeenCalled())
    const [params] = fetchMessagesSpy.mock.calls[0]
    expect(params).toMatchObject({ limit: 50 })
    expect(params?.after).toBeUndefined()
    expect(params?.before).toBeDefined()
  })

  it('still caps the fetch once polling has an "after" cursor', async () => {
    const first: Message = {
      _id: '1',
      author: 'Alice',
      message: 'hi',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
    const fetchMessagesSpy = vi
      .spyOn(messagesApi, 'fetchMessages')
      .mockResolvedValueOnce([first])
      .mockResolvedValueOnce([])

    const { result } = renderUseMessagesQuery()

    await waitFor(() => expect(result.current.data).toHaveLength(1))

    await result.current.refetch()

    expect(fetchMessagesSpy).toHaveBeenCalledTimes(2)
    expect(fetchMessagesSpy.mock.calls[1][0]).toMatchObject({
      after: first.createdAt,
      limit: 50,
    })
  })
})
