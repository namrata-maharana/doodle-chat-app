import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postMessage } from '../api/messages'
import type { CacheEntry, NewMessagePayload, PendingMessage } from '../api/types'

interface MutationContext {
  clientId: string
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NewMessagePayload) => postMessage(payload),

    onMutate: async (payload): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ['messages'] })

      const pending: PendingMessage = {
        clientId: crypto.randomUUID(),
        author: payload.author,
        message: payload.message,
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      queryClient.setQueryData<CacheEntry[]>(['messages'], (current = []) => [
        ...current,
        pending,
      ])

      return { clientId: pending.clientId }
    },

    onError: (_error, _payload, context) => {
      if (!context) return

      queryClient.setQueryData<CacheEntry[]>(['messages'], (current = []) =>
        current.map((entry) =>
          'clientId' in entry && entry.clientId === context.clientId
            ? { ...entry, status: 'error' as const }
            : entry,
        ),
      )
    },

    onSuccess: (confirmed, _payload, context) => {
      if (!context) return

      queryClient.setQueryData<CacheEntry[]>(['messages'], (current = []) => {
        const stillPending = current.some(
          (entry) => 'clientId' in entry && entry.clientId === context.clientId,
        )
        if (!stillPending) return current

        return current.map((entry) =>
          'clientId' in entry && entry.clientId === context.clientId ? confirmed : entry,
        )
      })
    },
  })
}
