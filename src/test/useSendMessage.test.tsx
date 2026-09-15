import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as messagesApi from '../api/messages'
import type { CacheEntry, Message } from '../api/types'
import { useSendMessage } from '../hooks/useSendMessage'

function deferredPromise<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

function renderUseSendMessage() {
  const queryClient = new QueryClient()
  const { result } = renderHook(() => useSendMessage(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })
  return { result, queryClient }
}

function getCache(queryClient: QueryClient) {
  return queryClient.getQueryData<CacheEntry[]>(['messages']) ?? []
}

describe('useSendMessage', () => {
  it('adds the message to the cache right away, before the server responds', async () => {
    const { promise } = deferredPromise<Message>()
    vi.spyOn(messagesApi, 'postMessage').mockReturnValue(promise)

    const { result, queryClient } = renderUseSendMessage()

    result.current.mutate({ author: 'Alice', message: 'hey' })

    await waitFor(() => expect(getCache(queryClient)).toHaveLength(1))

    const [entry] = getCache(queryClient)
    expect(entry).toMatchObject({ author: 'Alice', message: 'hey', status: 'pending' })
  })

  it('swaps the pending message for the real one once the server confirms it', async () => {
    const confirmed: Message = {
      _id: 'server-id-1',
      author: 'Alice',
      message: 'hey',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
    vi.spyOn(messagesApi, 'postMessage').mockResolvedValue(confirmed)

    const { result, queryClient } = renderUseSendMessage()

    await result.current.mutateAsync({ author: 'Alice', message: 'hey' })

    const cache = getCache(queryClient)
    expect(cache).toHaveLength(1)
    expect(cache[0]).toEqual(confirmed)
  })

  it('marks the message as errored (not removed) if sending fails', async () => {
    vi.spyOn(messagesApi, 'postMessage').mockRejectedValue(new Error('network went boom'))

    const { result, queryClient } = renderUseSendMessage()

    await expect(
      result.current.mutateAsync({ author: 'Alice', message: 'hey' }),
    ).rejects.toThrow()

    const cache = getCache(queryClient)
    expect(cache).toHaveLength(1)
    expect(cache[0]).toMatchObject({ author: 'Alice', message: 'hey', status: 'error' })
  })

  it('does not re-add the message if it was already removed from the cache before the server replied', async () => {
    const { promise, resolve } = deferredPromise<Message>()
    vi.spyOn(messagesApi, 'postMessage').mockReturnValue(promise)

    const { result, queryClient } = renderUseSendMessage()

    result.current.mutate({ author: 'Alice', message: 'hey' })
    await waitFor(() => expect(getCache(queryClient)).toHaveLength(1))

    queryClient.setQueryData<CacheEntry[]>(['messages'], [])

    resolve({
      _id: 'server-id-2',
      author: 'Alice',
      message: 'hey',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getCache(queryClient)).toEqual([])
  })
})
